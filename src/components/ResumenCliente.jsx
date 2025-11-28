const ResumenCliente = ({ cliente, onEditar }) => (
  <div>
    <h3>Datos personales</h3>
    <p>{cliente.nombre} {cliente.apellido}</p>
    <p>DNI: {cliente.dni}</p>
    <p>Dirección: {cliente.calle} {cliente.numero}, {cliente.ciudad}, {cliente.provincia}</p>
    <button onClick={onEditar}>Editar</button>
  </div>
);
