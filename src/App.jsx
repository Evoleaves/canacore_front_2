
import React, { useEffect, useState } from "react";

function App() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  const backendURL = import.meta.env.VITE_API_URL;

  const login = async () => {
    try {
      const tokenRes = await fetch(backendURL + "/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: "admin",
          password: "adminpass"
        })
      });

      if (!tokenRes.ok) throw new Error("Login failed");
      const { access_token } = await tokenRes.json();

      const profileRes = await fetch(backendURL + "/usuarios/me", {
        headers: { Authorization: `Bearer ${access_token}` }
      });

      const userData = await profileRes.json();
      setProfile(userData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    login();
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "Arial" }}>
      <h1>Cannacore Dashboard</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {profile ? (
        <div>
          <h2>Bienvenido, {profile.full_name}</h2>
          <p>Usuario: {profile.username}</p>
          <p>Rol: {profile.role}</p>
        </div>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
  );
}

export default App;
