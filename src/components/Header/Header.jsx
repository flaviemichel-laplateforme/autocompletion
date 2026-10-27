import { Link, useLocation } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar'; // On importe la barre
import './Header.css';

function Header() {
    const { pathname } = useLocation();
    // Sur l'accueil, la barre est déjà dans le hero : on évite deux champs identiques
    const showSearch = pathname !== '/';

    return (
        <header className="header">
            <div className="header-content">
                {/* Le Logo redirige vers l'accueil (Job 07) */}
                <Link to="/" className="logo" aria-label="MiamMiam, retour à l'accueil">
                    Miam<span className="logo-highlight">Miam</span>
                </Link>

                {showSearch && (
                    <div className="header-search-container">
                        <SearchBar />
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
