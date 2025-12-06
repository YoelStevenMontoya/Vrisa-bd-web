import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import RegisterUser from "./components/RegisterUser";
import RegisterInstitution from "./components/RegisterInstitution";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Página de inicio */}
        <Route path="/" element={<Home />} />

        {/* Registro de USUARIO */}
        <Route path="/register" element={<RegisterUser />} />

        {/* Login de usuario */}
        <Route path="/login" element={<Login />} />

        {/* Registro de INSTITUCIÓN (se accede desde el panel) */}
        <Route
          path="/register-institution"
          element={<RegisterInstitution />}
        />

        {/* Panel principal (estaciones, mediciones, etc.) */}
        <Route path="/panel" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
