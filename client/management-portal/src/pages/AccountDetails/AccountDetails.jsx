import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import i18n from "../../i18n";
import "./AccountDetails.css";

function AccountDetails() {
  const navigate = useNavigate();
  const { accountId } = useParams();

  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

      accountDetails: "Account Details",
      accountInformation: "Account information and access details.",

      fullName: "Full Name",
      idNumber: "ID Number",
      mobileNumber: "Mobile Number",
      accessLevel: "Access Level",
      accountStatus: "Account Status",

      active: "Active",
      inactive: "Inactive",

      backToPeople: "Back to Residents",

      loading: "Loading account...",
      loadingDescription:
        "Please wait while the account information is loaded.",
      loadingError: "Unable to load account",
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

      accountDetails: "تفاصيل الحساب",
      accountInformation:
        "معلومات الحساب وتفاصيل الصلاحيات.",

      fullName: "الاسم الكامل",
      idNumber: "الرقم التعريفي",
      mobileNumber: "رقم الهاتف",
      accessLevel: "مستوى الصلاحية",
      accountStatus: "حالة الحساب",

      active: "نشط",
      inactive: "غير نشط",

      backToPeople: "العودة إلى السكان",

      loading: "جاري تحميل الحساب...",
      loadingDescription:
        "يرجى الانتظار حتى يتم تحميل معلومات الحساب.",
      loadingError: "تعذر تحميل الحساب",
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
          `https://backend-production-b205a.up.railway.app/accounts/${accountId}`,
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

        setAccount(data);
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

  if (loading) {
    return (
      <div className="account-details-state">
        <div className="account-details-state-card">
          <h1>{currentText.loading}</h1>
          <p>{currentText.loadingDescription}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-details-state">
        <div className="account-details-state-card">
          <h1>{currentText.loadingError}</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`account-details-page ${
        isArabic ? "account-details-rtl" : ""
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <header className="account-details-header">
        <div className="account-details-header-left">
          <button
            type="button"
            className="account-details-menu-button"
            onClick={() => setIsMenuOpen((previous) => !previous)}
          >
            <span className="material-symbols-outlined">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>

          <div className="account-details-header-brand">
            <span className="account-details-header-title">
              SBM
            </span>

            <span className="account-details-header-subtitle">
              {isArabic
                ? "إدارة المباني الذكية"
                : "Smart Block Management"}
            </span>
          </div>
        </div>

        <div className="account-details-header-actions">
          <div
            className="account-details-language-switcher"
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

          <span className="material-symbols-outlined account-details-header-icon">
            notifications
          </span>

          <button
            type="button"
            className="account-details-header-settings"
          >
            <span className="material-symbols-outlined">
              settings
            </span>
          </button>

          <button
            type="button"
            className="account-details-logout-button"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined">
              logout
            </span>

            {currentText.logout}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="account-details-mobile-menu">
            <button
              type="button"
              className="account-details-sidebar-link"
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
              className="account-details-sidebar-link active"
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

      <div className="account-details-layout">
        <aside className="account-details-sidebar">
          <div className="account-details-sidebar-heading">
            <h2>{currentText.superAdmin}</h2>
            <p>{currentText.managementPortal}</p>
          </div>

          <nav className="account-details-sidebar-nav">
            <button
              type="button"
              className="account-details-sidebar-link"
              onClick={() => navigate("/building-information")}
            >
              <span className="material-symbols-outlined">
                dashboard
              </span>

              {currentText.dashboard}
            </button>

            <button
              type="button"
              className="account-details-sidebar-link"
              onClick={() => navigate("/building-information")}
            >
              <span className="material-symbols-outlined">
                apartment
              </span>

              {currentText.building}
            </button>

            <button
              type="button"
              className="account-details-sidebar-link"
            >
              <span className="material-symbols-outlined">
                engineering
              </span>

              {currentText.maintenance}
            </button>

            <button
              type="button"
              className="account-details-sidebar-link"
            >
              <span className="material-symbols-outlined">
                payments
              </span>

              {currentText.finance}
            </button>

            <button
              type="button"
              className="account-details-sidebar-link active"
              onClick={() => navigate("/residents")}
            >
              <span className="material-symbols-outlined">
                groups
              </span>

              {currentText.residents}
            </button>

            <button
              type="button"
              className="account-details-sidebar-link"
            >
              <span className="material-symbols-outlined">
                chat
              </span>

              {currentText.communication}
            </button>
          </nav>

          <div className="account-details-sidebar-footer">
            SBM Management Portal
          </div>
        </aside>

        <main className="account-details-content">
          <div className="account-details-content-top">
            <div>
              <h1 className="account-details-page-title">
                {currentText.accountDetails}
              </h1>

              <p className="account-details-page-description">
                {currentText.accountInformation}
              </p>
            </div>

            <button
              type="button"
              className="account-details-back-button"
              onClick={() => navigate("/residents")}
            >
              <span className="material-symbols-outlined">
                arrow_back
              </span>

              {currentText.backToPeople}
            </button>
          </div>

          <section className="account-details-card">
            <div className="account-details-card-header">
              <div className="account-details-card-icon">
                <span className="material-symbols-outlined">
                  person
                </span>
              </div>

              <div>
                <h2>{account.FullName}</h2>
                <p>
                  Account #{account.AccountID}
                </p>
              </div>
            </div>

            <div className="account-details-grid">
              <div className="account-details-item">
                <span>{currentText.fullName}</span>
                <strong>{account.FullName}</strong>
              </div>

              <div className="account-details-item">
                <span>{currentText.idNumber}</span>
                <strong>{account.IDNumber}</strong>
              </div>

              <div className="account-details-item">
                <span>{currentText.mobileNumber}</span>
                <strong>{account.MobileNumber || "—"}</strong>
              </div>

              <div className="account-details-item">
                <span>{currentText.accessLevel}</span>
                <strong>{account.AccessLevel}</strong>
              </div>

              <div className="account-details-item">
                <span>{currentText.accountStatus}</span>

                <strong>
                  <span
                    className={`account-details-status ${
                      account.IsActive
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    <span className="account-details-status-dot" />

                    {account.IsActive
                      ? currentText.active
                      : currentText.inactive}
                  </span>
                </strong>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AccountDetails;