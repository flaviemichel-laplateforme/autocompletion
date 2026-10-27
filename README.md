# 🍽️ MiamMiam — Moteur de recherche de recettes avec autocomplétion

Application web de recherche de recettes développée en **React** dans le cadre de ma formation **Développeur Web et Web Mobile (DWWM)** à **La Plateforme_**.

Elle interroge l'API publique [TheMealDB](https://www.themealdb.com/api.php) et propose une recherche avec suggestions en temps réel, un filtrage par catégorie et une fiche détaillée pour chaque recette.

🔗 **Démo en ligne : [autocompletion1.vercel.app](https://autocompletion1.vercel.app)**

## ✨ Fonctionnalités

- **Autocomplétion** : dès 2 caractères, des suggestions s'affichent, séparées en deux groupes (« commence par » puis « contient »), avec miniature du plat.
- **Debounce (300 ms)** : l'API n'est appelée qu'une fois la frappe terminée, pour éviter les requêtes inutiles.
- **Page de résultats** (`/search?q=...`) : grille de recettes, avec filtre par catégorie sur les résultats.
- **Navigation par catégorie** depuis l'accueil (liste dépliable, bouton de réinitialisation).
- **Fiche recette** (`/recipe/:id`) : image, ingrédients et mesures, instructions découpées en paragraphes.
- **Interface en français** : catégories et zones géographiques traduites via un dictionnaire (`src/utils/translations.js`).
- Gestion des états de chargement, des erreurs réseau et des résultats vides.
- **Accessibilité** : autocomplétion au clavier (↑ ↓ Entrée Échap) selon le pattern ARIA *combobox/listbox*, lien d'évitement, focus visible, contrastes corrigés, titres hiérarchisés, messages annoncés aux lecteurs d'écran.
- **Responsive** : mobile-first, grilles fluides (`auto-fill` + `minmax`), typographie fluide (`clamp()`), header qui passe sur deux lignes sur mobile.

## 🛠️ Stack technique

| Outil | Rôle |
|---|---|
| React 19 | Interface en composants, hooks (`useState`, `useEffect`) |
| React Router DOM 7 | Routage côté client, paramètres d'URL |
| Vite 7 | Serveur de développement et build |
| ESLint | Qualité du code |
| TheMealDB (REST) | Source des données |
| CSS | Un fichier par composant, sans framework |

## 🗂️ Architecture

```
src/
├── App.jsx                  # Routeur et routes
├── main.jsx                 # Point d'entrée
├── components/
│   ├── Header/              # Logo + barre de recherche (hors accueil)
│   ├── RecipeCard/          # Carte de recette réutilisée (accueil + résultats)
│   └── SearchBar/           # Autocomplétion (debounce, filtrage, clavier, ARIA)
├── hooks/
│   └── useDocumentTitle.js  # Titre de l'onglet par page
├── services/
│   └── mealApi.js           # Appels TheMealDB (encodage, annulation, cache)
├── pages/
│   ├── Home/                # Accueil, catégories
│   ├── SearchResults/       # Résultats + filtre par catégorie
│   └── RecipeDetail/        # Détail d'une recette
└── utils/
    ├── images.js            # Variantes réduites des images (/small, /medium, /large)
    └── translations.js      # Dictionnaires EN → FR
```

| Route | Page |
|---|---|
| `/` | Accueil |
| `/search?q=pizza` | Résultats de recherche |
| `/recipe/:id` | Détail d'une recette |

## 🧠 Points techniques notables

- **Debounce avec `useEffect`** : le `setTimeout` est annulé dans la fonction de nettoyage de l'effet à chaque nouvelle frappe.
- **Algorithme de suggestion** : deux filtres successifs (`startsWith`, puis `includes` sans `startsWith`), limités à 5 résultats chacun.
- **Annulation et cache** : chaque `useEffect` de chargement annule sa requête au démontage, et `mealApi.js` met en cache les réponses.
- **Normalisation des données de l'API** : TheMealDB renvoie `strIngredient1…20` ; une boucle les transforme en tableau d'objets `{ name, measure }`.
- **`null` au lieu d'un tableau vide** : l'API renvoie `meals: null` quand rien n'est trouvé, géré avec `data.meals || []`.
- **Composition** : `SearchBar` est réutilisé dans le `Header` et dans l'accueil.

## ⚡ Performance et accessibilité (Lighthouse)

Mesures sur le build de production (`npm run build && npm run preview`), Lighthouse 12, Chrome headless. Scores : Performance / Accessibilité / Bonnes pratiques / SEO.

| Page | Mobile | Desktop |
|---|---|---|
| Accueil | 97 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| Résultats | 90 / 100 / 100 / 100 | 95 / 100 / 100 / 100 |
| Fiche recette | 94 / 100 / 100 / 100 | 96 / 100 / 100 / 100 |

Principales optimisations : code splitting par route (`React.lazy`), images réduites avec dimensions réservées et `loading="lazy"`, `AbortController` pour annuler les requêtes obsolètes, cache mémoire des appels API, `preconnect` vers l'API, `robots.txt` et métadonnées SEO.
Le LCP des pages dépend surtout de l'API et des images distantes (TheMealDB), hors de mon contrôle.

## 🚀 Installation

Prérequis : Node.js 18+.

```bash
git clone https://github.com/flaviemichel-laplateforme/autocompletion.git
cd autocompletion
npm install
npm run dev      # http://localhost:5173
```

Autres commandes : `npm run build`, `npm run preview`, `npm run lint`.

## 🔭 Pistes d'amélioration

- Traduire aussi les ingrédients de la fiche recette.
- Rétablir un filtre par catégorie sur la page de résultats.
- Tests (Vitest + React Testing Library) et déploiement (Vercel / Netlify).

## 🎓 Contexte pédagogique

Projet réalisé en autonomie à La Plateforme_ (titre professionnel DWWM). Compétences mobilisées : développement d'une interface web dynamique, consommation d'une API REST, gestion d'état, routage, intégration responsive, versionnement Git (commits conventionnels).

Un support de cours détaillé, rédigé pendant le projet, est disponible dans [COURS_COMPLET.md](COURS_COMPLET.md).

## 📄 Crédits

Données : [TheMealDB](https://www.themealdb.com/). Projet à but pédagogique.
