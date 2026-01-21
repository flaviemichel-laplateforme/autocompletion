import './RecipeDetail.css';
import { useParams } from 'react-router-dom';

function RecipeDetail() {

    const { id } = useParams();

    return (
        <div className='recipe-detail'>
            <h1>Détails de la recette {id}</h1>
        </div>
    );
}

export default RecipeDetail;
