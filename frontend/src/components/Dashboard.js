import React, { useCallback, useEffect, useState } from "react";
import api from "../api";
import StationFormModal from "./StationFormModal";
import MeasurementFormModal from "./MeasurementFormModal";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [loadingStations, setLoadingStations] = useState(false);
  const [loadingMeasurements, setLoadingMeasurements] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [institucionFilter, setInstitucionFilter] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStation, setSelectedStation] = useState(null);
  const [measurements, setMeasurements] = useState([]);

  const [showStationModal, setShowStationModal] = useState(false);
  const [showMeasurementModal, setShowMeasurementModal] = useState(false);

  // Mensaje de ayuda para el botón de medición
  const [measurementHint, setMeasurementHint] = useState("");

  // Cargar instituciones una sola vez
  useEffect(() => {
    api
      .get("instituciones/")
      .then((res) => setInstituciones(res.data))
      .catch((err) => console.error("Error cargando instituciones:", err));
  }, []);

  // Cargar estaciones, con filtros
  const loadStations = useCallback(async () => {
    setLoadingStations(true);
    try {
      const params = {};
      if (searchName) params.nombre = searchName;
      if (stateFilter) params.estado = stateFilter;
      if (institucionFilter) params.institucion = institucionFilter;

      const res = await api.get("estaciones/", { params });
      setStations(res.data);
    } catch (err) {
      console.error("Error cargando estaciones:", err);
    } finally {
      setLoadingStations(false);
    }
  }, [searchName, stateFilter, institucionFilter]);

  // Carga inicial de estaciones
  useEffect(() => {
    loadStations();
  }, [loadStations]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadStations();
  };

  // Cargar mediciones para estación y fecha
  const fetchMeasurements = async (stationId, date) => {
    if (!date) return;
    setLoadingMeasurements(true);
    try {
      const res = await api.get("mediciones/", {
        params: { estacion: stationId, fecha: date },
      });
      setMeasurements(res.data);
    } catch (err) {
      console.error("Error cargando mediciones:", err);
    } finally {
      setLoadingMeasurements(false);
    }
  };

  // Cuando seleccionas una estación
  const handleSelectStation = async (station) => {
    setSelectedStation(station);
    setMeasurementHint(""); // limpiar mensajes de ayuda
    setMeasurements([]);
    if (selectedDate) {
      await fetchMeasurements(station.id_estacion, selectedDate);
    }
  };

  // Cuando cambias la fecha
  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setMeasurementHint(""); // limpiar mensajes de ayuda
    setMeasurements([]);
    if (selectedStation) {
      await fetchMeasurements(selectedStation.id_estacion, date);
    }
  };

  const handleCreatedStation = () => {
    setShowStationModal(false);
    loadStations();
  };

  const handleMeasurementCreated = async () => {
    setShowMeasurementModal(false);
    if (selectedStation && selectedDate) {
      await fetchMeasurements(selectedStation.id_estacion, selectedDate);
    }
  };

  // Lógica del botón "Añadir medición"
  const handleOpenMeasurementModal = () => {
    if (!selectedStation && !selectedDate) {
      setMeasurementHint(
        "Primero selecciona una estación de la lista y un día en el filtro de fecha."
      );
      setShowMeasurementModal(false);
      return;
    }
    if (!selectedStation) {
      setMeasurementHint(
        "Primero selecciona una estación de la lista de la izquierda."
      );
      setShowMeasurementModal(false);
      return;
    }
    if (!selectedDate) {
      setMeasurementHint(
        "Selecciona un día en el filtro de fecha antes de registrar una medición."
      );
      setShowMeasurementModal(false);
      return;
    }

    // Todo OK
    setMeasurementHint("");
    setShowMeasurementModal(true);
  };

  const stationsCount = stations.length;

  return (
    <div className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold">Panel de institución</h1>
          <p className="text-muted mb-1">
            Gestiona tus estaciones, visualiza datos ambientales y genera
            reportes diarios.
          </p>
          <small className="text-muted">
            Estaciones registradas: <strong>{stationsCount}</strong>
          </small>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => navigate("/register-institution")}
          >
            Registrar institución
          </button>

          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={handleOpenMeasurementModal}
            title="Registrar una medición para la estación y el día seleccionados."
          >
            + Añadir medición
          </button>

          <button
            className="btn btn-success"
            type="button"
            onClick={() => setShowStationModal(true)}
          >
            + Nueva estación
          </button>
        </div>
      </div>

      {/* Mensaje de ayuda para mediciones */}
      {measurementHint && (
        <div className="alert alert-info py-2">
          {measurementHint}
        </div>
      )}

      {/* Filtros */}
      <form className="row g-3 mb-4" onSubmit={handleSearch}>
        <div className="col-md-4">
          <label className="form-label">Buscar por nombre</label>
          <input
            type="text"
            className="form-control"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Ej: Estación San Fernando"
          />
        </div>

        <div className="col-md-3">
          <label className="form-label">Estado</label>
          <select
            className="form-select"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="activa">Activa</option>
            <option value="mantenimiento">En mantenimiento</option>
            <option value="inactiva">Inactiva</option>
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Institución</label>
          <select
            className="form-select"
            value={institucionFilter}
            onChange={(e) => setInstitucionFilter(e.target.value)}
          >
            <option value="">Todas</option>
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

        <div className="col-md-2 d-flex align-items-end">
          <button className="btn btn-outline-secondary w-100" type="submit">
            Buscar / Filtrar
          </button>
        </div>

        <div className="col-md-3">
          <label className="form-label">Selecciona un día</label>
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
      </form>

      {/* Contenido principal */}
      <div className="row">
        {/* Lista de estaciones */}
        <div className="col-lg-6">
          <h5 className="mb-3">Estaciones de monitoreo</h5>
          {loadingStations && <p>Cargando estaciones...</p>}
          {!loadingStations && stations.length === 0 && (
            <p className="text-muted">
              No hay estaciones que coincidan con los filtros seleccionados.
            </p>
          )}
          <div className="list-group">
            {stations.map((station) => {
              let badgeClass = "bg-secondary";
              if (station.estado === "activa") badgeClass = "bg-success";
              if (station.estado === "mantenimiento") badgeClass = "bg-warning";
              if (station.estado === "inactiva") badgeClass = "bg-danger";

              const isActive =
                selectedStation &&
                selectedStation.id_estacion === station.id_estacion;

              return (
                <button
                  key={station.id_estacion}
                  type="button"
                  className={`list-group-item list-group-item-action ${
                    isActive ? "active" : ""
                  }`}
                  onClick={() => handleSelectStation(station)}
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">
                      {station.nombre}
                    </h6>
                    <span
                      className={`badge ${badgeClass} text-capitalize`}
                    >
                      {station.estado}
                    </span>
                  </div>
                  <small>
                    Institución: {station.institucion_nombre} · Lat:{" "}
                    {station.latitud} · Long: {station.longitud}
                  </small>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel de datos y mediciones */}
        <div className="col-lg-6 mt-4 mt-lg-0">
          <h5 className="mb-3">Reportes y datos</h5>

          {!selectedStation && (
            <p className="text-muted">
              Selecciona una estación de la lista para ver sus mediciones
              diarias.
            </p>
          )}

          {selectedStation && (
            <>
              <div className="card mb-3">
                <div className="card-body">
                  <h5 className="card-title">
                    {selectedStation.nombre}{" "}
                    <span className="badge bg-secondary text-capitalize">
                      {selectedStation.estado}
                    </span>
                  </h5>
                  <p className="card-text mb-1">
                    Día seleccionado:{" "}
                    {selectedDate || "Selecciona una fecha en el filtro."}
                  </p>
                  <p className="card-text">
                    Ubicación aproximada: lat{" "}
                    {selectedStation.latitud}, long{" "}
                    {selectedStation.longitud}
                  </p>
                </div>
              </div>

              {selectedDate && (
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">
                      Mediciones del {selectedDate}
                    </h6>

                    {loadingMeasurements && (
                      <p>Cargando mediciones...</p>
                    )}

                    {!loadingMeasurements &&
                      measurements.length === 0 && (
                        <p className="text-muted">
                          No hay mediciones registradas para ese día en
                          esta estación. Puedes registrarlas con el botón{" "}
                          <strong>“Añadir medición”</strong>.
                        </p>
                      )}

                    {measurements.map((m) => (
                      <div key={m.id_medicion} className="mb-3">
                        <div className="row">
                          <div className="col-sm-6">
                            <strong>PM2.5:</strong>{" "}
                            {m.pm25 ?? "—"} µg/m³
                            <br />
                            <strong>PM10:</strong>{" "}
                            {m.pm10 ?? "—"} µg/m³
                            <br />
                            <strong>NO₂:</strong>{" "}
                            {m.no2 ?? "—"} ppb
                            <br />
                            <strong>O₃:</strong>{" "}
                            {m.o3 ?? "—"} ppb
                          </div>
                          <div className="col-sm-6">
                            <strong>Temperatura:</strong>{" "}
                            {m.temperatura ?? "—"} °C
                            <br />
                            <strong>Humedad:</strong>{" "}
                            {m.humedad ?? "—"} %
                            <br />
                            <strong>Velocidad del viento:</strong>{" "}
                            {m.velocidad_viento ?? "—"} m/s
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modales */}
      <StationFormModal
        show={showStationModal}
        onClose={() => setShowStationModal(false)}
        onCreated={handleCreatedStation}
      />

      <MeasurementFormModal
        show={showMeasurementModal}
        onClose={() => setShowMeasurementModal(false)}
        station={selectedStation}
        date={selectedDate}
        onCreated={handleMeasurementCreated}
      />
    </div>
  );
}

export default Dashboard;
