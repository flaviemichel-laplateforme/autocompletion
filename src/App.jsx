import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import Header from './components/Header/Header';
import Home from './pages/Home/Home';
import SearchResults from './pages/SearchResults/SearchResults';
import RecipeDetail from './pages/RecipeDetail/RecipeDetail';

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/search' element={<SearchResults />} />
                <Route path='/recipe/:id' element={<RecipeDetail />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
