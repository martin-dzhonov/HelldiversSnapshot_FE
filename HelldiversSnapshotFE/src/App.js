import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './layout';
import ArmoryPage from './ArmoryPage';
import FactionPage from './FactionPage';
import StrategemPage from './StrategemPage';
import AboutPage from './AboutPage';


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
