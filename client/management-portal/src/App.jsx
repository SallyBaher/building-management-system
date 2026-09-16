import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateBuilding from "./pages/CreateBuilding.jsx";
import BuildingInformation from "./pages/BuildingInformation.jsx";
import Login from "./pages/Login.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateBuilding />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/building-information"
          element={<BuildingInformation />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;