import React, { useEffect, useState } from 'react';
import api from '../api';

function StationFormModal({ show, onClose, onCreated }) {
  const [form, setForm] = useState({
    nombre: '',
    estado: 'activa',
    longitud: '',
    latitud: '',
    institucion: '',
  });
  const [instituciones, setInstituciones] = useState([]);

  useEffect(() => {
    if (show) {
      api.get('instituciones/').then((res) => setInstituciones(res.data));
    }
  }, [show]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('estaciones/', {
      ...form,
      longitud: parseFloat(form.longitud),
      latitud: parseFloat(form.latitud),
    });
    onCreated();
    setForm({
      nombre: '',
      estado: 'activa',
      longitud: '',
      latitud: '',
      institucion: '',
    });
  };

  if (!show) return null;

  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Crear estación de monitoreo</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      className="form-control"
                      value={form.nombre}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Estado</label>
                    <select
                      name="estado"
                      className="form-select"
                      value={form.estado}
                      onChange={handleChange}
                    >
                      <option value="activa">Activa</option>
                      <option value="mantenimiento">En mantenimiento</option>
                      <option value="inactiva">Inactiva</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Longitud</label>
                    <input
                      type="number"
                      step="0.000001"
                      name="longitud"
                      className="form-control"
                      value={form.longitud}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Latitud</label>
                    <input
                      type="number"
                      step="0.000001"
                      name="latitud"
                      className="form-control"
                      value={form.latitud}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Institución</label>
                    <select
                      name="institucion"
                      className="form-select"
                      value={form.institucion}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Selecciona una institución</option>
                      {instituciones.map((inst) => (
                        <option
                          key={inst.id_institucion}
                          value={inst.id_institucion}
                        >
                          {inst.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn.success">
                  Guardar estación
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default StationFormModal;
