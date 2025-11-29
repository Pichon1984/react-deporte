export const getCarritoKey = (usuario) =>
  usuario ? `carrito-${usuario.id}` : 'carrito-anonimo';

export const cargarCarrito = (usuario) => {
  const claveUsuario = getCarritoKey(usuario);
  const carritoUsuario = localStorage.getItem(claveUsuario);
  if (carritoUsuario) return JSON.parse(carritoUsuario);

  const carritoAnonimo = localStorage.getItem('carrito-anonimo');
  if (usuario && carritoAnonimo) {
    localStorage.setItem(claveUsuario, carritoAnonimo);
    localStorage.removeItem('carrito-anonimo');
    return JSON.parse(carritoAnonimo);
  }

  return carritoAnonimo ? JSON.parse(carritoAnonimo) : [];
};

export const guardarCarrito = (usuario, carrito) => {
  const clave = getCarritoKey(usuario);
  localStorage.setItem(clave, JSON.stringify(carrito));
};

export const eliminarCarrito = (usuario) => {
  const clave = getCarritoKey(usuario);
  localStorage.removeItem(clave);
};

export const fusionarCarritos = (usuario) => {
  const claveUsuario = getCarritoKey(usuario);
  const carritoUsuario = JSON.parse(localStorage.getItem(claveUsuario) || '[]');
  const carritoAnonimo = JSON.parse(localStorage.getItem('carrito-anonimo') || '[]');

  const fusionado = [...carritoUsuario];

  carritoAnonimo.forEach(itemAnonimo => {
    const index = fusionado.findIndex(item => item.id === itemAnonimo.id);
    if (index !== -1) {
      fusionado[index].cantidad += itemAnonimo.cantidad;
    } else {
      fusionado.push(itemAnonimo);
    }
  });

  localStorage.setItem(claveUsuario, JSON.stringify(fusionado));
  localStorage.removeItem('carrito-anonimo');
  return fusionado;
};

