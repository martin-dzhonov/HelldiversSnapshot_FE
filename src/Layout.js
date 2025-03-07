import "./styles/App.css";
import Navigation from "./components/Navigation";
import DonateWidget from "./components/DonateWidget";

const Layout = ({ children }) => {
    return (
        <div className="app-bg">
            <Navigation />
            <DonateWidget />
            {children}
        </div>
    );
};

export default Layout;
