import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Registro = () => {
  const navigate = useNavigate();
  const { logIn } = useContext(AuthContext);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
    telefono: "",
    direccion: "",
    provincia: "",
    localidad: "",
    codigoPostal: "",
    dni: ""
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await resp.json();

      if (!resp.ok) {
        return setError(data.msg || "Error en registro");
      }

      const usuario = {
        id: data.usuario._id,
        nombre: data.usuario.nombre,
        apellido: data.usuario.apellido,
        correo: data.usuario.correo,
        rol: (data.usuario.rol || "").toUpperCase(),
        telefono: data.usuario.telefono,
        direccion: data.usuario.direccion,
        provincia: data.usuario.provincia,
        localidad: data.usuario.localidad,
        codigoPostal: data.usuario.codigoPostal,
        dni: data.usuario.dni
      };

      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      logIn(usuario, data.token);

      if (usuario.rol === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/cliente");
      }
    } catch (error) {
      console.error(error);
      setError("Error en el servidor");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h2 className="text-center mb-4">Registro</h2>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input type="text" className="form-control" id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label htmlFor="apellido" className="form-label">Apellido</label>
            <input type="text" className="form-control" id="apellido" name="apellido" value={form.apellido} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label htmlFor="correo" className="form-label">Correo</label>
            <input type="email" className="form-control" id="correo" name="correo" value={form.correo} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input type="password" className="form-control" id="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label htmlFor="telefono" className="form-label">Teléfono</label>
            <input type="text" className="form-control" id="telefono" name="telefono" value={form.telefono} onChange={handleChange} />
          </div>
          <div className="col-md-6">
            <label htmlFor="dni" className="form-label">DNI</label>
            <input type="text" className="form-control" id="dni" name="dni" value={form.dni} onChange={handleChange} />
          </div>
          <div className="col-12">
            <label htmlFor="direccion" className="form-label">Dirección</label>
            <input type="text" className="form-control" id="direccion" name="direccion" value={form.direccion} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label htmlFor="provincia" className="form-label">Provincia</label>
            <input type="text" className="form-control" id="provincia" name="provincia" value={form.provincia} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label htmlFor="localidad" className="form-label">Localidad</label>
            <input type="text" className="form-control" id="localidad" name="localidad" value={form.localidad} onChange={handleChange} />
          </div>
          <div className="col-md-4">
            <label htmlFor="codigoPostal" className="form-label">Código Postal</label>
            <input type="text" className="form-control" id="codigoPostal" name="codigoPostal" value={form.codigoPostal} onChange={handleChange} />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="d-grid mt-3">
            <button type="submit" className="btn btn-primary rounded-pill">Registrarme</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;



