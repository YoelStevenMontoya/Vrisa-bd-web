import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const isAuthenticated = !!token;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          VRISA
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Inicio
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/panel">
                    Panel
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger ms-2"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Inicia sesión
                  </Link>
                </li>
                <li className="nav-item">
                  {/* ESTE es el botón de registrar usuario */}
                  <Link className="btn btn-primary ms-2" to="/register">
                    Regístrate
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
