import './Header.css';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className='header'>
            <Link to="/" className='logo'>MiamMiam</Link>
        </header>
    );
}

export default Header;