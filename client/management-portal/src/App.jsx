import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import CreateBuilding from "./pages/CreateBuilding/CreateBuilding";
import Login from "./pages/Login/Login";
import BuildingInformation from "./pages/BuildingInformation/BuildingInformation";
import BuildingEdit from "./pages/BuildingEdit/BuildingEdit";
import Residents from "./pages/Residents/Residents";
import AccountDetails from "./pages/AccountDetails/AccountDetails";
import AccountEdit from "./pages/AccountEdit/AccountEdit";
import AccountCreate from "./pages/AccountCreate/AccountCreate";
import Assets from "./pages/Assets/Assets";
import AssetCreate from "./pages/AssetCreate/AssetCreate.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route
          path="/create-building"
          element={<CreateBuilding />}
        />

        <Route path="/login" element={<Login />} />

        <Route
          path="/building-information"
          element={<BuildingInformation />}
        />

        <Route
          path="/building-edit"
          element={<BuildingEdit />}
        />

        <Route
          path="/residents"
          element={<Residents />}
        />

        <Route
  path="/account/:accountId"
  element={<AccountDetails />}
/>

<Route
  path="/account/:accountId/edit"
  element={<AccountEdit />}
/>

<Route
  path="/account/create"
  element={<AccountCreate />}
/>

<Route 
  path="/assets" 
  element={<Assets />} />

<Route 
  path="/asset/create" 
  element={<AssetCreate />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;