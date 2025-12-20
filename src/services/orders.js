import { httpGet, httpPost } from "./http.js";

export const OrdersService = {
  list: () => httpGet("/api/orders"),
  create: (payload) => httpPost("/api/orders", payload),
};
