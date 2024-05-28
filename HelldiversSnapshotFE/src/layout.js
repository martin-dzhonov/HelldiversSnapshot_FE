import { Link } from "react-router-dom";
import './App.css';

const Layout = ({ children }) => {
    return (
        <div className="app-bg">
            <div class="menu">
                <li>
                    <Link to="/">Factions</Link>
                </li>
                <li>
                    <Link to="/armory">Armory</Link>
                </li>
                <li class="slider"></li>
            </div>
            <div>{children}</div>
        </div>
    )
};

export default Layout;