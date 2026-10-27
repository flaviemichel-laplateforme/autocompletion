import { useState, useEffect, useRef, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';
import { searchMeals } from '../../services/mealApi';
import { getThumb } from '../../utils/images';

const EMPTY = { startsWith: [], contains: [] };

// Algorithme de filtrage (Job 05)
const filterSuggestions = (meals, query) => {
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

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState(EMPTY);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const navigate = useNavigate();
    const containerRef = useRef(null);
    // Évite de relancer une recherche quand on remplit l'input depuis une suggestion
    const skipNextFetch = useRef(false);
    // Permet d'annuler le debounce / la requête en cours (ex. à la soumission)
    const cancelPending = useRef(() => { });

    // useId : plusieurs instances de la barre peuvent coexister sans doublon d'id
    const uid = useId();
    const inputId = `${uid}-input`;
    const listId = `${uid}-list`;
    const optionId = (index) => `${uid}-option-${index}`;

    // Liste à plat, dans l'ordre d'affichage : navigation clavier par index
    const options = [...suggestions.startsWith, ...suggestions.contains];
    const isOpen = showSuggestions && options.length > 0;

    // Gestion de l'API avec Debounce + annulation des requêtes obsolètes (Job 04)
    useEffect(() => {
        if (skipNextFetch.current) {
            skipNextFetch.current = false;
            return;
        }

        const term = searchTerm.trim();
        if (term.length < 2) return;

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try {
                const meals = await searchMeals(term, controller.signal);
                setSuggestions(filterSuggestions(meals, term));
                setActiveIndex(-1);
                setShowSuggestions(true);
            } catch (error) {
                if (error.name !== 'AbortError') console.error("Erreur API:", error);
            }
        }, 300);

        const cancel = () => {
            clearTimeout(timer);
            controller.abort();
        };
        cancelPending.current = cancel;
        return cancel;
    }, [searchTerm]);

    // Fermer la liste au clic en dehors de la barre
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const goToResults = (term) => {
        cancelPending.current();
        setShowSuggestions(false);
        setActiveIndex(-1);
        navigate(`/search?q=${encodeURIComponent(term)}`);
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim().length < 2) {
            setSuggestions(EMPTY);
            setShowSuggestions(false);
            setActiveIndex(-1);
        }
    };

    // Validation du formulaire
    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            goToResults(searchTerm.trim());
        }
    };

    // Choix d'une suggestion (clic ou Entrée)
    const selectSuggestion = (mealName) => {
        skipNextFetch.current = true;
        setSearchTerm(mealName);
        goToResults(mealName);
    };

    // Navigation clavier : ↑ ↓ Entrée Échap
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown' && options.length > 0) {
            e.preventDefault();
            setShowSuggestions(true);
            setActiveIndex(i => (i + 1) % options.length);
        } else if (e.key === 'ArrowUp' && options.length > 0) {
            e.preventDefault();
            setShowSuggestions(true);
            setActiveIndex(i => (i <= 0 ? options.length - 1 : i - 1));
        } else if (e.key === 'Enter' && isOpen && activeIndex >= 0) {
            e.preventDefault();
            selectSuggestion(options[activeIndex].strMeal);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setActiveIndex(-1);
        }
    };

    const renderOption = (meal, index, className) => (
        <div
            key={meal.idMeal}
            id={optionId(index)}
            role="option"
            aria-selected={index === activeIndex}
            className={`suggestion-item ${className}${index === activeIndex ? ' active' : ''}`}
            // mousedown : on garde le focus dans l'input pendant le clic
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => selectSuggestion(meal.strMeal)}
        >
            <img
                src={getThumb(meal.strMealThumb, 'small')}
                alt=""
                width="50"
                height="50"
                loading="lazy"
                decoding="async"
                className="thumb-mini"
            />
            <span>{meal.strMeal}</span>
        </div>
    );

    return (
        <div className="search-container" ref={containerRef}>
            <form onSubmit={handleSubmit} className="search-bar" role="search" aria-label="Rechercher une recette">
                <label htmlFor={inputId} className="sr-only">Rechercher une recette</label>
                <input
                    id={inputId}
                    type="text"
                    role="combobox"
                    autoComplete="off"
                    aria-autocomplete="list"
                    aria-expanded={isOpen}
                    aria-controls={listId}
                    aria-activedescendant={isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
                    placeholder="Rechercher une recette..."
                    value={searchTerm}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => options.length > 0 && setShowSuggestions(true)}
                />
                <button type="submit">Rechercher</button>
            </form>

            {/* Annonce aux lecteurs d'écran du nombre de suggestions */}
            <p className="sr-only" role="status">
                {isOpen ? `${options.length} suggestion${options.length > 1 ? 's' : ''} disponible${options.length > 1 ? 's' : ''}` : ''}
            </p>

            <div
                id={listId}
                role="listbox"
                aria-label="Suggestions de recettes"
                className="suggestions-list"
                hidden={!isOpen}
            >
                {suggestions.startsWith.map((meal, i) => renderOption(meal, i, 'starts-with'))}

                {suggestions.startsWith.length > 0 && suggestions.contains.length > 0 && (
                    <div className="suggestion-separator" role="presentation" aria-hidden="true">
                        CONTIENNENT "{searchTerm.trim().toUpperCase()}"
                    </div>
                )}

                {suggestions.contains.map((meal, i) =>
                    renderOption(meal, suggestions.startsWith.length + i, 'contains')
                )}
            </div>
        </div>
    );
}

export default SearchBar;
