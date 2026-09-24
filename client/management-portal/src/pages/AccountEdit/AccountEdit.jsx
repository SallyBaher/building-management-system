import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import i18n from "../../i18n";
import "./AccountEdit.css";

function AccountEdit() {
  const navigate = useNavigate();
  const { accountId } = useParams();

  const [account, setAccount] = useState({
    fullName: "",
    idNumber: "",
    mobileNumber: "",
    accessLevel: "Resident",
    isActive: true,
  });

  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

      editAccount: "Edit Account",
      editAccountDescription:
        "Update the account information and access settings.",

      accountInformation: "Account Information",

      fullName: "Full Name",
      idNumber: "ID Number",
      mobileNumber: "Mobile Number",
      accessLevel: "Access Level",
      accountStatus: "Account Status",

      active: "Active",
      inactive: "Inactive",

      saveChanges: "Save Changes",
      cancel: "Cancel",

      loading: "Loading account...",
      loadingDescription:
        "Please wait while the account information is loaded.",

      saving: "Saving...",

      requiredFields:
        "Full name, ID number, mobile number and access level are required.",

      saveError: "Unable to update account.",
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

      editAccount: "تعديل الحساب",
      editAccountDescription:
        "تحديث معلومات الحساب وإعدادات الصلاحيات.",

      accountInformation: "معلومات الحساب",

      fullName: "الاسم الكامل",
      idNumber: "الرقم التعريفي",
      mobileNumber: "رقم الهاتف",
      accessLevel: "مستوى الصلاحية",
      accountStatus: "حالة الحساب",

      active: "نشط",
      inactive: "غير نشط",

      saveChanges: "حفظ التغييرات",
      cancel: "إلغاء",

      loading: "جاري تحميل الحساب...",
      loadingDescription:
        "يرجى الانتظار حتى يتم تحميل معلومات الحساب.",

      saving: "جاري الحفظ...",

      requiredFields:
        "الاسم الكامل والرقم التعريفي ورقم الهاتف ومستوى الصلاحية مطلوبة.",

      saveError: "تعذر تحديث الحساب.",
    },
  };

  const currentText = text[language];

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [language, isArabic]);

  useEffect(() => {
    async function fetchAccount() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/accounts/${accountId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }

          throw new Error(
            data.message || "Failed to load account."
          );
        }

        setAccount({
          fullName: data.FullName || "",
          idNumber: data.IDNumber || "",
          mobileNumber: data.MobileNumber || "",
          accessLevel: data.AccessLevel || "Resident",
          isActive: data.IsActive === true,
        });
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAccount();
  }, [accountId, navigate]);

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

    setAccount((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleStatusChange(event) {
    setAccount((previous) => ({
      ...previous,
      isActive: event.target.value === "active",
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
        `http://localhost:5000/accounts/${accountId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName: account.fullName,
            idNumber: account.idNumber,
            mobileNumber: account.mobileNumber,
            accessLevel: account.accessLevel,
            isActive: account.isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || currentText.saveError
        );
      }

      navigate("/residents");
    } catch (saveError) {
      setError(saveError.message);
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="account-edit-state">
        <div className="account-edit-state-card">
          <h1>{currentText.loading}</h1>
          <p>{currentText.loadingDescription}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`account-edit-page ${
        isArabic ? "account-edit-rtl" : ""
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <header className="account-edit-header">
        <div className="account-edit-header-left">
          <button
            type="button"
            className="account-edit-menu-button"
            onClick={() =>
              setIsMenuOpen((previous) => !previous)
            }
          >
            <span className="material-symbols-outlined">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>

          <div className="account-edit-header-brand">
            <span className="account-edit-header-title">
              SBM
            </span>

            <span className="account-edit-header-subtitle">
              {isArabic
                ? "إدارة المباني الذكية"
                : "Smart Block Management"}
            </span>
          </div>
        </div>

        <div className="account-edit-header-actions">
          <div
            className="account-edit-language-switcher"
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

          <span className="material-symbols-outlined account-edit-header-icon">
            notifications
          </span>

          <button
            type="button"
            className="account-edit-header-settings"
          >
            <span className="material-symbols-outlined">
              settings
            </span>
          </button>

          <button
            type="button"
            className="account-edit-logout-button"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined">
              logout
            </span>

            {currentText.logout}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="account-edit-mobile-menu">
            <button
              type="button"
              className="account-edit-sidebar-link"
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
              className="account-edit-sidebar-link active"
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

      <div className="account-edit-layout">
        <aside className="account-edit-sidebar">
          <div className="account-edit-sidebar-heading">
            <h2>{currentText.superAdmin}</h2>
            <p>{currentText.managementPortal}</p>
          </div>

          <nav className="account-edit-sidebar-nav">
            <button
              type="button"
              className="account-edit-sidebar-link"
              onClick={() => navigate("/building-information")}
            >
              <span className="material-symbols-outlined">
                dashboard
              </span>

              {currentText.dashboard}
            </button>

            <button
              type="button"
              className="account-edit-sidebar-link"
              onClick={() => navigate("/building-information")}
            >
              <span className="material-symbols-outlined">
                apartment
              </span>

              {currentText.building}
            </button>

            <button
              type="button"
              className="account-edit-sidebar-link"
            >
              <span className="material-symbols-outlined">
                engineering
              </span>

              {currentText.maintenance}
            </button>

            <button
              type="button"
              className="account-edit-sidebar-link"
            >
              <span className="material-symbols-outlined">
                payments
              </span>

              {currentText.finance}
            </button>

            <button
              type="button"
              className="account-edit-sidebar-link active"
              onClick={() => navigate("/residents")}
            >
              <span className="material-symbols-outlined">
                groups
              </span>

              {currentText.residents}
            </button>

            <button
              type="button"
              className="account-edit-sidebar-link"
            >
              <span className="material-symbols-outlined">
                chat
              </span>

              {currentText.communication}
            </button>
          </nav>

          <div className="account-edit-sidebar-footer">
            SBM Management Portal
          </div>
        </aside>

        <main className="account-edit-content">
          <div className="account-edit-content-top">
            <div>
              <h1 className="account-edit-page-title">
                {currentText.editAccount}
              </h1>

              <p className="account-edit-page-description">
                {currentText.editAccountDescription}
              </p>
            </div>
          </div>

          <form
            className="account-edit-card"
            onSubmit={handleSubmit}
          >
            <div className="account-edit-card-header">
              <div className="account-edit-card-icon">
                <span className="material-symbols-outlined">
                  person
                </span>
              </div>

              <div>
                <h2>{currentText.accountInformation}</h2>
                <p>Account #{accountId}</p>
              </div>
            </div>

            <div className="account-edit-form-grid">
              <div className="account-edit-field">
                <label htmlFor="fullName">
                  {currentText.fullName}
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={account.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="account-edit-field">
                <label htmlFor="idNumber">
                  {currentText.idNumber}
                </label>

                <input
                  id="idNumber"
                  name="idNumber"
                  type="text"
                  value={account.idNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="account-edit-field">
                <label htmlFor="mobileNumber">
                  {currentText.mobileNumber}
                </label>

                <input
                  id="mobileNumber"
                  name="mobileNumber"
                  type="text"
                  value={account.mobileNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="account-edit-field">
                <label htmlFor="accessLevel">
                  {currentText.accessLevel}
                </label>

                <select
                  id="accessLevel"
                  name="accessLevel"
                  value={account.accessLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="Super Admin">
                    Super Admin
                  </option>

                  <option value="Resident with Privilege">
                    Resident with Privilege
                  </option>

                  <option value="Resident">
                    Resident
                  </option>
                </select>
              </div>

              <div className="account-edit-field">
                <label htmlFor="accountStatus">
                  {currentText.accountStatus}
                </label>

                <select
                  id="accountStatus"
                  value={account.isActive ? "active" : "inactive"}
                  onChange={handleStatusChange}
                >
                  <option value="active">
                    {currentText.active}
                  </option>

                  <option value="inactive">
                    {currentText.inactive}
                  </option>
                </select>
              </div>
            </div>

            {error && (
              <div className="account-edit-error">
                {error}
              </div>
            )}

            <div className="account-edit-form-actions">
              <button
                type="button"
                className="account-edit-cancel-button"
                onClick={() => navigate("/residents")}
                disabled={saving}
              >
                {currentText.cancel}
              </button>

              <button
                type="submit"
                className="account-edit-save-button"
                disabled={saving}
              >
                <span className="material-symbols-outlined">
                  save
                </span>

                {saving
                  ? currentText.saving
                  : currentText.saveChanges}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default AccountEdit;