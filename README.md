# Kaeru — La Voie de l'Étang

Beat'em all 2D, estampe japonaise peinte. Une grenouille samouraï ramène une petite flamme chez elle.

## Jouer (Windows)

Télécharge `Kaeru-Setup-x.y.z.exe` dans **Releases** (à droite), puis lance-le.
Si Windows affiche « Windows a protégé votre ordinateur » : **Informations complémentaires** → **Exécuter quand même**.
Le jeu se met à jour tout seul à chaque lancement.

- **F11** : plein écran
- Manette et clavier reconnus

## Publier une nouvelle version

1. Remplacer le contenu de `game/` par la nouvelle version du jeu.
2. Augmenter `"version"` dans `package.json` (ex. 1.0.0 → 1.0.1).
3. Onglet **Actions** → **Fabriquer Kaeru** → **Run workflow**.
4. Environ 10 min plus tard, la version apparaît dans **Releases** et les joueurs la reçoivent au prochain lancement.
