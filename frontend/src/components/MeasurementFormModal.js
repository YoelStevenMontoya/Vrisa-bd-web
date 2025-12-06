import React, { useState } from "react";
import api from "../api";

function MeasurementFormModal({ show, onClose, station, date, onCreated }) {
  const [form, setForm] = useState({
    pm25: "",
    pm10: "",
    so2: "",
    no2: "",
    o3: "",
    co: "",
    temperatura: "",
    humedad: "",
    velocidad_viento: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!show || !station || !date) return null;

  const handleChange = (e) => {
    setError("");
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const parseFloatOrNull = (value) => {
    if (value === "" || value === null || value === undefined) return null;
    const n = parseFloat(value);
    return isNaN(n) ? null : n;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.post("mediciones/", {
        estacion: station.id_estacion,
        fecha: date,
        pm25: parseFloatOrNull(form.pm25),
        pm10: parseFloatOrNull(form.pm10),
        so2: parseFloatOrNull(form.so2),
        no2: parseFloatOrNull(form.no2),
        o3: parseFloatOrNull(form.o3),
        co: parseFloatOrNull(form.co),
        temperatura: parseFloatOrNull(form.temperatura),
        humedad: parseFloatOrNull(form.humedad),
        velocidad_viento: parseFloatOrNull(form.velocidad_viento),
      });

      setForm({
        pm25: "",
        pm10: "",
        so2: "",
        no2: "",
        o3: "",
        co: "",
        temperatura: "",
        humedad: "",
        velocidad_viento: "",
      });

      if (onCreated) onCreated();
    } catch (err) {
      console.error("Error creando medición:", err);
      setError("No se pudo guardar la medición. Inténtalo de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                Registrar medición – {station.nombre} ({date})
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">PM2.5 (µg/m³)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="pm25"
                      className="form-control"
                      value={form.pm25}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">PM10 (µg/m³)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="pm10"
                      className="form-control"
                      value={form.pm10}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">SO₂ (ppb)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="so2"
                      className="form-control"
                      value={form.so2}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">NO₂ (ppb)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="no2"
                      className="form-control"
                      value={form.no2}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">O₃ (ppb)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="o3"
                      className="form-control"
                      value={form.o3}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">CO (ppm)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="co"
                      className="form-control"
                      value={form.co}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">
                      Temperatura (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="temperatura"
                      className="form-control"
                      value={form.temperatura}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Humedad (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="humedad"
                      className="form-control"
                      value={form.humedad}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      Velocidad del viento (m/s)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="velocidad_viento"
                      className="form-control"
                      value={form.velocidad_viento}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {error && (
                  <div className="alert alert-danger mt-3">{error}</div>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={saving}
                >
                  {saving ? "Guardando..." : "Guardar medición"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Fondo oscuro del modal */}
      <div className="modal-backdrop fade show"></div>
    </>
  );
}

export default MeasurementFormModal;
