import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './RecipeDetail.css';

function RecipeDetail() {
    const { id } = useParams(); // Récupère l'ID depuis l'URL (ex: 52772)
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fonction pour transformer les 20 ingrédients séparés en un beau tableau
    const getIngredients = (meal) => {
        const ingredients = [];
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];

            // On vérifie que l'ingrédient existe et n'est pas vide
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
                setRecipe(data.meals[0]); // L'API renvoie un tableau, on prend le premier élément
            } catch (error) {
                console.error("Erreur:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipeDetail();
    }, [id]);

    if (loading) return <div className="detail-loader">Chargement de la recette...</div>;
    if (!recipe) return <div className="detail-error">Recette introuvable</div>;

    const ingredientsList = getIngredients(recipe);

    return (
        <div className="recipe-detail-container">
            {/* Bouton retour */}
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
                {/* On remplace les sauts de ligne par des paragraphes pour la lisibilité */}
                {recipe.strInstructions.split('\r\n').map((step, index) => (
                    step.trim() && <p key={index}>{step}</p>
                ))}
            </div>
        </div>
    );
}

export default RecipeDetail;