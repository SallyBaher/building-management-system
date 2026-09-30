import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "../../i18n";
import "./AccountCreate.css";

function AccountCreate() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    mobileNumber: "",
    accessLevel: "Resident",
  });

  const isArabic = language === "ar";

  const text = {
    en: {
      managementPortal: "Management Portal",
      superAdmin: "Super Admin",
      dashboard: "Dashboard",
      building: "Building",
      maintenance: "Maintenance",
      finance: "Finance",
      residents: "Residents",
      communication: "Communication",
      settings: "Settings",
      logout: "Logout",

      addPerson: "Add Person",
      addPersonDescription:
        "Create an account for a new owner or resident.",

      accountInformation: "Account Information",

      fullName: "Full Name",
      idNumber: "ID Number",
      mobileNumber: "Mobile Number",
      accessLevel: "Access Level",

      selectAccessLevel: "Select access level",
      superAdmin: "Super Admin",
      residentWithPrivilege: "Resident with Privilege",
      resident: "Resident",

      cancel: "Cancel",
      createAccount: "Create Account",
      creating: "Creating...",

      createError: "Unable to create account.",
    },

    ar: {
      managementPortal: "بوابة الإدارة",
      superAdmin: "المسؤول الرئيسي",
      dashboard: "لوحة التحكم",
      building: "المبنى",
      maintenance: "الصيانة",
      finance: "المالية",
      residents: "السكان",
      communication: "التواصل",
      settings: "الإعدادات",
      logout: "تسجيل الخروج",

      addPerson: "إضافة شخص",
      addPersonDescription:
        "إنشاء حساب لمالك أو ساكن جديد.",

      accountInformation: "معلومات الحساب",

      fullName: "الاسم الكامل",
      idNumber: "الرقم التعريفي",
      mobileNumber: "رقم الهاتف",
      accessLevel: "مستوى الصلاحية",

      selectAccessLevel: "اختر مستوى الصلاحية",
      superAdmin: "المسؤول الرئيسي",
      residentWithPrivilege: "ساكن بصلاحيات",
      resident: "ساكن",

      cancel: "إلغاء",
      createAccount: "إنشاء الحساب",
      creating: "جاري الإنشاء...",

      createError: "تعذر إنشاء الحساب.",
    },
  };

  const currentText = text[language];

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [language, isArabic]);

  function handleLanguageChange(newLanguage) {
    localStorage.setItem("language", newLanguage);
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://backend-production-b205a.up.railway.app/accounts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || currentText.createError
        );
      }

      navigate("/residents");
    } catch (createError) {
      setError(createError.message);
      setSaving(false);
    }
  }

  return (
    <div
      className={`account-create-page ${
        isArabic ? "account-create-rtl" : ""
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <header className="account-create-header">
        <div className="account-create-header-left">
          <button
            type="button"
            className="account-create-menu-button"
            onClick={() =>
              setIsMenuOpen((previous) => !previous)
            }
          >
            <span className="material-symbols-outlined">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>

          <div className="account-create-header-brand">
            <span className="account-create-header-title">
              SBM
            </span>

            <span className="account-create-header-subtitle">
              {isArabic
                ? "إدارة المباني الذكية"
                : "Smart Block Management"}
            </span>
          </div>
        </div>

        <div className="account-create-header-actions">
          <div
            className="account-create-language-switcher"
            dir="ltr"
          >
            <button
              type="button"
              className={language === "en" ? "active" : ""}
              onClick={() => handleLanguageChange("en")}
            >
              EN
            </button>

            <button
              type="button"
              className={language === "ar" ? "active" : ""}
              onClick={() => handleLanguageChange("ar")}
            >
              عربي
            </button>
          </div>

          <span className="material-symbols-outlined account-create-header-icon">
            notifications
          </span>

          <button
            type="button"
            className="account-create-header-settings"
          >
            <span className="material-symbols-outlined">
              settings
            </span>
          </button>

          <button
            type="button"
            className="account-create-logout-button"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined">
              logout
            </span>

            {currentText.logout}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="account-create-mobile-menu">
            <button
              type="button"
              className="account-create-sidebar-link"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/building-information");
              }}
            >
              <span className="material-symbols-outlined">
                apartment
              </span>

              {currentText.building}
            </button>

            <button
              type="button"
              className="account-create-sidebar-link active"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/residents");
              }}
            >
              <span className="material-symbols-outlined">
                groups
              </span>

              {currentText.residents}
            </button>
          </nav>
        )}
      </header>

      <div className="account-create-layout">
        <aside className="account-create-sidebar">
          <div className="account-create-sidebar-heading">
            <h2>{currentText.superAdmin}</h2>
            <p>{currentText.managementPortal}</p>
          </div>

          <nav className="account-create-sidebar-nav">
            <button
              type="button"
              className="account-create-sidebar-link"
              onClick={() => navigate("/building-information")}
            >
              <span className="material-symbols-outlined">
                dashboard
              </span>

              {currentText.dashboard}
            </button>

            <button
              type="button"
              className="account-create-sidebar-link"
              onClick={() => navigate("/building-information")}
            >
              <span className="material-symbols-outlined">
                apartment
              </span>

              {currentText.building}
            </button>

            <button
              type="button"
              className="account-create-sidebar-link"
            >
              <span className="material-symbols-outlined">
                engineering
              </span>

              {currentText.maintenance}
            </button>

            <button
              type="button"
              className="account-create-sidebar-link"
            >
              <span className="material-symbols-outlined">
                payments
              </span>

              {currentText.finance}
            </button>

            <button
              type="button"
              className="account-create-sidebar-link active"
              onClick={() => navigate("/residents")}
            >
              <span className="material-symbols-outlined">
                groups
              </span>

              {currentText.residents}
            </button>

            <button
              type="button"
              className="account-create-sidebar-link"
            >
              <span className="material-symbols-outlined">
                chat
              </span>

              {currentText.communication}
            </button>
          </nav>

          <div className="account-create-sidebar-footer">
            SBM Management Portal
          </div>
        </aside>

        <main className="account-create-content">
          <div className="account-create-content-top">
            <div>
              <h1 className="account-create-page-title">
                {currentText.addPerson}
              </h1>

              <p className="account-create-page-description">
                {currentText.addPersonDescription}
              </p>
            </div>
          </div>

          <form
            className="account-create-card"
            onSubmit={handleSubmit}
          >
            <div className="account-create-card-header">
              <div className="account-create-card-icon">
                <span className="material-symbols-outlined">
                  person_add
                </span>
              </div>

              <div>
                <h2>
                  {currentText.accountInformation}
                </h2>
              </div>
            </div>

            <div className="account-create-form-grid">
              <div className="account-create-field">
                <label htmlFor="fullName">
                  {currentText.fullName}
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="account-create-field">
                <label htmlFor="idNumber">
                  {currentText.idNumber}
                </label>

                <input
                  id="idNumber"
                  name="idNumber"
                  type="text"
                  value={formData.idNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="account-create-field">
                <label htmlFor="mobileNumber">
                  {currentText.mobileNumber}
                </label>

                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="text"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="account-create-field">
                <label htmlFor="accessLevel">
                  {currentText.accessLevel}
                </label>

                <select
                  id="accessLevel"
                  name="accessLevel"
                  value={formData.accessLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="">
                    {currentText.selectAccessLevel}
                  </option>

                  <option value="Super Admin">
                    {currentText.superAdmin}
                  </option>

                  <option value="Resident with Privilege">
                    {currentText.residentWithPrivilege}
                  </option>

                  <option value="Resident">
                    {currentText.resident}
                  </option>
                </select>
              </div>
            </div>

            {error && (
              <div className="account-create-error">
                {error}
              </div>
            )}

            <div className="account-create-form-actions">
              <button
                type="button"
                className="account-create-cancel-button"
                onClick={() => navigate("/residents")}
                disabled={saving}
              >
                {currentText.cancel}
              </button>

              <button
                type="submit"
                className="account-create-save-button"
                disabled={saving}
              >
                <span className="material-symbols-outlined">
                  person_add
                </span>

                {saving
                  ? currentText.creating
                  : currentText.createAccount}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default AccountCreate;