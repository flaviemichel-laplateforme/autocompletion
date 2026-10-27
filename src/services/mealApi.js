// Tous les appels à TheMealDB passent ici : encodage des paramètres,
// gestion des erreurs HTTP, de `meals: null` et cache mémoire.
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const cache = new Map();

async function request(path, signal) {
    if (cache.has(path)) return cache.get(path);

    const response = await fetch(`${BASE_URL}/${path}`, { signal });
    if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    cache.set(path, data);
    return data;
}

// L'API renvoie `meals: null` (et non []) quand rien n'est trouvé
export async function searchMeals(query, signal) {
    const data = await request(`search.php?s=${encodeURIComponent(query)}`, signal);
    return data.meals ?? [];
}

export async function getMealById(id, signal) {
    const data = await request(`lookup.php?i=${encodeURIComponent(id)}`, signal);
    return data.meals?.[0] ?? null;
}

export async function getCategories(signal) {
    const data = await request('categories.php', signal);
    return data.categories ?? [];
}

export async function getMealsByCategory(category, signal) {
    const data = await request(`filter.php?c=${encodeURIComponent(category)}`, signal);
    return data.meals ?? [];
}
