import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './SearchResults.css';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { searchMeals } from '../../services/mealApi';

function SearchResults() {
    // 1. On récupère le paramètre 'q' dans l'URL (Job 02)
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(Boolean(query));
    const [error, setError] = useState(false);

    useDocumentTitle(query ? `Résultats pour « ${query} »` : 'Recherche');

    useEffect(() => {
        if (!query) return;

        const controller = new AbortController();

        searchMeals(query, controller.signal)
            .then((meals) => {
                setRecipes(meals);
                setError(false);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name === 'AbortError') return; // requête remplacée par une plus récente
                console.error("Erreur de chargement:", err);
                setRecipes([]);
                setError(true);
                setLoading(false);
            });

        return () => {
            controller.abort();
            setLoading(true); // on affiche le loader pendant la requête suivante
        };
    }, [query]); // On relance si 'query' change

    return (
        <div className="results-page">
            <h1>Résultats pour "{query}"</h1>

            {/* Affichage du Loader */}
            {loading && <div className="loader" role="status">Chargement des recettes...</div>}

            {error && (
                <p className="error-message" role="alert">
                    Impossible de charger les recettes. Vérifiez votre connexion et réessayez.
                </p>
            )}

            {/* Cas où il n'y a pas de résultats (l'API renvoie null, pas un tableau vide) */}
            {!loading && !error && recipes.length === 0 && (
                <p className="no-results" role="status">
                    {query
                        ? `Aucune recette trouvée pour "${query}". Essayez un autre terme !`
                        : 'Saisissez un terme dans la barre de recherche.'}
                </p>
            )}

            {/* Grille de résultats */}
            <div className="recipes-grid">
                {recipes.map((meal, index) => (
                    // Chaque carte est un lien vers la page détail (Job 02)
                    <RecipeCard meal={meal} key={meal.idMeal} eager={index < 4} priority={index === 0} headingLevel="h2" />
                ))}
            </div>
        </div>
    );
}

export default SearchResults;
