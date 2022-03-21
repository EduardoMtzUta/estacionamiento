import "./index.css";
import { useState, useEffect } from "react";
import { supabase } from "./config/supabaseClient";
import { Auth } from "./components/Auth";
import Cliente from "./Pages/HomeCliente/Cliente";
import Admin from "./Pages/Admin/Admin";
import Account from "./components/Account/Account";

function App() {
  const [session, setSession] = useState(null);
  const [rol, setRol] = useState();

  const readRol = async () => {
    const user = supabase.auth.user();
    let { data: registros } = await supabase
      .from("profiles")
      .select("rol")
      .eq("id", user.id);
    let datos = registros[0].rol;
    setRol(datos);
  };

  useEffect(() => {
    setSession(supabase.auth.session());
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    readRol();
  }, []);

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <Auth />
      ) : (rol === null ? (
        <Account key={session.user.id} session={session} />
      ) : (rol === "Cliente" ? (
        <Admin key={session.user.id} session={session} />
      ) : (
        <Cliente key={session.user.id} session={session} />
      )))}
    </div>
  );
}

export default App;
