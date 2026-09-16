import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [language, setLanguage] = useState(
  () => localStorage.getItem("language") || "en"
);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isArabic = language === "ar";

  const text = {
    en: {
      portalTitle: "Management Portal",
      description:
        "Enter your credentials to access the management dashboard.",
      username: "Username / Email",
      password: "Password",
      login: "Login",
      invalidCredentials:
        "Invalid credentials. Please verify your username and password.",
      managementLogin: "Management Login",
      copyright:
        "© 2026 SBM. All rights reserved.",
    },
    ar: {
      portalTitle: "بوابة الإدارة",
      description:
        "أدخل بيانات الدخول للوصول إلى لوحة تحكم الإدارة.",
      username: "اسم المستخدم / البريد الإلكتروني",
      password: "كلمة المرور",
      login: "تسجيل الدخول",
      invalidCredentials:
        "بيانات الدخول غير صحيحة. يرجى التحقق من اسم المستخدم وكلمة المرور.",
      managementLogin: "تسجيل الدخول للإدارة",
      copyright:
        "© 2026 إس بي إم. جميع الحقوق محفوظة.",
    },
  };

  const currentText = text[language];

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || currentText.invalidCredentials);
      }

      localStorage.setItem("token", data.token);
      navigate("/building-information");
    } catch (submitError) {
      setError(submitError.message || currentText.invalidCredentials);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-page ${isArabic ? "login-rtl" : ""}`}>
      <header className="login-header">
  <div className="login-header-inner">
    <div className="login-brand">
      <div className="login-brand-icon">
        <span className="material-symbols-outlined">
          apartment
        </span>
      </div>

      <div className="login-brand-name">
  {isArabic ? "إدارة المباني الذكية" : "Smart Block Management"}
</div>

      <span className="login-brand-badge">
        {isArabic ? "تسجيل الدخول للإدارة" : "Management Login"}
      </span>
    </div>

    <div className="login-language-switcher" dir="ltr">
      <button
  type="button"
  className={language === "en" ? "active" : ""}
  onClick={() => {
  setLanguage("en");
  localStorage.setItem("language", "en");
}}
>
  {isArabic ? "الإنجليزية" : "EN"}
</button>

<button
  type="button"
  className={language === "ar" ? "active" : ""}
  onClick={() => {
  setLanguage("ar");
  localStorage.setItem("language", "ar");
}}
>
  {isArabic ? "العربية" : "AR"}
</button>
    </div>
  </div>
</header>

      <main className="login-main">
        <section className="login-card">
          <div className="login-logo">
            <span className="material-symbols-outlined">
              apartment
            </span>
          </div>

          <h1>{currentText.portalTitle}</h1>

          <p className="login-description">
            {currentText.description}
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-field">
              <span>{currentText.username}</span>

              <div className="login-input-wrapper">
                <span className="material-symbols-outlined">
                  person
                </span>

                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                  autoComplete="username"
                />
              </div>
            </label>

            <label className="login-field">
              <span>{currentText.password}</span>

              <div
                className={`login-input-wrapper ${
                  error ? "has-error" : ""
                }`}
              >
                <span className="material-symbols-outlined">
                  lock
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </label>

            {error && (
              <div className="login-error">
                <span className="material-symbols-outlined">
                  error
                </span>

                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? "..." : currentText.login}
            </button>
          </form>

<p className="login-copyright">
  {currentText.copyright}
</p>
        </section>
      </main>
    </div>
  );
}

export default Login;