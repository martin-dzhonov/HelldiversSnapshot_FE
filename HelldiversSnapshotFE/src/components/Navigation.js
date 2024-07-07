import "../styles/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import hdlogo from "../assets/logos/hdlogo.svg";
import { navRoutes } from "../constants";
import useMobile from "../hooks/useMobile";

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isMobile } = useMobile();

    return (
        <div class="nav-container">
            {isMobile && (
                <DropdownButton
                    className="dropdown-button"
                    title={<FaBars size="1.3em" />}
                >
                    {navRoutes.map((navRoute) => (
                        <Dropdown.Item
                            as="button"
                            onClick={() => navigate(`/${navRoute.route}`)}
                        >
                            {navRoute.name}
                        </Dropdown.Item>
                    ))}
                </DropdownButton>
            )}

            <div className="logos-wrapper">
                <div className="app-logo" onClick={() => navigate("/")}>
                    HELLDIVE.LIVE
                </div>
                <div className="hd-logo" onClick={() => navigate("/")}>
                    <img src={hdlogo} />
                </div>
            </div>

            {!isMobile && (
                <div class="menu">
                    {navRoutes.map((navRoute) => (
                        <Link
                            to={`/${navRoute.route}`}
                            className={`${
                                location.pathname.includes(navRoute.route)
                                    ? "menu-active"
                                    : ""
                            }`}
                        >
                            <span className={`custom-font`}>
                                {navRoute.name}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Navigation;
