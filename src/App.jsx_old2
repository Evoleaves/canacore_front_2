
import React, { useEffect, useState } from "react";

function App() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const backendURL = import.meta.env.VITE_API_URL;

  const loginAndTest = async () => {
    try {
      // Login en /login (no /token)
      const tokenRes = await fetch(backendURL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: "admin",
          password: "adminpass"
        })
      });

      if (!tokenRes.ok) throw new Error("Login fallido");
      const { access_token } = await tokenRes.json();

      // Usar token para acceder a /predict como prueba
      const testRes = await fetch(backendURL + "/predict", {
        method: "POST",
        headers: { Authorization: `Bearer ${access_token}` },
        body: new FormData() // no se envía archivo, es solo para probar autenticación
      });

      const result = await testRes.json();
      setResponse(result);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loginAndTest();
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "Arial" }}>
      <h1>Cannacore Dashboard</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {response ? (
        <pre>{JSON.stringify(response, null, 2)}</pre>
      ) : (
        <p>Cargando respuesta del backend...</p>
      )}
    </div>
  );
}

export default App;
