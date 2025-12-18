import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { fetchConToken } from "../helpers/fetchConToken";
import { useNavigate } from "react-router-dom";

const ClientePage = () => {
  const { usuario, cargando } = useContext(AuthContext);
  const [misCompras, setMisCompras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (cargando) return;
    if (!usuario || usuario.rol !== "CLIENTE") {
      navigate("/Cuenta");
      return;
    }

    const cargarCompras = async () => {
      try {
        const resp = await fetchConToken("http://localhost:3000/api/compras/mias");
        if (resp.ok) {
          const data = await resp.json();
          setMisCompras(data);
        } else {
          setMisCompras([]);
        }
      } catch {
        setMisCompras([]);
      }
    };

    cargarCompras();
  }, [usuario, cargando, navigate]);

  const iniciarPago = async (compraId) => {
    try {
      const resp = await fetchConToken(`http://localhost:3000/api/pagos/${compraId}`);
      const data = await resp.json();
      if (data.init_point) {
        window.location.href = data.init_point; // redirige al checkout de MercadoPago
      }
    } catch (error) {
      console.error("Error iniciando pago:", error);
    }
  };

  if (cargando) return <p className="text-center mt-5">Cargando...</p>;

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">👋 Bienvenido, {usuario?.nombre}</h2>

      {/* Datos del cliente */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h4 className="card-title">📋 Mis datos</h4>
          <div className="row">
            <div className="col-md-6">
              <p><strong>DNI:</strong> {usuario?.dni}</p>
              <p><strong>Teléfono:</strong> {usuario?.telefono}</p>
              <p><strong>Correo:</strong> {usuario?.email}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Dirección:</strong> {usuario?.direccion}</p>
              <p><strong>Provincia:</strong> {usuario?.provincia}</p>
              <p><strong>Localidad:</strong> {usuario?.localidad}</p>
              <p><strong>Código Postal:</strong> {usuario?.codigoPostal}</p>
            </div>
          </div>
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
                <div className="col-12 col-md-6 mb-3" key={compra._id}>
                  <div className="card border-light shadow-sm h-100">
                    <div className="card-body">
                      <h5 className="card-title">
                        Fecha: {new Date(compra.fecha).toLocaleDateString()}
                      </h5>
                      <p><strong>Total:</strong> ${compra.total}</p>
                      <p>
                        <strong>Estado:</strong>{" "}
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

                      {/* Botón de pago solo si está pendiente */}
                      {compra.estado === "pendiente" && (
                        <button
                          className="btn btn-primary btn-sm mb-3"
                          onClick={() => iniciarPago(compra._id)}
                        >
                          💳 Pagar ahora
                        </button>
                      )}

                      <ul className="list-group list-group-flush">
                        {compra.productos.map((item, idx) => (
                          <li key={idx} className="list-group-item">
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
    </div>
  );
};

export default ClientePage;

