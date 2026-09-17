import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "../../i18n";
import "./BuildingInformation.css";

function BuildingInformation() {
  const navigate = useNavigate();

  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

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

      buildingInformation: "Building Information",
      buildingDescription:
        "View and manage the master data of your building.",
      editBuilding: "Edit Building",

      numberOfFloors: "Number of Floors",
      registeredFloors: "Registered floors",
      numberOfApartments: "Number of Apartments",
      registeredApartments: "Registered apartments",
      maintenanceFee: "Maintenance Fee",
      monthlyBuildingFee: "Monthly building fee",

      buildingMasterData: "Building Master Data",
      generalInformation: "General information and contact details",
      active: "Active",

      buildingName: "Building Name",
      city: "City",
      address: "Address",
      contactPhone: "Contact Phone",
      email: "Email",
      notProvided: "Not provided",

      loading: "Loading building information...",
      loadingDescription:
        "Please wait while the building data is loaded.",
      loadingError: "Unable to load building information",

      portalFooter: "SBM Management Portal",
      english: "EN",
      arabic: "عربي"
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

      buildingInformation: "معلومات المبنى",
      buildingDescription:
        "عرض وإدارة البيانات الأساسية للمبنى.",
      editBuilding: "تعديل المبنى",

      numberOfFloors: "عدد الطوابق",
      registeredFloors: "الطوابق المسجلة",
      numberOfApartments: "عدد الشقق",
      registeredApartments: "الشقق المسجلة",
      maintenanceFee: "رسوم الصيانة",
      monthlyBuildingFee: "رسوم المبنى الشهرية",

      buildingMasterData: "البيانات الأساسية للمبنى",
      generalInformation: "المعلومات العامة وبيانات التواصل",
      active: "نشط",

      buildingName: "اسم المبنى",
      city: "المدينة",
      address: "العنوان",
      contactPhone: "رقم الهاتف",
      email: "البريد الإلكتروني",
      notProvided: "غير متوفر",

      loading: "جاري تحميل معلومات المبنى...",
      loadingDescription:
        "يرجى الانتظار حتى يتم تحميل بيانات المبنى.",
      loadingError: "تعذر تحميل معلومات المبنى",

      portalFooter: "بوابة إدارة إس بي إم",
      english: "EN",
      arabic: "عربي"
    }
  };

  const currentText = text[language];

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [language, isArabic]);

  useEffect(() => {
    async function fetchBuildingInformation() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/building", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }

          throw new Error(
            data.message || "Failed to load building information."
          );
        }

        setBuilding(data);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBuildingInformation();
  }, [navigate]);

  function handleLanguageChange(newLanguage) {
    localStorage.setItem("language", newLanguage);
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  if (loading) {
    return (
      <div className="building-state">
        <div className="building-state-card">
          <h1>{currentText.loading}</h1>
          <p>{currentText.loadingDescription}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="building-state">
        <div className="building-state-card">
          <h1>{currentText.loadingError}</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`building-page ${isArabic ? "building-rtl" : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <header className="building-header">
        <div className="building-header-brand">
          <span className="building-header-title">SBM</span>

          <span className="building-header-subtitle">
            {isArabic
              ? "إدارة المباني الذكية"
              : "Smart Block Management"}
          </span>
        </div>

        <div className="building-header-actions">
          <div className="building-language-switcher" dir="ltr">
            <button
              type="button"
              className={language === "en" ? "active" : ""}
              onClick={() => handleLanguageChange("en")}
            >
              {currentText.english}
            </button>

            <button
              type="button"
              className={language === "ar" ? "active" : ""}
              onClick={() => handleLanguageChange("ar")}
            >
              {currentText.arabic}
            </button>
          </div>

          <span className="material-symbols-outlined building-header-icon">
            notifications
          </span>

          <button
            type="button"
            className="building-logout-button"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined">
              logout
            </span>

            {currentText.logout}
          </button>
        </div>
      </header>

      <div className="building-layout">
        <aside className="building-sidebar">
          <div className="building-sidebar-heading">
            <h2>{currentText.superAdmin}</h2>
            <p>{currentText.managementPortal}</p>
          </div>

          <nav className="building-sidebar-nav">
            <button
              type="button"
              className="building-sidebar-link"
              onClick={() => navigate("/building-information")}
            >
              <span className="material-symbols-outlined">
                dashboard
              </span>

              {currentText.dashboard}
            </button>

            <button
              type="button"
              className="building-sidebar-link active"
              onClick={() => navigate("/building-information")}
            >
              <span className="material-symbols-outlined">
                apartment
              </span>

              {currentText.building}
            </button>

            <button type="button" className="building-sidebar-link">
              <span className="material-symbols-outlined">
                engineering
              </span>

              {currentText.maintenance}
            </button>

            <button type="button" className="building-sidebar-link">
              <span className="material-symbols-outlined">
                payments
              </span>

              {currentText.finance}
            </button>

            <button type="button" className="building-sidebar-link">
              <span className="material-symbols-outlined">
                groups
              </span>

              {currentText.residents}
            </button>

            <button type="button" className="building-sidebar-link">
              <span className="material-symbols-outlined">
                chat
              </span>

              {currentText.communication}
            </button>

            <button type="button" className="building-sidebar-link">
              <span className="material-symbols-outlined">
                settings
              </span>

              {currentText.settings}
            </button>
          </nav>

          <div className="building-sidebar-footer">
            {currentText.portalFooter}
          </div>
        </aside>

        <main className="building-content">
          <div className="building-content-top">
            <div>
              <h1 className="building-page-title">
                {currentText.buildingInformation}
              </h1>

              <p className="building-page-description">
                {currentText.buildingDescription}
              </p>
            </div>

            <button
  type="button"
  className="building-edit-button"
  onClick={() => navigate("/building-edit")}
>
              <span className="material-symbols-outlined">
                edit
              </span>

              {currentText.editBuilding}
            </button>
          </div>

          <section className="building-summary-grid">
            <article className="building-summary-card">
              <span className="building-summary-label">
                {currentText.numberOfFloors}
              </span>

              <div className="building-summary-value">
                {building.NumberOfFloors}
              </div>

              <div className="building-summary-caption">
                {currentText.registeredFloors}
              </div>
            </article>

            <article className="building-summary-card">
              <span className="building-summary-label">
                {currentText.numberOfApartments}
              </span>

              <div className="building-summary-value">
                {building.NumberOfApartments}
              </div>

              <div className="building-summary-caption">
                {currentText.registeredApartments}
              </div>
            </article>

            <article className="building-summary-card">
              <span className="building-summary-label">
                {currentText.maintenanceFee}
              </span>

              <div className="building-summary-value">
                {building.MaintenanceFee ?? "—"}
              </div>

              <div className="building-summary-caption">
                {currentText.monthlyBuildingFee}
              </div>
            </article>
          </section>

          <section className="building-information-card">
            <div className="building-card-header">
              <div className="building-card-heading">
                <div className="building-card-icon">
                  <span className="material-symbols-outlined">
                    apartment
                  </span>
                </div>

                <div>
                  <h2 className="building-card-title">
                    {currentText.buildingMasterData}
                  </h2>

                  <p className="building-card-subtitle">
                    {currentText.generalInformation}
                  </p>
                </div>
              </div>

              <span className="building-status">
                {currentText.active}
              </span>
            </div>

            <div className="building-information-grid">
              <div className="building-information-item">
                <span className="building-information-label">
                  {currentText.buildingName}
                </span>

                <span className="building-information-value">
                  {building.Name}
                </span>
              </div>

              <div className="building-information-item">
                <span className="building-information-label">
                  {currentText.city}
                </span>

                <span className="building-information-value">
                  {building.City}
                </span>
              </div>

              <div className="building-information-item">
                <span className="building-information-label">
                  {currentText.address}
                </span>

                <span className="building-information-value">
                  {building.Address}
                </span>
              </div>

              <div className="building-information-item">
                <span className="building-information-label">
                  {currentText.contactPhone}
                </span>

                <span
                  className={`building-information-value ${
                    building.ContactPhone ? "" : "muted"
                  }`}
                >
                  {building.ContactPhone || currentText.notProvided}
                </span>
              </div>

              <div className="building-information-item">
                <span className="building-information-label">
                  {currentText.email}
                </span>

                <span
                  className={`building-information-value ${
                    building.Email ? "" : "muted"
                  }`}
                >
                  {building.Email || currentText.notProvided}
                </span>
              </div>

              <div className="building-information-item">
                <span className="building-information-label">
                  {currentText.maintenanceFee}
                </span>

                <span
                  className={`building-information-value ${
                    building.MaintenanceFee == null ? "muted" : ""
                  }`}
                >
                  {building.MaintenanceFee ?? currentText.notProvided}
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default BuildingInformation;