import { httpGet, httpPost } from "./http.js";

export const OrdersService = {
  // 📋 lista todas las órdenes (solo admin o usuario dueño)
  list: () => httpGet("/api/ordenes/filtrar"),

  // 🆕 crea una nueva orden (checkout)
  create: (payload) => httpPost("/api/ordenes/checkout", payload),

  // 🚀 traer una orden por ID
  getById: async (id) => {
    if (!id) {
      throw new Error("El ID de la orden es requerido");
    }

    const data = await httpGet(`/api/ordenes/${encodeURIComponent(id)}`);

    // Normalizar la respuesta: puede venir como {orden}, {compra} o directamente el objeto
    if (data.orden) return data.orden;
    if (data.compra) return data.compra;
    return data;
  }
};
