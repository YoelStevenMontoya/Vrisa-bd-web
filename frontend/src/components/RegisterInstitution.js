import React, { useState } from 'react';
import api from '../api';

function RegisterInstitution() {
  const [form, setForm] = useState({
    nombre: '',
    direccion: '',
    logo: '',
    color: '#6c9a3b',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post('instituciones/', form);
      setSuccess(
        'Institución registrada correctamente. Ahora puede ser validada por un administrador.'
      );
      setForm({
        nombre: '',
        direccion: '',
        logo: '',
        color: '#6c9a3b',
      });
    } catch (err) {
      setError('Error al registrar la institución');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <h2 className="mb-4">Crea una cuenta de institución</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nombre de la institución</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Dirección</label>
            <input
              type="text"
              className="form-control"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Logo (URL)</label>
            <input
              type="text"
              className="form-control"
              name="logo"
              value={form.logo}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label d-block">Color institucional</label>
            <input
              type="color"
              name="color"
              value={form.color}
              onChange={handleChange}
              className="form-control form-control-color"
            />
          </div>

          {success && <div className="alert alert-success">{success}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <button className="btn btn-success" type="submit">
            Registrar institución
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterInstitution;
