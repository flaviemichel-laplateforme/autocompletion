import { useState, useEffect } from 'react';
import './Home.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import RecipeCard from '../../components/RecipeCard/RecipeCard';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { getCategories, getMealsByCategory } from '../../services/mealApi';
import { translate, categoryTranslations } from '../../utils/translations';

function Home() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [showCategories, setShowCategories] = useState(false);

    useDocumentTitle(null);

    // Récupérer toutes les catégories disponibles
    useEffect(() => {
        const controller = new AbortController();

        getCategories(controller.signal)
            .then(setCategories)
            .catch((err) => {
                if (err.name !== 'AbortError') console.error("Erreur lors du chargement des catégories:", err);
            });

        return () => controller.abort();
    }, []);

    // Récupérer les recettes par catégorie
    useEffect(() => {
        if (!selectedCategory) return;

        const controller = new AbortController();

        getMealsByCategory(selectedCategory, controller.signal)
            .then((meals) => {
                setRecipes(meals);
                setError(false);
                setLoading(false);
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;
                console.error("Erreur lors du chargement des recettes:", err);
                setRecipes([]);
                setError(true);
                setLoading(false);
            });

        return () => controller.abort();
    }, [selectedCategory]);

    const handleSelectCategory = (category) => {
        setLoading(true);
        setError(false);
        setSelectedCategory(category);
        setShowCategories(false);
    };

    const handleReset = () => {
        setSelectedCategory(null);
        setRecipes([]);
        setLoading(false);
        setError(false);
    };

    return (
        <div className="home">
            <div className="hero-section">
                <h1 className="main-title">MiamMiam</h1>
                <p className="subtitle">Trouvez votre prochaine recette parmi des milliers de plats</p>

                {/* Affichage de la barre de recherche */}
                <SearchBar />
            </div>

            {/* Filtres par catégorie */}
            <section className="categories-section" aria-label="Parcourir par catégorie">
                <div className="categories-header">
                    <button
                        type="button"
                        className="toggle-categories-btn"
                        aria-expanded={showCategories}
                        aria-controls="categories-grid"
                        onClick={() => setShowCategories(!showCategories)}
                    >
                        <span><span aria-hidden="true">📁</span> Catégories</span>
                        <span className={`arrow ${showCategories ? 'open' : ''}`} aria-hidden="true">▼</span>
                    </button>

                    {selectedCategory && (
                        <button
                            type="button"
                            className="reset-btn"
                            onClick={handleReset}
                        >
                            <span aria-hidden="true">✕</span> Réinitialiser
                            <span className="sr-only"> le filtre de catégorie</span>
                        </button>
                    )}
                </div>

                {showCategories && (
                    <div className="categories-grid" id="categories-grid">
                        {categories.map(category => (
                            <button
                                type="button"
                                key={category.idCategory}
                                className={`category-btn ${selectedCategory === category.strCategory ? 'active' : ''}`}
                                aria-pressed={selectedCategory === category.strCategory}
                                onClick={() => handleSelectCategory(category.strCategory)}
                            >
                                {translate(category.strCategory, categoryTranslations)}
                            </button>
                        ))}
                    </div>
                )}
            </section>

            {/* Affichage des recettes par catégorie */}
            {selectedCategory && (
                <section className="recipes-section" aria-labelledby="recipes-title">
                    <h2 className="recipes-title" id="recipes-title">
                        Recettes - {translate(selectedCategory, categoryTranslations)}
                    </h2>

                    {loading && <div className="loader" role="status">Chargement des recettes...</div>}
                    {error && <p className="error-message" role="alert">Impossible de charger les recettes. Vérifiez votre connexion et réessayez.</p>}

                    <div className="recipes-grid">
                        {recipes.map((meal, index) => (
                            <RecipeCard meal={meal} key={meal.idMeal} eager={index < 4} priority={index === 0} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

export default Home;
