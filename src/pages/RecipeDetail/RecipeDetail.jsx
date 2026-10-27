import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './RecipeDetail.css';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { getMealById } from '../../services/mealApi';
import { translate, translateIngredient, categoryTranslations, areaTranslations } from '../../utils/translations';

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

function RecipeDetail() {
    const { id } = useParams(); // Récupère l'ID depuis l'URL (ex: 52772)
    const navigate = useNavigate();
    const location = useLocation();

    const [recipe, setRecipe] = useState(null);
    // 'loading' | 'ready' | 'notfound' | 'error'
    const [status, setStatus] = useState('loading');

    useDocumentTitle(recipe?.strMeal);

    useEffect(() => {
        const controller = new AbortController();

        getMealById(id, controller.signal)
            .then((meal) => {
                setRecipe(meal);
                setStatus(meal ? 'ready' : 'notfound');
            })
            .catch((err) => {
                if (err.name === 'AbortError') return;
                console.error("Erreur:", err);
                setStatus('error');
            });

        return () => {
            controller.abort();
            setStatus('loading');
        };
    }, [id]);

    // Retour : si on est arrivé directement sur la page (lien partagé), on va à l'accueil
    const handleBack = () => (location.key === 'default' ? navigate('/') : navigate(-1));

    if (status === 'loading') return <div className="detail-loader loader" role="status">Chargement de la recette...</div>;
    if (status === 'error') return <div className="detail-error error-message" role="alert">Impossible de charger la recette. Vérifiez votre connexion et réessayez.</div>;
    if (status === 'notfound') return <div className="detail-error error-message" role="alert">Recette introuvable</div>;

    const ingredientsList = getIngredients(recipe);

    return (
        <div className="recipe-detail-container">
            {/* Bouton retour */}
            <button type="button" onClick={handleBack} className="back-btn">
                <span aria-hidden="true">←</span> Retour
            </button>

            <div className="recipe-header">
                <h1>{recipe.strMeal}</h1>
                <div className="tags">
                    <span className="tag category">{translate(recipe.strCategory, categoryTranslations)}</span>
                    <span className="tag area">{translate(recipe.strArea, areaTranslations)}</span>
                </div>
            </div>

            <div className="recipe-content">
                <div className="image-section">
                    {/* Image principale = LCP : chargée en priorité, dimensions réservées */}
                    <img
                        src={`${recipe.strMealThumb}/large`}
                        alt={recipe.strMeal}
                        width="700"
                        height="700"
                        fetchPriority="high"
                    />
                </div>

                <div className="info-section">
                    <h2>Ingrédients</h2>
                    <ul className="ingredients-grid">
                        {ingredientsList.map((item, index) => (
                            <li key={index}>
                                <span className="measure">{item.measure}</span>
                                <span className="name">{translateIngredient(item.name)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="instructions-section">
                <h2>Instructions</h2>
                {/* On remplace les sauts de ligne par des paragraphes pour la lisibilité */}
                {recipe.strInstructions.split(/\r?\n/).map((step, index) => (
                    step.trim() && <p key={index}>{step}</p>
                ))}
            </div>
        </div>
    );
}

export default RecipeDetail;
