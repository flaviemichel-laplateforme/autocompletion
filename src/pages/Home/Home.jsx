import './Home.css';
// Importation du composant SearchBar
import SearchBar from '../../components/SearchBar/SearchBar';

function Home() {
    return (
        <div className="home">
            <div className="hero-section">
                <h1 className="main-title">MiamMiam</h1>
                <p className="subtitle">Trouvez votre prochaine recette parmi des milliers de plats</p>

                {/* Affichage de la barre de recherche */}
                <SearchBar />
            </div>
        </div>
    );
}

export default Home;