import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateBuilding from "./pages/CreateBuilding.jsx";

function Login() {
  return <h1>Login</h1>;
}

function VerifyOtp() {
  return <h1>Verify OTP</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CreateBuilding />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
