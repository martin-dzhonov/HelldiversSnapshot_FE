import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import ArmoryPage from "./pages/ArmoryPage";
import SnapshotPage from "./pages/SnapshotPage";
import StratagemPage from "./pages/StratagemPage";
import AboutPage from "./pages/AboutPage";
import WeaponsPage from "./pages/WeaponsPage";

function App() {
    document.title = "Helldive.Live";

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/strategem" />}></Route>

                <Route
                    path="/strategem"
                    element={
                        <Layout>
                            <SnapshotPage />
                        </Layout>
                    }
                />
                <Route
                    path="/weapons"
                    element={
                        <Layout>
                            <WeaponsPage />
                        </Layout>
                    }
                />
                <Route
                    path="armory"
                    element={
                        <Layout>
                            <ArmoryPage />
                        </Layout>
                    }
                ></Route>
                <Route
                    path="/armory/:factionID/:itemID"
                    element={
                        <Layout>
                            <StratagemPage />
                        </Layout>
                    }
                />
                <Route
                    path="/about"
                    element={
                        <Layout>
                            <AboutPage />
                        </Layout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
