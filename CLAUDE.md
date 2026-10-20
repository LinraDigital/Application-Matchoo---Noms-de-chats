@AGENTS.md

# Matchoo – Noms de chats : contexte du projet

> Variante de **Matchoo – Noms de chiens** (copie du 19/10/2026) : mêmes données (`assets/noms.db`) et mêmes écrans, mais design refait (palette lavande, polices Fredoka + Nunito, barre d'onglets flottante, carte à bandeau violet, icône violette générée) pour éviter un refus du store pour ressemblance.

Projet perso de Julien (Linra Digital). Répondre et commenter en **français**.
Julien développe sous **Windows (PowerShell)** ; il teste sur iPhone et Android.

## Le produit

Dérivé de **Matchoo - Noms de chevaux** (projet voisin), mais volontairement plus simple : la base ne contient
qu'une liste de noms, sans sexe ni statistiques. Donc :
- Onglets **Découvrir** (swipe façon Tinder : droite = favori, gauche = écarté, annulation possible), **Favoris**
  (recherche, retrait par balayage avec annulation, partage, comparaison par QR code) et **Filtres**
  (longueur, un mot / composé, initiale, nom de famille pour tester la sonorité).
- Pas d'onglet Tendances ni de fiche détaillée (aucune donnée pour les alimenter).
- Nom public : « Matchoo - Noms de chats ». Identifiant `fr.linradigital.matchoo.chats`, slug `matchoo-noms-chats`, scheme `matchoo-chats`.
- Palette lavande dans `src/lib/theme.ts` : violet `#7B5CD6` (principal), `#9B6FF0` (accent), fond `#F4F0FF`, encre `#2A2150`, touche rose `#F58FBF`. Polices : Fredoka + Nunito.
- **Icône** : image fournie par Julien (chaton endormi, fond blanc), seulement redimensionnée (`assets/images/`). Android adaptatif : premier plan = l'image à 66 %, arrière-plan blanc.

## Données

`assets/noms.db` (SQLite embarquée, lecture seule, fournie par Julien, 8 148 noms, ~365 Ko).
Table `names(id, name UNIQUE NOCASE, letter, word_count)` + index sur `letter`. Noms américains (anglais).
`src/lib/noms.ts` applique toujours deux garde-fous : `name NOT GLOB '*[^A-Za-z -]*'` (pas de ponctuation exotique :
points, parenthèses, guillemets, apostrophes) et `word_count <= 3`. Si la base change, incrémenter `NOMS_DB`
(`noms-v1.db` → `v2`) pour forcer la recopie sur les appareils.
Favoris/swipes : base séparée `matchoo-chiens-user.db` (référencés par nom).

## À faire

1. **AdMob** : vrais identifiants de Julien renseignés (Android + iOS).
2. **EAS** : `projectId` renseigné dans `app.config.ts` (projet `matchoo-noms-chats`) ; reste les builds (`npx eas-cli@latest build ...`).
3. Tester sur téléphone (`npx expo start`) : seuls `tsc` et `expo export` ont été lancés.
4. Vérifier la disponibilité du nom, fiche store, politique de confidentialité.

`npx expo lint` : 2 erreurs react-compiler (CarteNom, index) **identiques à celles des autres applis Matchoo**.
Vérifier avant de rendre : `npx tsc --noEmit`.

