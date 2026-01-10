import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import EditarPerfilModal from "../components/EditarPerfilModal";

const API_URL = import.meta.env.VITE_API_URL.replace(/\/$/, "");

const ClientePage = () => {
  const { usuario, cargando } = useContext(AuthContext);
  const [misCompras, setMisCompras] = useState([]);
  const [datosCliente, setDatosCliente] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (cargando) return;
    if (!usuario || usuario.rol !== "CLIENTE") {
      navigate("/cuenta");
      return;
    }

    const cargarDatosCliente = async () => {
      try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${API_URL}/api/usuarios/me`, {
          headers: {
            "Content-Type": "application/json",
            ...(import.meta.env.MODE !== "production" && token
              ? { "x-token": token }
              : {}),
          },
          credentials: "include",
        });

        const data = await resp.json();
        if (resp.ok && data.usuario) {
          setDatosCliente(data.usuario);
        }
      } catch (error) {
        console.error("Error cargando datos del cliente:", error);
      }
    };

    const cargarCompras = async () => {
      try {
        const token = localStorage.getItem("token");
        const resp = await fetch(`${API_URL}/api/compras/mias`, {
          headers: {
            "Content-Type": "application/json",
            ...(import.meta.env.MODE !== "production" && token
              ? { "x-token": token }
              : {}),
          },
          credentials: "include",
        });

        const data = await resp.json();
        if (resp.ok && data.ok) {
          setMisCompras(data.compras || []);
        } else {
          setMisCompras([]);
        }
      } catch (error) {
        console.error("Error cargando compras:", error);
        setMisCompras([]);
      }
    };

    cargarDatosCliente();
    cargarCompras();
  }, [usuario, cargando, navigate]);

  const iniciarPago = async (compraId) => {
    try {
      const token = localStorage.getItem("token");
      const resp = await fetch(`${API_URL}/api/pagos/crear/${compraId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(import.meta.env.MODE !== "production" && token
            ? { "x-token": token }
            : {}),
        },
        credentials: "include",
      });

      const data = await resp.json();
      if (resp.ok && data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert("No se pudo iniciar el pago");
      }
    } catch (error) {
      console.error("Error iniciando pago:", error);
      alert("Error iniciando pago");
    }
  };

  if (cargando) return <p className="text-center mt-5">Cargando...</p>;

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    const fecha = new Date(dateString);
    return isNaN(fecha.getTime())
      ? "Sin fecha"
      : fecha.toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">👋 Bienvenido, {usuario?.nombre}</h2>

      {/* Datos del cliente */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="card-title">📋 Mis datos</h4>
          <div className="row">
            <div className="col-md-6">
              <p><strong>Nombre:</strong> {datosCliente?.nombre}</p>
              <p><strong>Apellido:</strong> {datosCliente?.apellido}</p>
              <p><strong>DNI:</strong> {datosCliente?.dni}</p>
              <p><strong>Teléfono:</strong> {datosCliente?.telefono}</p>
              <p><strong>Correo:</strong> {datosCliente?.correo}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Dirección:</strong> {datosCliente?.direccion}</p>
              <p><strong>Provincia:</strong> {datosCliente?.provincia}</p>
              <p><strong>Localidad:</strong> {datosCliente?.localidad}</p>
              <p><strong>Código Postal:</strong> {datosCliente?.codigoPostal}</p>
            </div>
          </div>
          <button
            className="btn btn-warning mt-3"
            onClick={() => setShowModal(true)}
          >
            ✏️ Editar Perfil
          </button>
        </div>
      </div>

      {/* Historial de compras */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title">🛒 Historial de compras</h4>
          {misCompras.length === 0 ? (
            <p className="text-muted">No hay compras registradas.</p>
          ) : (
            <div className="row">
              {misCompras.map((compra) => (
                <div className="col-12 col-md-4 mb-2" key={compra._id}>
                  <div className="card border-light shadow-sm h-100" style={{ fontSize: "0.9rem" }}>
                    <div className="card-body p-2">
                      <h6 className="card-title mb-1">
                        Fecha creación: {formatDate(compra.createdAt)}
                      </h6>
                      <p className="mb-1"><strong>Total:</strong> ${compra.totalFinal}</p>
                      <p className="mb-1">
                        <strong>Estado pago:</strong>{" "}
                        <span
                          className={`badge ${
                            compra.estado === "pagada"
                              ? "bg-success"
                              : compra.estado === "cancelada"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {compra.estado}
                        </span>
                      </p>
                      <p className="mb-1">
                        <strong>Estado envío:</strong> {compra.estadoEnvio}
                      </p>
                      <p className="mb-1">
                        <strong>Fecha envío:</strong> {formatDate(compra.fechaEnvio)}
                      </p>
                      <p className="mb-1">
                        <strong>Fecha entrega:</strong> {formatDate(compra.fechaEntrega)}
                      </p>

                      {compra.estado === "pendiente" && (
                        <button
                          className="btn btn-primary btn-sm mb-2"
                          onClick={() => iniciarPago(compra._id)}
                        >
                          💳 Pagar
                        </button>
                      )}

                      <ul className="list-group list-group-flush">
                        {compra.productos.map((item, idx) => (
                          <li key={idx} className="list-group-item py-1 px-2">
                            {item.nombre} — {item.cantidad} x ${item.precio}
                            {item.talle && (
                              <span className="ms-2 text-muted">Talle: {item.talle}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de edición */}
      <EditarPerfilModal
        show={showModal}
        onClose={() => setShowModal(false)}
        datosCliente={datosCliente}
        onPerfilActualizado={(nuevoPerfil) => setDatosCliente(nuevoPerfil)}
      />
    </div>
  );
};

export default ClientePage;
