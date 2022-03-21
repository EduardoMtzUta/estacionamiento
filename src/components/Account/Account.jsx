import { useState, useEffect } from "react";
import { supabase } from "../../config/supabaseClient";
import Avatar from "../Avatar/Avatar";
import i18n from "../../config/localization/i18n";

const Account = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [rol, setRol] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  const getProfile = async () => {
    try {
      setLoading(true);
      const user = supabase.auth.user();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, avatar_url,rol `)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setRol(data.rol);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const user = supabase.auth.user();

      const updates = {
        id: user.id,
        username,
        rol,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates, {
        returning: "minimal", // Don't return the value after inserting
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div aria-live="polite">
      {loading ? (
        "Saving ..."
      ) : (
        <form onSubmit={updateProfile} className="form-widget">
          <Avatar
            url={avatar_url}
            size={150}
            onUpload={(url) => {
              setAvatarUrl(url);
              updateProfile({ username, rol, avatar_url: url });
            }}
          />
          <div>Correo: {session.user.email}</div>
          <div>
            <label htmlFor="username">{i18n.t("Nombre")}</label>
            <input
              id="username"
              type="text"
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="rol">rol</label>
            <select id="rol" type="text" onChange={(e) => {const selectedRol = e.target.value; setRol(selectedRol)}}>
              <option value="Administrador" >{i18n.t("Administrador")}</option>
              <option value="Cliente">{i18n.t("Cliente")}</option>
            </select>
          </div>
          <div>
            <button className="button block primary" disabled={loading}>
              {i18n.t("ActualizarP")}
            </button>
          </div>
        </form>
      )}
      <button
        type="button"
        className="button block"
        onClick={() => supabase.auth.signOut()}
      >
        {i18n.t("Deslogearse")}
      </button>
    </div>
  );
};

export default Account;
