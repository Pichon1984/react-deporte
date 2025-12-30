const EnvioAndreani = ({ envioAndreani }) => {
  if (!envioAndreani) return null;

  return (
    <div className="mt-3">
      <h5>Envío con Andreani</h5>
      <p>Costo estimado: ${envioAndreani.costo}</p>
      <p>Tiempo estimado: {envioAndreani.tiempo} días</p>
    </div>
  );
};

export default EnvioAndreani;
