import React, { useEffect, useState } from "react";

function Header({ token }) {
  const [ubicacion, setUbicacion] = useState("Detectando ubicación...");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          try {
            const resp = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const data = await resp.json();

            const ciudad =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "";
            const provincia = data.address.state || "";
            const pais = data.address.country || "";

            const textoUbicacion = `Estás en ${ciudad}, ${provincia}, ${pais}`;
            setUbicacion(textoUbicacion);

           
            await fetch("/api/usuarios/ubicacion", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-token": token 
              },
              body: JSON.stringify({
                ciudad,
                provincia,
                pais,
                lat,
                lon
              })
            });
          } catch (error) {
            console.error("Error al obtener ubicación:", error);
            setUbicacion("No se pudo obtener ubicación");
          }
        },
        (err) => {
          console.error("Error geolocalización:", err);
          setUbicacion("Permiso de ubicación denegado");
        }
      );
    } else {
      setUbicacion("Tu navegador no soporta geolocalización");
    }
  }, [token]);

  return (
    <header style={{ background: "#f5f5f5", padding: "10px" }}>
      <h1>Mi página</h1>
      <span>{ubicacion}</span>
    </header>
  );
}

export default Header;





