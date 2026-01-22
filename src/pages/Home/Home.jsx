import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import SearchBar from '../../components/SearchBar/SearchBar';
import { translate, categoryTranslations } from '../../utils/translations';

function Home() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showCategories, setShowCategories] = useState(false);

    // Récupérer toutes les catégories disponibles
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
                const data = await response.json();
                setCategories(data.categories || []);
            } catch (error) {
                console.error("Erreur lors du chargement des catégories:", error);
            }
        };

        fetchCategories();
    }, []);

    // Récupérer les recettes par catégorie
    useEffect(() => {
        if (!selectedCategory) {
            setRecipes([]);
            return;
        }

        const fetchRecipesByCategory = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${selectedCategory}`);
                const data = await response.json();
                setRecipes(data.meals || []);
            } catch (error) {
                console.error("Erreur lors du chargement des recettes:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipesByCategory();
    }, [selectedCategory]);

    return (
        <div className="home">
            <div className="hero-section">
                <h1 className="main-title">MiamMiam</h1>
                <p className="subtitle">Trouvez votre prochaine recette parmi des milliers de plats</p>

                {/* Affichage de la barre de recherche */}
                <SearchBar />
            </div>

            {/* Filtres par catégorie */}
            <div className="categories-section">
                <div className="categories-header">
                    <button
                        className="toggle-categories-btn"
                        onClick={() => setShowCategories(!showCategories)}
                    >
                        <span>📁 Catégories</span>
                        <span className={`arrow ${showCategories ? 'open' : ''}`}>▼</span>
                    </button>

                    {selectedCategory && (
                        <button
                            className="reset-btn"
                            onClick={() => {
                                setSelectedCategory(null);
                                setRecipes([]);
                            }}
                            title="Réinitialiser les filtres"
                        >
                            ✕ Réinitialiser
                        </button>
                    )}
                </div>

                {showCategories && (
                    <div className="categories-grid">
                        {categories.map(category => (
                            <button
                                key={category.idCategory}
                                className={`category-btn ${selectedCategory === category.strCategory ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedCategory(category.strCategory);
                                    setShowCategories(false);
                                }}
                            >
                                {translate(category.strCategory, categoryTranslations)}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Affichage des recettes par catégorie */}
            {selectedCategory && (
                <div className="recipes-section">
                    <h2 className="recipes-title">
                        Recettes - {translate(selectedCategory, categoryTranslations)}
                    </h2>

                    {loading && <div className="loader">Chargement des recettes...</div>}

                    <div className="recipes-grid">
                        {recipes.map(meal => (
                            <Link to={`/recipe/${meal.idMeal}`} key={meal.idMeal} className="recipe-card">
                                <div className="card-image">
                                    <img src={meal.strMealThumb} alt={meal.strMeal} />
                                </div>
                                <div className="card-content">
                                    <h3>{meal.strMeal}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;