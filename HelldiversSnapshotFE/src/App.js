import FactionPage from './factionPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './layout';
import ArmoryPage from './armoryPage';
import StrategemPage from './strategemPage';
import AboutPage from './aboutPage';


function App() {
  document.title = "Helldive.Live"

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Layout>
            <FactionPage />
          </Layout>
        } />
        <Route path="armory" element={
          <Layout>
            <ArmoryPage />
          </Layout>
        }>
        </Route>
        <Route path="/armory/:itemId" element={
          <Layout>
            <StrategemPage />
          </Layout>
        }/>
        <Route path="/about" element={
          <Layout>
            <AboutPage />
          </Layout>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
