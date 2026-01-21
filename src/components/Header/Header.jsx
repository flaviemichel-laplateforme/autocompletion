import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar'; // On importe la barre
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-content">
                {/* Le Logo redirige vers l'accueil (Job 07) */}
                <Link to="/" className="logo">
                    Miam<span className="logo-highlight">Miam</span>
                </Link>

                {/* La barre de recherche est maintenant dans le header */}
                <div className="header-search-container">
                    <SearchBar />
                </div>
            </div>
        </header>
    );
}

export default Header;