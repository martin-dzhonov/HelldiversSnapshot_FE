import FactionPage from './factionPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './layout';
import ArmoryPage from './armoryPage';

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
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
