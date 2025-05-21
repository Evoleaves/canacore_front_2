
import React, { useEffect, useState } from "react";

function App() {
  const [token, setToken] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const backendURL = import.meta.env.VITE_API_URL;

  // Login automático al montar
  useEffect(() => {
    const login = async () => {
      try {
        const res = await fetch(backendURL + "/login", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            username: "admin",
            password: "adminpass",
          }),
        });

        if (!res.ok) throw new Error("Login fallido");
        const data = await res.json();
        setToken(data.access_token);
      } catch (err) {
        setError(err.message);
      }
    };

    login();
  }, []);

  // Manejar selección de archivo
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setPrediction(null);
    setError(null);
  };

  // Enviar imagen al backend
  const handleUpload = async () => {
    if (!selectedFile || !token) {
      setError("Falta archivo o token");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await fetch(backendURL + "/predict", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Error al predecir imagen");
      const result = await res.json();
      setPrediction(result);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: 24, fontFamily: "Arial" }}>
      <h1>Cannacore Dashboard</h1>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile || !token}>
        Enviar Imagen
      </button>

      {prediction && (
        <div style={{ marginTop: 20 }}>
          <h2>Predicción</h2>
          <pre>{JSON.stringify(prediction, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
