import "./styles/App.css";
import Navigation from "./components/Navigation";

const Layout = ({ children }) => {

    return (
        <div className="app-bg">
            <Navigation />
            {children}
        </div>
    );
};

export default Layout;
