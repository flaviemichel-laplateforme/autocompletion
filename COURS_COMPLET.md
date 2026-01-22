# 📚 Cours Complet - Application de Recettes avec Autocomplétion

## 📋 Table des matières

1. [Vue d'ensemble du projet](#vue-densemble-du-projet)
2. [Architecture et structure](#architecture-et-structure)
3. [Configuration du projet](#configuration-du-projet)
4. [Les concepts React essentiels](#les-concepts-react-essentiels)
5. [Analyse détaillée du code](#analyse-détaillée-du-code)
6. [Fonctionnalités avancées](#fonctionnalités-avancées)
7. [Bonnes pratiques et optimisations](#bonnes-pratiques-et-optimisations)

---

## 🎯 Vue d'ensemble du projet

### Qu'est-ce que cette application ?

Cette application est une **plateforme de recherche de recettes** qui utilise l'API TheMealDB. Elle permet aux utilisateurs de :

- ✅ Rechercher des recettes par nom
- ✅ Obtenir des suggestions en temps réel (autocomplétion)
- ✅ Voir une liste de résultats de recherche
- ✅ Consulter les détails complets d'une recette

### Technologies utilisées

```json
{
  "React": "19.2.0",          // Framework JavaScript pour construire l'interface
  "React Router DOM": "7.12.0", // Gestion de la navigation entre les pages
  "Vite": "7.2.4"             // Outil de build ultra-rapide
}
```

---

## 🏗️ Architecture et structure

### Structure des dossiers

```
src/
├── App.jsx                    # Composant racine avec les routes
├── main.jsx                   # Point d'entrée de l'application
├── components/                # Composants réutilisables
│   ├── Header/               # En-tête de l'application
│   │   ├── Header.jsx
│   │   └── Header.css
│   └── SearchBar/            # Barre de recherche avec autocomplétion
│       ├── SearchBar.jsx
│       └── SearchBar.css
├── pages/                    # Pages de l'application
│   ├── Home/                 # Page d'accueil
│   ├── SearchResults/        # Page des résultats de recherche
│   └── RecipeDetail/         # Page détails d'une recette
└── utils/                    # Utilitaires
    └── translations.js       # Traductions EN → FR
```

---

## ⚙️ Configuration du projet

### 1. `index.html` - Le point de départ HTML

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>autocompletion</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Explication :**
- `<div id="root"></div>` : C'est ici que React va "injecter" toute l'application
- `<script type="module">` : Charge le fichier JavaScript principal en mode ES Module

---

### 2. `main.jsx` - Le bootstrap React

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Explication ligne par ligne :**

1. **`import { StrictMode } from 'react'`**
   - Importe le mode strict de React
   - Active des vérifications supplémentaires en développement
   - Détecte les problèmes potentiels (ex: effets de bord, méthodes dépréciées)

2. **`import { createRoot } from 'react-dom/client'`**
   - Nouvelle API React 18+ pour créer la racine de l'application
   - Plus performant que l'ancienne méthode `ReactDOM.render()`

3. **`createRoot(document.getElementById('root'))`**
   - Sélectionne l'élément HTML avec l'id "root"
   - Crée un point de montage React

4. **`.render(<StrictMode><App /></StrictMode>)`**
   - Affiche le composant `App` à l'intérieur de StrictMode
   - Lance l'application React

---

### 3. `App.jsx` - Le routeur principal

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import SearchResults from './pages/SearchResults/SearchResults';
import RecipeDetail from './pages/RecipeDetail/RecipeDetail';

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/search' element={<SearchResults />} />
                <Route path='/recipe/:id' element={<RecipeDetail />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
```

**Explication détaillée :**

#### `BrowserRouter`
- Composant qui active le système de routing
- Utilise l'API History du navigateur
- Permet de naviguer sans rechargement de page (SPA - Single Page Application)

#### `Header`
- Placé **en dehors** de `<Routes>`
- Sera affiché sur **toutes les pages**
- Contient le logo et la barre de recherche

#### `Routes` et `Route`
```jsx
<Route path='/' element={<Home />} />
```
- **path** : L'URL qui active cette route (ex: `http://localhost:5173/`)
- **element** : Le composant à afficher

```jsx
<Route path='/recipe/:id' element={<RecipeDetail />} />
```
- **`:id`** : Paramètre dynamique
- Exemple : `/recipe/52772` → l'id sera "52772"
- Accessible via le hook `useParams()`

---

## 📚 Les concepts React essentiels

### 1. Les Hooks - Qu'est-ce que c'est ?

Les hooks sont des **fonctions spéciales** qui permettent d'utiliser les fonctionnalités de React dans les composants fonctionnels.

#### `useState` - Gérer l'état local

```jsx
const [searchTerm, setSearchTerm] = useState('');
```

**Syntaxe :**
- `searchTerm` : La variable qui contient la valeur actuelle
- `setSearchTerm` : La fonction pour modifier cette valeur
- `''` : La valeur initiale

**Exemple concret :**
```jsx
const [count, setCount] = useState(0);

// Lire la valeur
console.log(count); // 0

// Modifier la valeur
setCount(5); // count devient 5
setCount(count + 1); // count devient 6
```

**⚠️ IMPORTANT :** Ne JAMAIS modifier directement la variable :
```jsx
// ❌ MAUVAIS
count = count + 1;

// ✅ BON
setCount(count + 1);
```

---

#### `useEffect` - Gérer les effets de bord

```jsx
useEffect(() => {
    // Code à exécuter
}, [dependencies]);
```

**Fonctionnement :**
1. S'exécute **après** le rendu du composant
2. Se re-exécute quand les dépendances changent
3. Utilisé pour : appels API, timers, abonnements...

**Les 3 syntaxes possibles :**

```jsx
// 1. S'exécute à chaque rendu (⚠️ dangereux, éviter)
useEffect(() => {
    console.log("À chaque rendu");
});

// 2. S'exécute UNE SEULE FOIS au montage
useEffect(() => {
    console.log("Seulement au démarrage");
}, []);

// 3. S'exécute quand 'query' change
useEffect(() => {
    console.log("Query a changé:", query);
}, [query]);
```

**Nettoyage (cleanup) :**
```jsx
useEffect(() => {
    const timer = setTimeout(() => {
        console.log("Après 1 seconde");
    }, 1000);

    // Fonction de nettoyage
    return () => clearTimeout(timer);
}, []);
```

---

#### `useParams` - Récupérer les paramètres d'URL

```jsx
import { useParams } from 'react-router-dom';

function RecipeDetail() {
    const { id } = useParams();
    // Si l'URL est /recipe/52772, alors id = "52772"
}
```

---

#### `useNavigate` - Navigation programmatique

```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/'); // Redirige vers la page d'accueil
    };

    const goBack = () => {
        navigate(-1); // Retour à la page précédente
    };

    return <button onClick={goToHome}>Accueil</button>;
}
```

---

#### `useSearchParams` - Gérer les paramètres de recherche

```jsx
import { useSearchParams } from 'react-router-dom';

function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    
    // Si l'URL est /search?q=pasta
    // alors query = "pasta"
}
```

---

## 🔍 Analyse détaillée du code

### 1. `Header.jsx` - L'en-tête

```jsx
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-content">
                <Link to="/" className="logo">
                    Miam<span className="logo-highlight">Miam</span>
                </Link>

                <div className="header-search-container">
                    <SearchBar />
                </div>
            </div>
        </header>
    );
}

export default Header;
```

**Éléments clés :**

#### `Link` vs `<a>`
```jsx
// ❌ Utiliser <a> recharge toute la page
<a href="/">Accueil</a>

// ✅ Link ne recharge pas la page (navigation SPA)
<Link to="/">Accueil</Link>
```

#### Composition de composants
- `Header` **utilise** `SearchBar`
- Permet de réutiliser la barre de recherche ailleurs si nécessaire

---

### 2. `SearchBar.jsx` - La barre de recherche intelligente

C'est le composant **le plus complexe** de l'application. Analysons-le par sections.

#### A. Les états (States)

```jsx
const [searchTerm, setSearchTerm] = useState('');
const [suggestions, setSuggestions] = useState({ startsWith: [], contains: [] });
const [showSuggestions, setShowSuggestions] = useState(false);
```

**État 1 : `searchTerm`**
- Stocke le texte tapé par l'utilisateur
- Mis à jour à chaque frappe de touche

**État 2 : `suggestions`**
- Objet avec deux tableaux :
  - `startsWith` : Recettes qui **commencent par** le terme de recherche
  - `contains` : Recettes qui **contiennent** le terme (mais ne commencent pas par)
- Structure de données :
```js
{
  startsWith: [
    { idMeal: "123", strMeal: "Pasta Carbonara", strMealThumb: "url..." },
    { idMeal: "456", strMeal: "Pasta Bolognese", strMealThumb: "url..." }
  ],
  contains: [
    { idMeal: "789", strMeal: "Chicken Pasta", strMealThumb: "url..." }
  ]
}
```

**État 3 : `showSuggestions`**
- Booléen qui contrôle l'affichage de la liste de suggestions
- `true` = affiché, `false` = caché

---

#### B. L'algorithme de filtrage

```jsx
const filterSuggestions = (meals, query) => {
    if (!meals) return { startsWith: [], contains: [] };

    const lowerQuery = query.toLowerCase();

    // 1. Commence par...
    const startsWith = meals.filter(meal =>
        meal.strMeal.toLowerCase().startsWith(lowerQuery)
    ).slice(0, 5);

    // 2. Contient (mais ne commence pas par)...
    const contains = meals.filter(meal => {
        const name = meal.strMeal.toLowerCase();
        return name.includes(lowerQuery) && !name.startsWith(lowerQuery);
    }).slice(0, 5);

    return { startsWith, contains };
};
```

**Analyse ligne par ligne :**

1. **Vérification de sécurité**
```jsx
if (!meals) return { startsWith: [], contains: [] };
```
- Si l'API ne retourne rien (`null` ou `undefined`), retourne des tableaux vides
- Évite les erreurs `Cannot read property of null`

2. **Normalisation**
```jsx
const lowerQuery = query.toLowerCase();
```
- Convertit la recherche en minuscules
- Permet une recherche insensible à la casse (case-insensitive)
- "Pasta" trouvera "pasta", "PASTA", "PaStA"

3. **Filtrage "Commence par"**
```jsx
const startsWith = meals.filter(meal =>
    meal.strMeal.toLowerCase().startsWith(lowerQuery)
).slice(0, 5);
```

**`.filter()`** : Crée un nouveau tableau avec les éléments qui passent le test
```js
// Exemple
[1, 2, 3, 4, 5].filter(x => x > 2)
// Résultat: [3, 4, 5]
```

**`.startsWith()`** : Vérifie si une chaîne commence par un texte donné
```js
"Pasta Carbonara".startsWith("pasta") // true
"Chicken Pasta".startsWith("pasta")   // false
```

**`.slice(0, 5)`** : Garde seulement les 5 premiers résultats
```js
[1, 2, 3, 4, 5, 6, 7, 8].slice(0, 5)
// Résultat: [1, 2, 3, 4, 5]
```

4. **Filtrage "Contient"**
```jsx
const contains = meals.filter(meal => {
    const name = meal.strMeal.toLowerCase();
    return name.includes(lowerQuery) && !name.startsWith(lowerQuery);
}).slice(0, 5);
```

**`.includes()`** : Vérifie si une chaîne contient un texte
```js
"Chicken Pasta".includes("pasta") // true
```

**Logique combinée** : `includes() && !startsWith()`
- Doit contenir le terme
- Mais ne doit PAS commencer par le terme
- Résultat : évite les doublons entre les deux listes

---

#### C. Le Debounce avec useEffect

```jsx
useEffect(() => {
    if (searchTerm.length < 2) {
        setSuggestions({ startsWith: [], contains: [] });
        setShowSuggestions(false);
        return;
    }

    const timer = setTimeout(async () => {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
            const data = await response.json();

            const filtered = filterSuggestions(data.meals, searchTerm);
            setSuggestions(filtered);
            setShowSuggestions(true);
        } catch (error) {
            console.error("Erreur API:", error);
        }
    }, 300);

    return () => clearTimeout(timer);
}, [searchTerm]);
```

**Qu'est-ce que le Debounce ?**

Imaginez que l'utilisateur tape "Pasta" :
- Sans debounce : 5 appels API (P, Pa, Pas, Past, Pasta)
- Avec debounce : 1 seul appel API (Pasta)

**Comment ça fonctionne ?**

1. **Vérification de la longueur minimale**
```jsx
if (searchTerm.length < 2) {
    setSuggestions({ startsWith: [], contains: [] });
    setShowSuggestions(false);
    return;
}
```
- Si moins de 2 caractères : efface les suggestions et arrête
- Évite les appels API inutiles

2. **Le timer de 300ms**
```jsx
const timer = setTimeout(async () => {
    // Appel API
}, 300);
```
- Attend 300 millisecondes avant d'appeler l'API
- Si l'utilisateur tape à nouveau pendant ces 300ms, le timer est annulé

3. **La fonction de nettoyage**
```jsx
return () => clearTimeout(timer);
```
- S'exécute AVANT le prochain effet
- Annule le timer précédent
- C'est le cœur du debounce

**Chronologie visuelle :**
```
Utilisateur tape: P
  └─ Timer 300ms démarre
  
Utilisateur tape: a (avant 300ms)
  └─ Timer précédent annulé
  └─ Nouveau timer 300ms démarre
  
Utilisateur tape: s (avant 300ms)
  └─ Timer précédent annulé
  └─ Nouveau timer 300ms démarre
  
Utilisateur tape: t (avant 300ms)
  └─ Timer précédent annulé
  └─ Nouveau timer 300ms démarre
  
Utilisateur tape: a (avant 300ms)
  └─ Timer précédent annulé
  └─ Nouveau timer 300ms démarre
  
300ms s'écoulent sans nouvelle frappe
  └─ APPEL API avec "Pasta"
```

4. **L'appel API**
```jsx
const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
const data = await response.json();
```

**`async/await`** : Syntaxe moderne pour les opérations asynchrones

Équivalent avec Promises :
```js
fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

Avec async/await :
```js
try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
} catch (error) {
    console.error(error);
}
```

---

#### D. Gestion du formulaire

```jsx
const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
        setShowSuggestions(false);
        navigate(`/search?q=${searchTerm}`);
    }
};
```

**`e.preventDefault()`** : Empêche le comportement par défaut
- Par défaut, un formulaire recharge la page lors de la soumission
- `preventDefault()` bloque ce comportement

**`searchTerm.trim()`** : Supprime les espaces au début et à la fin
```js
"  pasta  ".trim() // "pasta"
"".trim()          // "" (chaîne vide)
```

**`navigate(\`/search?q=${searchTerm}\`)`** : Navigation programmatique
- Redirige vers `/search?q=pasta`
- Les backticks \`\` permettent l'interpolation : `${variable}`

---

#### E. Gestion des clics sur les suggestions

```jsx
const handleSuggestionClick = (mealName) => {
    setSearchTerm(mealName);
    setShowSuggestions(false);
    navigate(`/search?q=${mealName}`);
};
```

**Workflow :**
1. Remplit la barre de recherche avec le nom de la recette
2. Cache la liste de suggestions
3. Redirige vers la page de résultats

---

#### F. Le JSX de rendu

```jsx
return (
    <div className="search-container">
        <form onSubmit={handleSubmit} className="search-bar">
            <input
                type="text"
                placeholder="Rechercher une recette..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && setShowSuggestions(false)}
                onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
            />
            <button type="submit">Rechercher</button>
        </form>

        {showSuggestions && (suggestions.startsWith.length > 0 || suggestions.contains.length > 0) && (
            <div className="suggestions-list">
                {suggestions.startsWith.map(meal => (
                    <div
                        key={meal.idMeal}
                        className="suggestion-item starts-with"
                        onClick={() => handleSuggestionClick(meal.strMeal)}
                    >
                        <img src={meal.strMealThumb} alt="" className="thumb-mini" />
                        <span>{meal.strMeal}</span>
                    </div>
                ))}

                {suggestions.startsWith.length > 0 && suggestions.contains.length > 0 && (
                    <div className="suggestion-separator">CONTIENNENT "{searchTerm.toUpperCase()}"</div>
                )}

                {suggestions.contains.map(meal => (
                    <div
                        key={meal.idMeal}
                        className="suggestion-item contains"
                        onClick={() => handleSuggestionClick(meal.strMeal)}
                    >
                        <img src={meal.strMealThumb} alt="" className="thumb-mini" />
                        <span>{meal.strMeal}</span>
                    </div>
                ))}
            </div>
        )}
    </div>
);
```

**Événements clés :**

1. **`onChange`**
```jsx
onChange={(e) => setSearchTerm(e.target.value)}
```
- Se déclenche à chaque frappe de touche
- `e.target.value` contient le texte actuel de l'input
- Met à jour le state `searchTerm`

2. **`onKeyDown`**
```jsx
onKeyDown={(e) => e.key === 'Escape' && setShowSuggestions(false)}
```
- Se déclenche quand une touche est pressée
- Si c'est "Escape" : cache les suggestions
- Utilise l'opérateur `&&` comme un `if` concis

3. **`onFocus`**
```jsx
onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
```
- Se déclenche quand l'input est sélectionné (reçoit le focus)
- Ré-affiche les suggestions si déjà du texte présent

**Rendu conditionnel :**
```jsx
{showSuggestions && (suggestions.startsWith.length > 0 || suggestions.contains.length > 0) && (
    <div className="suggestions-list">
```

**Logique booléenne :**
- Affiche les suggestions SI :
  - `showSuggestions` est `true` **ET**
  - Il y a au moins une suggestion dans `startsWith` **OU** `contains`

**`.map()` - Afficher des listes**
```jsx
{suggestions.startsWith.map(meal => (
    <div key={meal.idMeal}>
        {meal.strMeal}
    </div>
))}
```

**`key`** : Attribut obligatoire pour les listes React
- Permet à React d'identifier chaque élément de manière unique
- Améliore les performances lors des mises à jour
- Doit être unique et stable (ne pas utiliser l'index du tableau)

---

### 3. `SearchResults.jsx` - Page de résultats

```jsx
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './SearchResults.css';
import { translate, categoryTranslations, areaTranslations } from '../../utils/translations';

function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
                const data = await response.json();

                setRecipes(data.meals || []);
            } catch (error) {
                console.error("Erreur de chargement:", error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchRecipes();
        }
    }, [query]);

    return (
        <div className="results-page">
            <h2>Résultats pour "{query}"</h2>

            {loading && <div className="loader">Chargement des recettes...</div>}

            {!loading && recipes.length === 0 && (
                <p className="no-results">Aucune recette trouvée pour "{query}".</p>
            )}

            <div className="recipes-grid">
                {recipes.map(meal => (
                    <Link to={`/recipe/${meal.idMeal}`} key={meal.idMeal} className="recipe-card">
                        <div className="card-image">
                            <img src={meal.strMealThumb} alt={meal.strMeal} />
                        </div>
                        <div className="card-content">
                            <h3>{meal.strMeal}</h3>
                            <span className="category-tag">{translate(meal.strCategory, categoryTranslations)}</span>
                            <span className="area-tag">{translate(meal.strArea, areaTranslations)}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default SearchResults;
```

**Points clés :**

#### A. Récupération des paramètres d'URL
```jsx
const [searchParams] = useSearchParams();
const query = searchParams.get('q');
```
- URL : `/search?q=pasta`
- `query` sera : `"pasta"`

#### B. Gestion du state de chargement
```jsx
const [loading, setLoading] = useState(true);
```

**Workflow :**
1. Au montage : `loading = true`
2. Pendant l'appel API : `loading = true`
3. Après réception des données : `loading = false`

**Bloc `finally`** :
```jsx
try {
    // Appel API
} catch (error) {
    // Gestion d'erreur
} finally {
    setLoading(false); // S'exécute TOUJOURS (succès ou erreur)
}
```

#### C. Gestion des cas vides
```jsx
setRecipes(data.meals || []);
```

**Opérateur `||` (OR logique)** :
- Si `data.meals` existe : utilise `data.meals`
- Si `data.meals` est `null` ou `undefined` : utilise `[]` (tableau vide)

Pourquoi ? L'API retourne `null` quand il n'y a pas de résultats, pas un tableau vide.

#### D. Rendu conditionnel
```jsx
{loading && <div className="loader">Chargement...</div>}
```
- Affiche le loader SI `loading` est `true`

```jsx
{!loading && recipes.length === 0 && (
    <p>Aucune recette trouvée</p>
)}
```
- Affiche le message SI :
  - `loading` est `false` (chargement terminé) **ET**
  - Le tableau `recipes` est vide

#### E. Fonction de traduction
```jsx
<span>{translate(meal.strCategory, categoryTranslations)}</span>
```

Voir le fichier `translations.js` pour le détail de cette fonction.

---

### 4. `RecipeDetail.jsx` - Page de détail

```jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RecipeDetail.css';

function RecipeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    const getIngredients = (meal) => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

            if (ingredient && ingredient.trim()) {
                ingredients.push({
                    name: ingredient,
                    measure: measure
                });
            }
        }
        return ingredients;
    };

    useEffect(() => {
        const fetchRecipeDetail = async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
                const data = await response.json();
                setRecipe(data.meals[0]);
            } catch (error) {
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipeDetail();
    }, [id]);

    if (loading) return <div className="detail-loader">Chargement...</div>;
    if (!recipe) return <div className="detail-error">Recette introuvable</div>;

    const ingredientsList = getIngredients(recipe);

    return (
        <div className="recipe-detail-container">
            <button onClick={() => navigate(-1)} className="back-btn">
                ← Retour
            </button>

            <div className="recipe-header">
                <h1>{recipe.strMeal}</h1>
                <div className="tags">
                    <span className="tag category">{recipe.strCategory}</span>
                    <span className="tag area">{recipe.strArea}</span>
                </div>
            </div>

            <div className="recipe-content">
                <div className="image-section">
                    <img src={recipe.strMealThumb} alt={recipe.strMeal} />
                </div>

                <div className="info-section">
                    <h2>Ingrédients</h2>
                    <ul className="ingredients-grid">
                        {ingredientsList.map((item, index) => (
                            <li key={index}>
                                <span className="measure">{item.measure}</span>
                                <span className="name">{item.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="instructions-section">
                <h2>Instructions</h2>
                {recipe.strInstructions.split('\r\n').map((step, index) => (
                    step.trim() && <p key={index}>{step}</p>
                ))}
            </div>
        </div>
    );
}

export default RecipeDetail;
```

**Points techniques avancés :**

#### A. Récupération du paramètre dynamique
```jsx
const { id } = useParams();
```
- URL : `/recipe/52772`
- `id` sera : `"52772"`

#### B. Transformation des ingrédients

**Problème :** L'API retourne les ingrédients de manière plate :
```js
{
  strIngredient1: "Chicken",
  strMeasure1: "500g",
  strIngredient2: "Salt",
  strMeasure2: "1 tsp",
  // ... jusqu'à 20
  strIngredient20: "",
  strMeasure20: ""
}
```

**Solution :** Fonction `getIngredients()`

```jsx
const getIngredients = (meal) => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim()) {
            ingredients.push({
                name: ingredient,
                measure: measure
            });
        }
    }
    return ingredients;
};
```

**Analyse :**

1. **Template literals dans les clés d'objet**
```js
meal[`strIngredient${i}`]
// i = 1 → meal["strIngredient1"]
// i = 2 → meal["strIngredient2"]
```

2. **Vérification `ingredient && ingredient.trim()`**
- `ingredient` existe (pas `null` ou `undefined`)
- `ingredient.trim()` n'est pas une chaîne vide

3. **Construction d'un nouveau tableau**
```js
ingredients.push({
    name: "Chicken",
    measure: "500g"
});
```

**Résultat final :**
```js
[
  { name: "Chicken", measure: "500g" },
  { name: "Salt", measure: "1 tsp" },
  { name: "Pepper", measure: "1/2 tsp" }
]
```

#### C. Retour rapide (Early Return)
```jsx
if (loading) return <div>Chargement...</div>;
if (!recipe) return <div>Recette introuvable</div>;
```

**Avantages :**
- Évite l'imbrication excessive de conditions
- Code plus lisible
- Évite les erreurs d'accès à `recipe.strMeal` quand `recipe` est `null`

#### D. Découpage des instructions
```jsx
{recipe.strInstructions.split('\r\n').map((step, index) => (
    step.trim() && <p key={index}>{step}</p>
))}
```

**`.split('\r\n')`** : Découpe le texte aux sauts de ligne
```js
"Étape 1\r\nÉtape 2\r\nÉtape 3".split('\r\n')
// Résultat: ["Étape 1", "Étape 2", "Étape 3"]
```

**`step.trim() && <p>{step}</p>`** :
- Affiche le paragraphe seulement si `step` n'est pas vide

---

### 5. `translations.js` - Système de traduction

```js
export const categoryTranslations = {
    'Beef': 'Bœuf',
    'Chicken': 'Poulet',
    'Dessert': 'Dessert',
    // ...
};

export const areaTranslations = {
    'American': 'Américain',
    'British': 'Britannique',
    // ...
};

// Fonction de traduction générique
export function translate(value, dictionary) {
    return dictionary[value] || value;
}
```

**Utilisation :**
```jsx
import { translate, categoryTranslations } from '../../utils/translations';

// Dans le composant
<span>{translate(meal.strCategory, categoryTranslations)}</span>
```

**Logique :**
```js
dictionary[value] || value
```
- Si la traduction existe : retourne la traduction
- Sinon : retourne la valeur originale

**Exemple :**
```js
translate("Chicken", categoryTranslations) // "Poulet"
translate("Unknown", categoryTranslations)  // "Unknown" (pas dans le dictionnaire)
```

---

## 🚀 Fonctionnalités avancées

### 1. Le Debounce - Optimisation réseau

**Problème sans debounce :**
```
Utilisateur tape "Pasta" en 0.5 seconde
↓
5 appels API : P, Pa, Pas, Past, Pasta
↓
Gaspillage de bande passante et de ressources serveur
```

**Solution avec debounce (300ms) :**
```
Utilisateur tape "Pasta" en 0.5 seconde
↓
1 seul appel API : Pasta (après 300ms de silence)
↓
Optimisé !
```

**Implémentation :**
```jsx
useEffect(() => {
    const timer = setTimeout(async () => {
        // Appel API
    }, 300);

    return () => clearTimeout(timer);
}, [searchTerm]);
```

---

### 2. Filtrage intelligent (startsWith vs contains)

**Objectif :** Améliorer la pertinence des suggestions

**Exemple avec la recherche "pas" :**

```
COMMENCENT PAR "pas":
- Pasta Carbonara
- Pasta Bolognese
- Pastitsada

CONTIENNENT "pas":
- Chicken Pasta Bake
- Mediterranean Pasta Salad
```

**Avantages :**
- Les résultats les plus pertinents apparaissent en premier
- Séparation visuelle claire
- Maximum 10 résultats affichés (5 + 5)

---

### 3. Gestion des événements clavier

```jsx
onKeyDown={(e) => e.key === 'Escape' && setShowSuggestions(false)}
```

**Touches utiles :**
- `Escape` : Ferme les suggestions
- Potentiellement : `ArrowDown` / `ArrowUp` pour naviguer dans les suggestions
- `Enter` : Soumet le formulaire

**Extension possible :**
```jsx
const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
        setShowSuggestions(false);
    } else if (e.key === 'ArrowDown') {
        // Sélectionner la suggestion suivante
    } else if (e.key === 'ArrowUp') {
        // Sélectionner la suggestion précédente
    }
};
```

---

## 🎓 Bonnes pratiques et optimisations

### 1. Nommage des variables

```jsx
// ✅ BON - Noms descriptifs
const [searchTerm, setSearchTerm] = useState('');
const [isLoading, setIsLoading] = useState(false);

// ❌ MAUVAIS - Noms cryptiques
const [st, setSt] = useState('');
const [l, setL] = useState(false);
```

---

### 2. Déstructuration

```jsx
// ✅ BON - Déstructuration
const { id } = useParams();
const { strMeal, strCategory } = recipe;

// ❌ Moins lisible
const id = useParams().id;
const name = recipe.strMeal;
```

---

### 3. Opérateur de coalescence nulle (`||`)

```jsx
setRecipes(data.meals || []);

// Équivalent à :
if (data.meals) {
    setRecipes(data.meals);
} else {
    setRecipes([]);
}
```

---

### 4. Template literals

```jsx
// ✅ BON - Template literals
navigate(`/search?q=${searchTerm}`);
const url = `https://api.com/${id}`;

// ❌ Concaténation classique (moins lisible)
navigate("/search?q=" + searchTerm);
const url = "https://api.com/" + id;
```

---

### 5. Séparation des responsabilités

**Principe :** Un composant = Une responsabilité

```
Header : Afficher l'en-tête
SearchBar : Gérer la recherche et l'autocomplétion
Home : Afficher la page d'accueil
SearchResults : Afficher les résultats
RecipeDetail : Afficher les détails d'une recette
```

**Avantages :**
- Code plus facile à maintenir
- Réutilisabilité
- Tests plus simples
- Debugging facilité

---

### 6. Gestion d'erreurs

```jsx
try {
    const response = await fetch(url);
    const data = await response.json();
    setRecipes(data.meals || []);
} catch (error) {
    console.error("Erreur:", error);
    // Potentiellement : afficher un message à l'utilisateur
    // setError("Impossible de charger les recettes");
}
```

---

### 7. Optimisation des dépendances useEffect

```jsx
// ✅ BON - Dépendances spécifiées
useEffect(() => {
    fetchData();
}, [query]);

// ❌ DANGEREUX - Pas de dépendances (boucle infinie potentielle)
useEffect(() => {
    setCount(count + 1);
});
```

---

### 8. Clés uniques pour les listes

```jsx
// ✅ BON - Utiliser un ID unique
{recipes.map(meal => (
    <div key={meal.idMeal}>...</div>
))}

// ❌ À ÉVITER - Utiliser l'index
{recipes.map((meal, index) => (
    <div key={index}>...</div>
))}
```

**Pourquoi ?** Si la liste change d'ordre, React peut se tromper et ne pas mettre à jour correctement.

---

## 📊 Flux de données complet

### Scénario : Recherche de "Pasta"

```
1. Utilisateur tape "P" dans SearchBar
   ↓
2. onChange déclenché → setSearchTerm("P")
   ↓
3. useEffect déclenché car searchTerm a changé
   ↓
4. Timer de 300ms démarre
   ↓
5. Utilisateur tape "a" (< 300ms)
   ↓
6. Timer précédent annulé, nouveau timer démarre
   ↓
7. Utilisateur tape "s", "t", "a" (< 300ms à chaque fois)
   ↓
8. 300ms s'écoulent sans nouvelle frappe
   ↓
9. Appel API : fetch("...search.php?s=Pasta")
   ↓
10. Réponse de l'API : { meals: [...] }
    ↓
11. filterSuggestions() traite les résultats
    ↓
12. setSuggestions({ startsWith: [...], contains: [...] })
    ↓
13. setShowSuggestions(true)
    ↓
14. React re-rend → Suggestions affichées
    ↓
15. Utilisateur clique sur "Pasta Carbonara"
    ↓
16. handleSuggestionClick() appelé
    ↓
17. navigate("/search?q=Pasta Carbonara")
    ↓
18. SearchResults s'affiche
    ↓
19. useEffect de SearchResults déclenché
    ↓
20. Appel API pour les résultats complets
    ↓
21. Affichage de la grille de recettes
    ↓
22. Utilisateur clique sur une recette
    ↓
23. Navigation vers /recipe/52772
    ↓
24. RecipeDetail s'affiche
    ↓
25. Appel API pour les détails
    ↓
26. Affichage complet de la recette
```

---

## 🔧 Améliorations possibles

### 1. Gestion d'état global (Context API ou Redux)
```jsx
// Partager l'état entre plusieurs composants sans prop drilling
const RecipeContext = createContext();
```

### 2. Cache des résultats API
```jsx
// Éviter de rappeler l'API pour les mêmes données
const cache = {};
if (cache[query]) {
    setRecipes(cache[query]);
} else {
    // Appel API
    cache[query] = data.meals;
}
```

### 3. Pagination
```jsx
// Afficher 20 résultats par page
const [page, setPage] = useState(1);
const recipesPerPage = 20;
```

### 4. Favoris
```jsx
// Sauvegarder les recettes favorites dans localStorage
const [favorites, setFavorites] = useState([]);
localStorage.setItem('favorites', JSON.stringify(favorites));
```

### 5. Mode sombre
```jsx
const [darkMode, setDarkMode] = useState(false);
```

---

## 📝 Résumé des concepts clés

| Concept | Utilité | Exemple |
|---------|---------|---------|
| `useState` | Gérer l'état local | `const [count, setCount] = useState(0)` |
| `useEffect` | Effets de bord (API, timers) | `useEffect(() => {}, [deps])` |
| `useParams` | Récupérer paramètres d'URL | `const { id } = useParams()` |
| `useNavigate` | Navigation programmatique | `navigate('/home')` |
| `useSearchParams` | Récupérer query strings | `searchParams.get('q')` |
| Debounce | Optimiser appels API | `setTimeout` + cleanup |
| `.map()` | Afficher des listes | `items.map(item => <div>{item}</div>)` |
| `.filter()` | Filtrer un tableau | `items.filter(item => item.active)` |
| Conditional Rendering | Affichage conditionnel | `{isLoading && <Loader />}` |
| Props | Passer des données | `<Child name="John" />` |
| Destructuring | Extraire des valeurs | `const { name, age } = user` |
| Template Literals | Chaînes dynamiques | \`Hello ${name}\` |
| Async/Await | Code asynchrone | `await fetch(url)` |

---

## 🎯 Conclusion

Cette application illustre les concepts fondamentaux de React :

1. **Composants** : Structure modulaire et réutilisable
2. **Hooks** : Gestion d'état et effets de bord
3. **Routing** : Navigation multi-pages
4. **API** : Communication avec un serveur externe
5. **Optimisations** : Debounce, filtrage intelligent

**Prochaines étapes pour approfondir :**
- Apprendre TypeScript pour un code plus sûr
- Découvrir les tests unitaires (Jest, React Testing Library)
- Explorer la gestion d'état avancée (Redux, Zustand)
- Maîtriser les performances (React.memo, useMemo, useCallback)

---

🎓 **Bon apprentissage !**
