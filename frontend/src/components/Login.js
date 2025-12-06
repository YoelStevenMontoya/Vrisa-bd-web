import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });
      localStorage.setItem('accessToken', res.data.access);
      navigate('/panel');
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <h2 className="mb-4">Inicia sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button className="btn btn-success" type="submit">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
