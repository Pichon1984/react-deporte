import React, { createContext, useState, useEffect } from "react";

export const CarritoContext = createContext();

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    try {
      const saved = localStorage.getItem("carrito");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    } catch (err) {
      console.error("Error guardando carrito en localStorage:", err);
    }
  }, [carrito]);

  const agregarProducto = (producto, talle, cantidad = 1, envio = "") => {
    if (!producto?._id) return;

    setCarrito(prev => {
      const idx = prev.findIndex(
        i =>
          i.productoId?._id === producto._id &&
          i.talle === talle &&
          i.envio === envio
      );

      if (idx >= 0) {
        const nuevo = [...prev];
        nuevo[idx].cantidad += cantidad;
        return nuevo;
      } else {
        return [...prev, { productoId: producto, talle, cantidad, envio }];
      }
    });
  };

  const sumarUnidad = (productoId, talle, envio = "") => {
    setCarrito(prev =>
      prev.map(item =>
        item.productoId?._id === productoId &&
        item.talle === talle &&
        item.envio === envio
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  const eliminarProducto = (productoId, talle, envio = "") => {
    setCarrito(prev =>
      prev
        .map(item =>
          item.productoId?._id === productoId &&
          item.talle === talle &&
          item.envio === envio
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter(item => item.cantidad > 0)
    );
  };

  const eliminarProductoTotal = (productoId, talle, envio = "") => {
    setCarrito(prev =>
      prev.filter(
        item =>
          !(
            item.productoId?._id === productoId &&
            item.talle === talle &&
            item.envio === envio
          )
      )
    );
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    try {
      localStorage.removeItem("carrito"); // 👈 limpia también el storage
    } catch (err) {
      console.error("Error limpiando carrito en localStorage:", err);
    }
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarProducto,
        sumarUnidad,
        eliminarProducto,
        eliminarProductoTotal,
        vaciarCarrito
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};













