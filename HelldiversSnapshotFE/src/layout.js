import { Link } from "react-router-dom";
import './App.css';
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import 'bootstrap/dist/css/bootstrap.min.css';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { FaBars } from "react-icons/fa";
import hdlogo from './assets/logos/hdlogo.svg';

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [width, setWidth] = useState(window.innerWidth);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);
    return (
        <div className="app-bg">
            <div class="nav-container">
                {width < 900 &&
                    <DropdownButton className='dropdown-button' title={<FaBars size="1.3em" />}>
                        <Dropdown.Item as="button" onClick={() => navigate('/')}>
                            Meta Snapshot
                        </Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => navigate('/armory')}>
                            Strategems
                        </Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => navigate('/armory')}>
                            The Project
                        </Dropdown.Item>
                    </DropdownButton>}
                <div className="logos-wrapper">
                    <div className="app-logo"
                        onClick={() => navigate('/')}>HELLDIVE.LIVE</div>
                    <div className="hd-logo"><img height={44} src={hdlogo}></img></div>
                </div>

                {width > 900 &&
                    <div class="menu">
                        <Link to="/" className={`${location.pathname === '/' ? 'menu-active' : ''}`}>
                            <span className={`custom-font`}>Meta Snapshot</span>
                        </Link>
                        <Link to="/armory" className={`${location.pathname.includes('armory') ? 'menu-active' : ''}`}>
                            <span className="custom-font">Strategems</span>
                        </Link>
                        <Link to="/about" className={`${location.pathname.includes('about') ? 'menu-active' : ''}`}>
                            <span className="custom-font">The Project</span>
                        </Link>
                    </div>}
            </div>
            {children}
        </div>
    )
};

export default Layout;