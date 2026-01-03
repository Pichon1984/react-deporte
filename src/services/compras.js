import { httpGet, httpPost, httpPut } from "./http.js";

export const ComprasService = {
  // 📋 Lista todas las compras (solo ADMIN)
  list: () => httpGet("/api/compras"),

  // 📋 Lista compras del cliente autenticado
  listMine: () => httpGet("/api/compras/mias"),

  // 🆕 Crear una nueva compra vinculada a una orden
  create: (payload) => httpPost("/api/compras", payload),

  // 🚀 Traer una compra por ID
  getById: async (id) => {
    if (!id) {
      throw new Error("El ID de la compra es requerido");
    }

    const data = await httpGet(`/api/compras/${encodeURIComponent(id)}`);

    // Normalizar la respuesta: puede venir como {compra}, {orden} o directamente el objeto
    if (data.compra) return data.compra;
    if (data.orden) return data.orden;
    return data;
  },

  // ✅ Confirmar pago manualmente (solo ADMIN)
  confirmarPago: (id) => {
    if (!id) throw new Error("El ID de la compra es requerido");
    return httpPut(`/api/compras/${encodeURIComponent(id)}/confirmar-pago`);
  },

  // 🚚 Actualizar estado de envío (solo ADMIN)
  actualizarEnvio: (id, payload) => {
    if (!id) throw new Error("El ID de la compra es requerido");
    return httpPut(`/api/compras/${encodeURIComponent(id)}/envio`, payload);
  },
};
