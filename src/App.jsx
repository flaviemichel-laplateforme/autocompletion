import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from './components/Header/Header';
import Home from './pages/Home/Home';

// Code splitting : ces pages ne sont téléchargées qu'au moment où on les visite
const SearchResults = lazy(() => import('./pages/SearchResults/SearchResults'));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail/RecipeDetail'));

function App() {
    return (
        <BrowserRouter>
            <a href="#main" className="skip-link">Aller au contenu</a>
            <Header />
            <main id="main" tabIndex={-1}>
                <Suspense fallback={<div className="loader" role="status">Chargement...</div>}>
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/search' element={<SearchResults />} />
                        <Route path='/recipe/:id' element={<RecipeDetail />} />
                    </Routes>
                </Suspense>
            </main>
        </BrowserRouter>
    );
}

export default App;
