import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import CreateBuilding from "./pages/CreateBuilding/CreateBuilding";
import Login from "./pages/Login/Login";
import BuildingInformation from "./pages/BuildingInformation/BuildingInformation";
import BuildingEdit from "./pages/BuildingEdit/BuildingEdit";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/create-building" element={<CreateBuilding />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/building-information"
          element={<BuildingInformation />}
        />
        <Route path="/building-edit" element={<BuildingEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;