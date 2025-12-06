import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function RegisterUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("El usuario y la contraseña son obligatorios.");
      return;
    }
    if (form.password !== form.password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setSaving(true);
    try {
      await api.post("register/", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      console.error("Error en registro:", err);
      setError("No se pudo registrar el usuario. Intenta con otro nombre.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4 text-center">Crea tu cuenta</h2>
      <form onSubmit={handleSubmit} className="card shadow-sm p-4">
        <div className="mb-3">
          <label className="form-label">Nombre de usuario</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Ej: admin_vrisa"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo (opcional)</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tucorreo@ejemplo.com"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Repetir contraseña</label>
          <input
            type="password"
            className="form-control"
            name="password2"
            value={form.password2}
            onChange={handleChange}
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button type="submit" className="btn btn-primary w-100" disabled={saving}>
          {saving ? "Creando cuenta..." : "Registrarme"}
        </button>
      </form>
    </div>
  );
}

export default RegisterUser;
