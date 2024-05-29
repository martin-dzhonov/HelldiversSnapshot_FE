import { Link } from "react-router-dom";
import './App.css';
import { useNavigate } from "react-router-dom";


const Layout = ({ children }) => {
    const navigate = useNavigate();

    return (
        <div className="app-bg">
            <div class="nav-container">
                <div style={{
                    color: 'white',
                    fontSize: "19px",
                    cursor: "pointer",
                    marginLeft: "35px",
                    marginTop: "8px",
                    marginRight: "20px",
                    paddingLeft: "10px",
                    paddingRight: "10px",
                    backgroundColor: "#e74c3c",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "5px",
                    fontWeight: "600"
                }}
                onClick={()=> navigate('/')}>
                    HELLDIVE.LIVE</div>
                <div class="menu">
                    <li>
                        <Link to="/" ><span className="custom-font">Factions</span></Link>
                    </li>
                    <li>
                        <Link to="/armory"><span className="custom-font">armory</span></Link>
                    </li>
                    <li class="slider"></li>
                </div>
            </div>
            {children}
        </div>
    )
};

export default Layout;