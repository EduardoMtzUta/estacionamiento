import { useState } from 'react'
import { supabase } from '../../config/supabaseClient'
import i18n from "../../config/localization/i18n";

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const { error } = await supabase.auth.signIn({ email })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="row flex flex-center">
      <div className="col-6 form-widget" aria-live="polite">
        <h1 className="header">{i18n.t("Login")}</h1>
        <p className="description">{i18n.t("Ingresa")}</p>
        {loading ? (
          'Enviando link mágico...'
        ) : (
          <form onSubmit={handleLogin}>
            <label htmlFor="email">{i18n.t("Correo")}</label>
            <input
              id="email"
              className="inputField"
              type="email"
              placeholder={i18n.t("IngresaC")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="button block" aria-live="polite">
            {i18n.t("EnviarLinkM")}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}