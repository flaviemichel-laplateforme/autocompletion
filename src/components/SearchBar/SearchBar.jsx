import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState({ startsWith: [], contains: [] });
    const [showSuggestions, setShowSuggestions] = useState(false);

    const navigate = useNavigate();

    // Algorithme de filtrage (Job 05)
    const filterSuggestions = (meals, query) => {
        if (!meals) return { startsWith: [], contains: [] };

        const lowerQuery = query.toLowerCase();

        // 1. Commence par...
        const startsWith = meals.filter(meal =>
            meal.strMeal.toLowerCase().startsWith(lowerQuery)
        ).slice(0, 5);

        // 2. Contient (mais ne commence pas par)...
        const contains = meals.filter(meal => {
            const name = meal.strMeal.toLowerCase();
            return name.includes(lowerQuery) && !name.startsWith(lowerQuery);
        }).slice(0, 5);

        return { startsWith, contains };
    };

    // Gestion de l'API avec Debounce (Job 04)
    useEffect(() => {
        if (searchTerm.length < 2) {
            setSuggestions({ startsWith: [], contains: [] });
            setShowSuggestions(false);
            return;
        }

        const timer = setTimeout(async () => {
            try {
                const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`);
                const data = await response.json();

                const filtered = filterSuggestions(data.meals, searchTerm);
                setSuggestions(filtered);
                setShowSuggestions(true);
            } catch (error) {
                console.error("Erreur API:", error);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Validation du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            setShowSuggestions(false);
            navigate(`/search?q=${searchTerm}`);
        }
    };

    // Clic sur une suggestion
    const handleSuggestionClick = (mealName) => {
        setSearchTerm(mealName);
        setShowSuggestions(false);
        navigate(`/search?q=${mealName}`);
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} className="search-bar">
                <input
                    type="text"
                    placeholder="Rechercher une recette..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Escape' && setShowSuggestions(false)}
                    onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                />
                <button type="submit">Rechercher</button>
            </form>

            {showSuggestions && (suggestions.startsWith.length > 0 || suggestions.contains.length > 0) && (
                <div className="suggestions-list">

                    {suggestions.startsWith.map(meal => (
                        <div
                            key={meal.idMeal}
                            className="suggestion-item starts-with"
                            onClick={() => handleSuggestionClick(meal.strMeal)}
                        >
                            <img src={meal.strMealThumb} alt="" className="thumb-mini" />
                            <span>{meal.strMeal}</span>
                        </div>
                    ))}

                    {suggestions.startsWith.length > 0 && suggestions.contains.length > 0 && (
                        <div className="suggestion-separator">CONTIENNENT "{searchTerm.toUpperCase()}"</div>
                    )}

                    {suggestions.contains.map(meal => (
                        <div
                            key={meal.idMeal}
                            className="suggestion-item contains"
                            onClick={() => handleSuggestionClick(meal.strMeal)}
                        >
                            <img src={meal.strMealThumb} alt="" className="thumb-mini" />
                            <span>{meal.strMeal}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchBar;