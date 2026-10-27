import { Link } from 'react-router-dom';
import './RecipeCard.css';
import { getThumb } from '../../utils/images';
import { translate, categoryTranslations, areaTranslations } from '../../utils/translations';

// `eager` : les premières cartes (au-dessus de la ligne de flottaison) ne sont pas chargées en lazy
// `priority` : la toute première image est probablement le LCP
// `headingLevel` : niveau du titre, pour garder une hiérarchie h1 > h2 > h3 correcte selon la page
function RecipeCard({ meal, eager = false, priority = false, headingLevel = 'h3' }) {
    const Heading = headingLevel;

    return (
        <Link to={`/recipe/${meal.idMeal}`} className="recipe-card">
            <div className="card-image">
                {/* alt vide : le nom du plat est déjà dans le titre du lien */}
                <img
                    src={getThumb(meal.strMealThumb, 'medium')}
                    alt=""
                    width="350"
                    height="200"
                    loading={eager ? 'eager' : 'lazy'}
                    fetchPriority={priority ? 'high' : undefined}
                    decoding="async"
                />
            </div>
            <div className="card-content">
                <Heading>{meal.strMeal}</Heading>
                {meal.strCategory && (
                    <span className="category-tag">{translate(meal.strCategory, categoryTranslations)}</span>
                )}
                {meal.strArea && (
                    <span className="area-tag">{translate(meal.strArea, areaTranslations)}</span>
                )}
            </div>
        </Link>
    );
}

export default RecipeCard;
