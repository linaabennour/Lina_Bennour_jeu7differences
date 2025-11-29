(function () {

    // Définition des niveaux : chaque entrée = [x, y, rayon]
    const levels = {
        facile: [[195, 181, 28], [112, 210, 26], [220, 156, 28], [229, 40, 28], [88, 75, 26], [211, 75, 28], [328, 131, 26]],
        moyen: [[28, 81, 28], [17, 224, 26], [148, 104, 28], [218, 63, 28], [237, 79, 26], [288, 97, 28], [303, 145, 26]],
        difficile: [[55, 159, 26], [188, 224, 28], [163, 106, 28], [222, 147, 28], [290, 136, 28], [334, 103, 28], [180, 157, 26]]
    };

    // Images par niveau (image originale + image modifiée)
    const images = {
        facile: ["image_facile_1.jpg", "image_facile_2.jpg"],
        moyen: ["image_moyen_1.jpg", "image_moyen_2.jpg"],
        difficile: ["image_diff_1.jpg", "image_diff_2.jpg"]
    };

    const maxLives = 5; // Vies maximum
    let selectedHouse = "gryffindor"; // Maison par défaut
    let selectedLevel = "facile";     // Niveau par défaut
    let found = 0;     // Nombre de différences trouvées
    let lives = maxLives;
    let time = 0;
    let timerInterval = null;
    let coins = 0;

    // Options générales du jeu
    const options = { sound: true, sparkAnim: true, hintAnim: true, timerSpeed: 1000 };

    // Récupération de tous les éléments HTML
    const clickSound = document.getElementById("click-sound");
    const startScreen = document.getElementById("start-screen");
    const startBtn = document.getElementById("start-btn");
    const shopBtnStart = document.getElementById("shopBtnStart");
    const shopBtn = document.getElementById("shopBtn");
    const shop = document.getElementById("shop");
    const closeShop = document.getElementById("closeShop");
    const coinsDisplay = document.getElementById("coins");
    const coinsDisplayShop = document.getElementById("coinsShop");
    const houseBtns = document.querySelectorAll(".house-btn");
    const levelBtns = document.querySelectorAll(".level-btn");
    const game = document.getElementById("game");
    const img1 = document.getElementById("img1");
    const img2 = document.getElementById("img2");
    const mapArea = document.getElementById("map-area");
    const timerDisplay = document.getElementById("timer");
    const livesDisplay = document.getElementById("lives");
    const foundDisplay = document.getElementById("found");
    const popup = document.getElementById("popup");
    const popupTitle = document.getElementById("popup-title");
    const popupText = document.getElementById("popup-text");
    const popupBtn = document.getElementById("popup-btn");
    const restartBtn = document.getElementById("restartBtn");
    const rulesBtn = document.getElementById("rulesBtn");
    const optionsBtn = document.getElementById("optionsBtn");
    const toggleSound = document.getElementById("toggle-sound");
    const toggleSpark = document.getElementById("toggle-spark");
    const toggleHint = document.getElementById("toggle-hint");
    const timerSpeedSelect = document.getElementById("timer-speed");

    // Fonction pour jouer un clic si le son est activé
    function playClickSound() {
        if (options.sound) {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.warn("Audio play error:", e));
        }
    }

    // Changer la maison (modifie l'apparence avec des classes CSS)
    function setHouse(house) {
        document.body.classList.remove("gryffindor", "slytherin", "ravenclaw", "hufflepuff");
        document.body.classList.add(house);
        selectedHouse = house;
    }

    // Lancer le timer (vitesse dépend de options.timerSpeed)
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        time = 0;
        timerDisplay.textContent = `Temps : 0s`;

        timerInterval = setInterval(() => {
            time++;
            timerDisplay.textContent = `Temps : ${time}s`;
        }, options.timerSpeed);
    }

    // Stop timer
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Affichage d'un popup personnalisé
    function showPopup(title, text) {
        popupTitle.textContent = title;
        popupText.textContent = text;
        popup.style.display = "flex";
    }

    // Masquer le popup
    function hidePopup() {
        popup.style.display = "none";
    }

    // Effet spark quand on clique sur une différence
    function createSpark(x, y) {
        if (!options.sparkAnim) return;

        const s = document.createElement("div");
        s.className = "spark " + selectedHouse;
        s.style.left = x + "px";
        s.style.top = y + "px";

        document.body.appendChild(s);

        // Supprimer après animation
        setTimeout(() => s.remove(), 600);
    }

    // Mise à jour affichage (vies/pièces/trouvées)
    function updateDisplays() {
        livesDisplay.textContent = `Vies : ${lives}`;
        coinsDisplay.textContent = coins;
        coinsDisplayShop.textContent = coins;
        foundDisplay.textContent = `Différences trouvées : ${found} / 7`;
    }

    // Création des zones cliquables sur l'image
    function createAreas(level) {
        mapArea.innerHTML = ""; // Reset

        const rect = img2.getBoundingClientRect();
        const imgWidth = rect.width;
        const imgHeight = rect.height;

        // On attend si l'image n'est pas encore chargée
        if (imgWidth === 0 || imgHeight === 0) {
            setTimeout(() => createAreas(level), 100);
            return;
        }

        // Création de chaque zone définie dans levels[level]
        levels[level].forEach(coords => {
            const [x, y, r] = coords;

            // Compense le scaling de l'image
            const radiusMultiplier = 1.3;
            const adjustedR = r * radiusMultiplier;

            const zone = document.createElement("div");
            zone.className = "click-zone";

            // Taille et position proportionnelle à l'image affichée
            zone.style.width = zone.style.height = `${(adjustedR / 350) * imgWidth * 2}px`;
            zone.style.left = `${(x / 350) * imgWidth - (adjustedR / 350) * imgWidth}px`;
            zone.style.top = `${(y / 260) * imgHeight - (adjustedR / 260) * imgHeight}px`;

            zone.style.borderRadius = "50%";
            zone.style.cursor = "pointer";
            zone.dataset.found = "false";
            zone.style.background = "rgba(255,0,0,0)";

            // Détection d'une bonne différence
            zone.addEventListener("click", e => {
                e.stopPropagation(); // éviter de décrémenter les vies

                if (zone.dataset.found === "true") return;

                zone.dataset.found = "true";

                found++;
                coins += 5;
                updateDisplays();
                playClickSound();

                // Effet spark à la bonne position
                const px = (x / 350) * imgWidth + rect.left;
                const py = (y / 260) * imgHeight + rect.top;
                createSpark(px, py);

                // Si gagné
                if (found >= 7) {
                    stopTimer();
                    coins += 30;
                    updateDisplays();
                    showPopup("Bravo !", `🎉 Tu as trouvé les 7 différences !\nTemps : ${time}s\nPièces : ${coins} 🪙`);
                }
            });

            mapArea.appendChild(zone);
        });
    }

    // Gestion d’achat au magasin
    function buyItem(item) {
        let cost = 0;
        if (item === "life") cost = 20;
        if (item === "hint") cost = 35;
        if (item === "time") cost = 25;

        if (coins < cost) {
            showPopup("Pas assez de pièces", "Tu n'as pas assez de pièces pour cet objet.");
            return;
        }

        coins -= cost;
        updateDisplays();

        // Effet des objets
        if (item === "life") {
            lives = Math.min(maxLives, lives + 1);
            showPopup("Achat réussi", "Tu as gagné une vie supplémentaire ! ❤️");
        }

        else if (item === "time") {
            time = Math.max(0, time - 10);
            timerDisplay.textContent = `Temps : ${time}s`;
            showPopup("Achat réussi", "Le temps a été réduit de 10 secondes ! ⏱️");
        }

        else if (item === "hint") {
            const zones = document.querySelectorAll(".click-zone");
            const target = Array.from(zones).find(z => z.dataset.found === "false");

            if (!target) {
                coins += cost; // remboursement
                updateDisplays();
                showPopup("Indice", "Il ne reste plus de différences !");
                return;
            }

            // Animation hint
            if (options.hintAnim) {
                target.classList.add("hint");
                setTimeout(() => target.classList.remove("hint"), 2000);
            }

            showPopup("Indice", "Regarde bien, une différence s'est illuminée ! ✨");
        }
    }

    // Lancer une partie
    function startGame() {
        img1.src = images[selectedLevel][0];
        img2.src = images[selectedLevel][1];

        found = 0;
        lives = maxLives;
        updateDisplays();

        // Cacher l'écran d'accueil
        startScreen.style.display = "none";
        game.style.display = "block";

        // Créer les zones une fois l’image chargée
        if (img2.complete) createAreas(selectedLevel);
        else img2.onload = () => createAreas(selectedLevel);

        startTimer();
    }

    // Redémarrer le jeu
    function restartGame() {
        stopTimer();
        hidePopup();

        found = 0;
        lives = maxLives;
        time = 0;
        updateDisplays();

        game.style.display = "none";
        startScreen.style.display = "block";
    }

    // Si l'utilisateur clique sur l'image modifiée mais PAS sur une différence → perte de vie
    img2.addEventListener("click", e => {
        lives--;
        updateDisplays();
        createSpark(e.pageX, e.pageY);

        if (lives <= 0) {
            stopTimer();
            showPopup("Game Over", "Tu as perdu toutes tes vies. Le jeu va redémarrer.");
            setTimeout(() => {
                hidePopup();
                restartGame();
            }, 1200);
        }
    });

    // Sélection maison
    houseBtns.forEach(btn =>
        btn.addEventListener("click", () => setHouse(btn.dataset.house))
    );

    // Sélection niveau
    levelBtns.forEach(btn =>
        btn.addEventListener("click", () => {
            selectedLevel = btn.dataset.level;

            // Highlight du bouton choisi
            levelBtns.forEach(b => b.style.opacity = "0.6");
            btn.style.opacity = "1";
        })
    );

    // Bouton jouer
    startBtn.addEventListener("click", startGame);
    restartBtn.addEventListener("click", restartGame);

    // Ouvrir boutique depuis start + dans le jeu
    [shopBtn, shopBtnStart].forEach(button => {
        if (!button) return;
        button.addEventListener("click", () => {
            shop.style.display = "flex";
            updateDisplays();
        });
    });

    if (closeShop)
        closeShop.addEventListener("click", () => shop.style.display = "none");

    // Fermer popup
    popupBtn.addEventListener("click", () => hidePopup());

    // Boutons de fermeture de panneaux
    document.querySelectorAll('.close-panel').forEach(b =>
        b.addEventListener('click', e =>
            e.target.closest('.panel').style.display = 'none'
        )
    );

    // Achats
    document.querySelectorAll(".buy-btn").forEach(btn =>
        btn.addEventListener("click", () => buyItem(btn.dataset.item))
    );

    // Options : son
    if (toggleSound)
        toggleSound.addEventListener("change", () =>
            options.sound = toggleSound.checked
        );

    // Options : sparks
    if (toggleSpark)
        toggleSpark.addEventListener("change", () =>
            options.sparkAnim = toggleSpark.checked
        );

    // Options : hint animé
    if (toggleHint)
        toggleHint.addEventListener("change", () =>
            options.hintAnim = toggleHint.checked
        );

    // Options : vitesse timer
    if (timerSpeedSelect) {
        timerSpeedSelect.addEventListener("change", () => {
            options.timerSpeed = parseInt(timerSpeedSelect.value);
            if (timerInterval) startTimer(); // relance timer
        });
    }

    // Maison par défaut + affichages
    setHouse("gryffindor");
    updateDisplays();

    // Contrôle volume cliquable
    const volumeControl = document.getElementById("volume-control");
    if (volumeControl) {
        clickSound.volume = volumeControl.value / 100;
        volumeControl.addEventListener("input", () => {
            clickSound.volume = volumeControl.value / 100;
        });
    }

    // Animation d'apparition du menu d'accueil
    document.querySelectorAll("#start-screen h1, #start-screen .house-btn, #start-screen .level-btn").forEach((el, i) => {
        el.style.opacity = 0;
        el.style.transform = "translateY(50px)";
        setTimeout(() => {
            el.style.transition = "all 0.6s ease-out";
            el.style.opacity = 1;
            el.style.transform = "translateY(0px)";
        }, i * 200);
    });

    // Animation règles
    function showRules() {
        const rules = document.getElementById('rules');
        rules.style.display = 'block';
        rules.style.opacity = 0;
        rules.style.transform = 'scaleY(0)';

        setTimeout(() => {
            rules.style.transition = 'all 0.6s ease-out';
            rules.style.opacity = 1;
            rules.style.transform = 'scaleY(1)';
        }, 50);
    }

    if (rulesBtn) rulesBtn.addEventListener('click', showRules);

    // Options panel
    const optionsPanel = document.getElementById('options');
    if (optionsBtn && optionsPanel) {
        optionsBtn.addEventListener('click', () => {
            optionsPanel.classList.add('show');
            optionsPanel.style.display = 'block';
        });
    }

    // Hack audio pour Chrome (permet de débloquer l'audio dès le premier clic)
    document.addEventListener("click", function unlockAudio() {
        clickSound.play().catch(() => {});
        document.removeEventListener("click", unlockAudio);
    });

    // Animation fermeture panneau options
    document.querySelectorAll('.close-panel').forEach(b =>
        b.addEventListener('click', e => {
            const panel = e.target.closest('.panel');
            panel.classList.remove('show');
            setTimeout(() => panel.style.display = 'none', 300);
        })
    );

})();
