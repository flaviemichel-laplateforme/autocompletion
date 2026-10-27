import { Link } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle';

function NotFound() {
    useDocumentTitle('Page introuvable');

    return (
        <div className="not-found">
            <h1>Page introuvable</h1>
            <p>La page que vous cherchez n'existe pas ou a été déplacée.</p>
            <Link to="/" className="not-found-link">Retour à l'accueil</Link>
        </div>
    );
}

export default NotFound;
