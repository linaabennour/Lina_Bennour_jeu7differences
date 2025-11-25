(function(){
const levels = {
    facile: [[40,60,28],[110,85,26],[175,60,28],[220,120,28],[260,150,26],[300,200,28],[330,220,26]],
    moyen:  [[55,70,28],[120,95,26],[180,62,28],[235,128,28],[275,158,26],[315,208,28],[350,230,26]],
    difficile: [[60,50,26],[130,80,28],[195,58,28],[250,110,28],[290,152,28],[330,195,28],[370,220,26]]
};

const images = {
    facile: ["image_facile_1.jpg", "image_facile_2.jpg"],
    moyen: ["image_moyen_1.jpg", "image_moyen_2.jpg"],
    difficile: ["image_diff_1.jpg", "image_diff_2.jpg"]
};
const foundDisplay = document.getElementById("found");
const maxLives = 5;
let selectedHouse = "gryffindor";
let selectedLevel = "facile";
let found = 0;
let lives = maxLives;
let time = 0;
let timerInterval = null;

let coins = 0;
let hintAvailable = false;

let lastClickWasArea = false;

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
const errorsDisplay = document.getElementById("errors");
const livesDisplay = document.getElementById("lives");

const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popup-title");
const popupText = document.getElementById("popup-text");
const popupBtn = document.getElementById("popup-btn");

const restartBtn = document.getElementById("restartBtn");


const rulesBtn = document.getElementById("rulesBtn");
const optionsBtn = document.getElementById("optionsBtn");
const panels = document.querySelectorAll(".panel");

function setHouse(house) {
    document.body.classList.remove("gryffindor","slytherin","ravenclaw","hufflepuff");
    document.body.classList.add(house);
    selectedHouse = house;
}

function startTimer() {
    stopTimer();
    time = 0;
    timerDisplay.textContent = ` Temps : 0s`;
    timerInterval = setInterval(() => {
        time++;
        timerDisplay.textContent = ` Temps : ${time}s`;
    }, 1000);
}

function stopTimer() { clearInterval(timerInterval); }

function showPopup(title, text) {
    popupTitle.textContent = title;
    popupText.textContent = text;
    popup.style.display = "flex";
}

function hidePopup() {
    popup.style.display = "none";
}

function createSpark(x, y) {
    const s = document.createElement("div");
    s.className = "spark " + selectedHouse;
    s.style.left = x + "px";
    s.style.top = y + "px";
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 600);
}

function updateDisplays() {
    livesDisplay.textContent = ` Vies : ${lives}`;
    coinsDisplay.textContent = coins;
    coinsDisplayShop.textContent = coins;
    foundDisplay.textContent = `Différences trouvées : ${found} / 7`;
}

function createAreas(level) {
    mapArea.innerHTML = "";
    levels[level].forEach(coords => {
        const [x, y, r] = coords;
        const area = document.createElement("area");
        area.shape = "circle";
        area.coords = `${x},${y},${r}`;
        area.dataset.found = "false";

        area.addEventListener("click", e => {
            e.preventDefault();
            lastClickWasArea = true;
            setTimeout(()=> lastClickWasArea = false, 50);

            if (area.dataset.found === "true") return;

            area.dataset.found = "true";
            found++;
            coins += 5; 
            updateDisplays();

            const rect = img2.getBoundingClientRect();
            const px = rect.left + (x / 350) * rect.width;
            const py = rect.top + (y / 260) * rect.height;
            createSpark(px, py);

            if (found >= 7) {
                stopTimer();
                coins += 30;
                updateDisplays();
                showPopup("Bravo !" `🎉 Tu as trouvé les 7 différences !\nTemps : ${time}s\nErreurs : ${errors}\nPièces : ${coins} 🪙`);
            }
        });

        mapArea.appendChild(area);
    });
}

function startGame() {
    img1.src = images[selectedLevel][0];
    img2.src = images[selectedLevel][1];

    createAreas(selectedLevel);

    found = 0;
    lives = maxLives;

    updateDisplays();

    startScreen.style.display = "none";
    game.style.display = "block";

    startTimer();
}

function restartGame() {
    stopTimer();
    hidePopup();
    found = 0;
    lives = maxLives;
    time = 0;

    updateDisplays();

    createAreas(selectedLevel);
    game.style.display = "none";
    startScreen.style.display = "block";
}

img2.addEventListener("click", (e) => {
    if (lastClickWasArea) return;
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
document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const item = btn.dataset.item;

        if (item === "life" && coins >= 20) {
            coins -= 20;
            lives++;
            updateDisplays();
        }

        else if (item === "time" && coins >= 25) {
            coins -= 25;
            time = Math.max(0, time - 10);
            timerDisplay.textContent = ` Temps : ${time}s`;
            updateDisplays();
        }

        else if (item === "hint" && coins >= 35) {
            coins -= 35;
            hintAvailable = true;
            updateDisplays();
            alert("✨ Indice activé : double-clique sur l'image pour révéler une différence.");
        } else {
            if (coins < (item === "life" ? 20 : item === "time" ? 25 : 35)) {
                alert("Pas assez de pièces !");
            }
        }
    });
});

img2.addEventListener("dblclick", () => {
    if (!hintAvailable) return;

    const area = [...mapArea.children].find(a => a.dataset.found === "false");
    if (!area) return;

    const [x, y] = area.coords.split(",").map(Number);

    const rect = img2.getBoundingClientRect();
    const px = rect.left + (x / 350) * rect.width;
    const py = rect.top + (y / 260) * rect.height;

    createSpark(px, py);

    hintAvailable = false;
});

houseBtns.forEach(btn =>
    btn.addEventListener("click", () => setHouse(btn.dataset.house))
);

levelBtns.forEach(btn =>
    btn.addEventListener("click", () => {
        selectedLevel = btn.dataset.level;
        levelBtns.forEach(b => b.style.opacity = "0.6");
        btn.style.opacity = "1";
    })
);

startBtn.addEventListener("click", () => startGame());
restartBtn.addEventListener("click", () => restartGame());

[shopBtn, shopBtnStart].forEach(button => {
    if (!button) return;
    button.addEventListener("click", () => {
        shop.style.display = "flex";
        updateDisplays();
    });
});
if (closeShop) closeShop.addEventListener("click", () => shop.style.display = "none");

popupBtn.addEventListener("click", () => {
    hidePopup();
    restartGame();
});

if (rulesBtn) rulesBtn.addEventListener("click", ()=> document.getElementById('rules').style.display = 'block');
if (optionsBtn) optionsBtn.addEventListener("click", ()=> document.getElementById('options').style.display = 'block');
document.querySelectorAll('.close-panel').forEach(b => b.addEventListener('click', (e)=> e.target.closest('.panel').style.display = 'none'));

setHouse("gryffindor");
updateDisplays();
createAreas(selectedLevel);

})();