import { useState, useEffect } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState(() => {
    const guardados = localStorage.getItem('usuarios-admin');
    return guardados ? JSON.parse(guardados) : [];
  });

  useEffect(() => {
    localStorage.setItem('usuarios-admin', JSON.stringify(usuarios));
  }, [usuarios]);

  const bloquearUsuario = (id) => {
    setUsuarios(prev =>
      prev.map(u =>
        u.id === id ? { ...u, bloqueado: !u.bloqueado } : u
      )
    );
  };

  const eliminarUsuario = (id) => {
    if (window.confirm('¿Eliminar este usuario?')) {
      setUsuarios(prev => prev.filter(u => u.id !== id));
    }
  };

  return (
    <div className="mt-4">
      <h3 className="mb-3">Gestión de Usuarios</h3>

      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.email}</td>
                  <td>{u.rol || 'usuario'}</td>
                  <td>
                    {u.bloqueado ? (
                      <Badge bg="danger">Bloqueado</Badge>
                    ) : (
                      <Badge bg="success">Activo</Badge>
                    )}
                  </td>
                  <td>
                    <Button
                      variant={u.bloqueado ? 'success' : 'warning'}
                      size="sm"
                      className="me-2"
                      onClick={() => bloquearUsuario(u.id)}
                    >
                      {u.bloqueado ? 'Desbloquear' : 'Bloquear'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => eliminarUsuario(u.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminUsuarios;

