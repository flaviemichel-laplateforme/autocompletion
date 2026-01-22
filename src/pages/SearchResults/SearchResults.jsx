import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './SearchResults.css';
import { translate, categoryTranslations, areaTranslations } from '../../utils/translations';

function SearchResults() {
    // 1. On récupère le paramètre 'q' dans l'URL (Job 02)
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        const fetchRecipes = async () => {
            setLoading(true); // On affiche le loader
            try {
                // Appel API standard pour la recherche
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
                const data = await response.json();

                // Attention : Si l'API ne trouve rien, data.meals vaut null (pas un tableau vide)
                setRecipes(data.meals || []);
            } catch (error) {
                console.error("Erreur de chargement:", error);
            } finally {
                setLoading(false); // On cache le loader, succès ou échec
            }
        };

        if (query) {
            fetchRecipes();
        }
    }, [query]); // On relance si 'query' change

    // Filtrer les recettes par catégorie
    const filteredRecipes = selectedCategory === 'all'
        ? recipes
        : recipes.filter(recipe => recipe.strCategory === selectedCategory);

    // Obtenir toutes les catégories uniques des résultats
    const categories = ['all', ...new Set(recipes.map(recipe => recipe.strCategory))];

    return (
        <div className="results-page">
            <h2>Résultats pour "{query}"</h2>

            {/* Affichage du Loader */}
            {loading && <div className="loader">Chargement des recettes...</div>}

            {/* Cas où il n'y a pas de résultats */}
            {!loading && recipes.length === 0 && (
                <p className="no-results">Aucune recette trouvée pour "{query}". Essayez un autre terme !</p>
            )}



            {/* Message si aucun résultat après filtrage */}
            {!loading && recipes.length > 0 && filteredRecipes.length === 0 && (
                <p className="no-results">Aucune recette {selectedCategory !== 'all' && `de la catégorie "${translate(selectedCategory, categoryTranslations)}"`} trouvée.</p>
            )}

            {/* Grille de résultats */}
            <div className="recipes-grid">
                {filteredRecipes.map(meal => (
                    // Chaque carte est un lien vers la page détail (Job 02)
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