import { useState, useEffect } from "react";

const EditarPerfilModal = ({ show, onClose, datosCliente, onPerfilActualizado }) => {
  const [formData, setFormData] = useState({
    correo: "",
    telefono: "",
    direccion: "",
    provincia: "",
    localidad: "",
    codigoPostal: "",
  });

  // 🔄 Cada vez que se abre el modal, inicializamos con los datos actuales
  useEffect(() => {
    if (datosCliente && show) {
      setFormData({
        correo: datosCliente.correo || "",
        telefono: datosCliente.telefono || "",
        direccion: datosCliente.direccion || "",
        provincia: datosCliente.provincia || "",
        localidad: datosCliente.localidad || "",
        codigoPostal: datosCliente.codigoPostal || "",
      });
    }
  }, [datosCliente, show]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(import.meta.env.MODE !== "production" && token
            ? { "x-token": token }
            : {}),
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await resp.json();
      if (resp.ok && data.usuario) {
        onPerfilActualizado(data.usuario); // actualiza datos en ClientePage
        onClose(); // cierra modal
      } else {
        alert(data.msg || "Error al actualizar perfil");
      }
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      alert("Error en el servidor");
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Editar Perfil</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="mb-2">
                <label className="form-label">Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Provincia</label>
                <input
                  type="text"
                  name="provincia"
                  value={formData.provincia}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Localidad</label>
                <input
                  type="text"
                  name="localidad"
                  value={formData.localidad}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Código Postal</label>
                <input
                  type="text"
                  name="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Guardar cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditarPerfilModal;
