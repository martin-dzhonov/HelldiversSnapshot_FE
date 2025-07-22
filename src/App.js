import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./Layout";
import ArmoryPage from "./pages/ArmoryPage";
import StrategemsPage from "./pages/StrategemsPage";
import StratagemPage from "./pages/StratagemPage";
import AboutPage from "./pages/AboutPage";
import WeaponsPage from "./pages/WeaponsPage";
import WeaponPage from "./pages/WeaponPage";
import GamesPage from "./pages/GamesPage";
import ArmorsPage from "./pages/ArmorsPage";

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
                            <StrategemsPage />
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
                    path="/armors"
                    element={
                        <Layout>
                            <ArmorsPage />
                        </Layout>
                    }
                />
                <Route
                    path="gallery"
                    element={
                        <Layout>
                            <ArmoryPage />
                        </Layout>
                    }
                ></Route>
                <Route
                    path="/strategem/:id"
                    element={
                        <Layout>
                            <StratagemPage />
                        </Layout>
                    }
                />
                <Route
                    path="/weapons/:id/:factionID"
                    element={
                        <Layout>
                            <WeaponPage />
                        </Layout>
                    }
                />
                <Route
                    path="/games"
                    element={
                        <Layout>
                            <GamesPage />
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

//fix tooltips
//fix dynamic options passing/max
//fix redirect on companions bar click
//fix big chart labels