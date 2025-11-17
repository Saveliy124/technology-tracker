import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
    const location = useLocation();

    return (
        <nav className="main-navigation">
            <div className="nav-container">
                <div className="nav-brand">
                    <Link to="/">
                        <h2>📚 TechTracker</h2>
                    </Link>
                </div>

                <ul className="nav-menu">
                    <li className="nav-item">
                        <Link
                            to="/"
                            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                        >
                            🏠 Главная
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            to="/technologies"
                            className={`nav-link ${location.pathname === '/technologies' ? 'active' : ''}`}
                        >
                            📋 Все технологии
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            to="/statistics"
                            className={`nav-link ${location.pathname === '/statistics' ? 'active' : ''}`}
                        >
                            📊 Статистика
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            to="/settings"
                            className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
                        >
                            ⚙️ Настройки
                        </Link>
                    </li>

                    <li className="nav-item">
                        <Link
                            to="/add-technology"
                            className={`nav-link ${location.pathname === '/add-technology' ? 'active' : ''}`}
                        >
                            ➕ Добавить
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navigation;
