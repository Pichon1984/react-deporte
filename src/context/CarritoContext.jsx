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
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // ➕ Agregar producto desde catálogo
  const agregarProducto = (producto, talle, cantidad = 1) => {
    if (!producto?._id) return;

    setCarrito(prev => {
      const idx = prev.findIndex(
        i => i.productoId?._id === producto._id && i.talle === talle
      );

      if (idx >= 0) {
        const nuevo = [...prev];
        nuevo[idx].cantidad += cantidad;
        return nuevo;
      } else {
        return [...prev, { productoId: producto, talle, cantidad }];
      }
    });
  };

  // ➕ Sumar unidad desde carrito (solo ID)
  const sumarUnidad = (productoId, talle) => {
    setCarrito(prev =>
      prev.map(item =>
        item.productoId?._id === productoId && item.talle === talle
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      )
    );
  };

  // ➖ Eliminar una unidad
  const eliminarProducto = (productoId, talle) => {
    setCarrito(prev =>
      prev
        .map(item =>
          item.productoId?._id === productoId && item.talle === talle
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter(item => item.cantidad > 0)
    );
  };

  // 🗑️ Eliminar producto completo
  const eliminarProductoTotal = (productoId, talle) => {
    setCarrito(prev =>
      prev.filter(
        item => !(item.productoId?._id === productoId && item.talle === talle)
      )
    );
  };

  // 🧹 Vaciar carrito
  const vaciarCarrito = () => setCarrito([]);

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



















