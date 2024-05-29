import FactionPage from './factionPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './layout';
import ArmoryPage from './armoryPage';
import StrategemPage from './strategemPage';


function App() {
  document.title = "Helldivers Meta Snapshot"

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
