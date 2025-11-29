Nom du jeu : Jeu des 7 différences — Harry Houses
Description :
Ce projet est un jeu interactif en ligne où le joueur doit trouver les 7 différences entre deux images similaires. 
Le thème est inspiré de l’univers de Harry Potter : les joueurs choisissent leur maison (Gryffondor, Serpentard, Serdaigle, Poufsouffle) et peuvent débloquer des bonus grâce à des pièces. Le jeu propose plusieurs niveaux de difficulté et intègre des effets visuels et sonores pour rendre l’expérience immersive.

Technologies utilisées :
-HTML5 : structure de la page et éléments interactifs
-CSS3 : mise en forme, animations, transitions, thèmes par maison
-JavaScript (Vanilla JS) : logique du jeu, gestion des clics, timer, animations, magasin
-Audio & Media : sons pour clics et animations
-Google Fonts : MedievalSharp, Cormorant Garamond pour le style magique
-Images locales pour les deux versions de chaque niveau et pour le parchemin (background)

Fonctionnalités principales :
-Choix de la maison et du niveau de difficulté
-Timer dynamique avec ajustement de vitesse
-Système de vies et gestion des erreurs
-Collecte de pièces en trouvant les différences
-Magasin d’objets magiques : vie supplémentaire, indice, réduction de temps
-Effets visuels “spark” et animations de hints
-Options : activer/désactiver le son, régler le volume, activer/désactiver les animations
-Popups pour messages et résultats
-Redémarrage automatique en cas de perte ou victoire
-Fonction de récupération des coordonnées d’un point : permet de connaître les coordonnées exactes d’un clic sur l’image (utile pour créer ou tester les zones cliquables)

Lien vers la page GitHub Pages :
https://linaabennour.github.io/Lina_Bennour_jeu7differences/

Nouveautés explorées :
-Gestion dynamique des zones cliquables proportionnelles à la taille des images
-Animation CSS pour les sparks et les hints
-Gestion des options globales (son, volume, vitesse timer)
-Intégration de popups interactifs avec messages dynamiques
-Développement d’un système de magasin avec achats et remboursement en cas d’erreur
-Gestion des événements complexes : clics sur zones spécifiques vs clics sur l’image entière
-Développement d’une fonction pour obtenir les coordonnées précises d’un point cliqué

Difficultés rencontrées :
-Calcul précis des coordonnées des différences proportionnellement à l’image redimensionnée
-Gestion des événements de clic et des conflits entre zones cliquables et image principale
-Assurer le fonctionnement du son sur tous les navigateurs (Chrome bloque le son si non déclenché par un clic)
-Synchronisation des animations visuelles et mises à jour des compteurs (vies, pièces, différences trouvées)
-Redémarrage automatique et réinitialisation complète du jeu

Solutions apportées :
-Recherche et tests pour normaliser les coordonnées selon la taille réelle de l’image (scaling)
-Utilisation de stopPropagation() pour éviter que les clics sur les zones cliquables ne déclenchent la perte de vie
-Création de fonctions centralisées pour mettre à jour l’affichage et gérer les animations
-Organisation du code JS en sections claires et modulaires pour faciliter la maintenance et le debug
