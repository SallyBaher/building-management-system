import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "../../i18n";
import "./BuildingEdit.css";

function BuildingEdit() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    numberOfFloors: "",
    numberOfApartments: "",
    maintenanceFee: "",
    contactPhone: "",
    email: "",
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

      home: "Home",
      buildingMasterData: "Building Master-Data",

      buildingName: "Building Name",
      buildingAddress: "Building Address",
      city: "City",
      numberOfFloors: "Number of Floors",
      numberOfApartments: "Number of Apartments",
      yearlyMaintenanceFee: "Yearly Maintenance Fee",
      contactPhone: "Contact Phone",
      email: "Email",

      buildingNamePlaceholder: "Enter building name",
      buildingAddressPlaceholder: "Enter building address",
      cityPlaceholder: "Enter city",
      floorsPlaceholder: "Enter number of floors",
      apartmentsPlaceholder: "Enter number of apartments",
      maintenanceFeePlaceholder: "Enter yearly maintenance fee",
      contactPhonePlaceholder: "Enter contact phone",
      emailPlaceholder: "Enter email address",

      cancel: "Cancel",
      saveChanges: "Save Changes",

      english: "EN",
      arabic: "عربي",
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

      home: "الرئيسية",
      buildingMasterData: "البيانات الأساسية للمبنى",

      buildingName: "اسم المبنى",
      buildingAddress: "عنوان المبنى",
      city: "المدينة",
      numberOfFloors: "عدد الطوابق",
      numberOfApartments: "عدد الشقق",
      yearlyMaintenanceFee: "رسوم الصيانة السنوية",
      contactPhone: "هاتف الاتصال",
      email: "البريد الإلكتروني",

      buildingNamePlaceholder: "أدخل اسم المبنى",
      buildingAddressPlaceholder: "أدخل عنوان المبنى",
      cityPlaceholder: "أدخل المدينة",
      floorsPlaceholder: "أدخل عدد الطوابق",
      apartmentsPlaceholder: "أدخل عدد الشقق",
      maintenanceFeePlaceholder: "أدخل رسوم الصيانة السنوية",
      contactPhonePlaceholder: "أدخل رقم الهاتف",
      emailPlaceholder: "أدخل البريد الإلكتروني",

      cancel: "إلغاء",
      saveChanges: "حفظ التغييرات",

      english: "EN",
      arabic: "عربي",
    },
  };

  const currentText = text[language];

  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/building", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load building information."
          );
        }

       setFormData({
  name: data.Name || "",
  address: data.Address || "",
  city: data.City || "",
  numberOfFloors: data.NumberOfFloors ?? "",
  numberOfApartments: data.NumberOfApartments ?? "",
  maintenanceFee: data.MaintenanceFee ?? "",
  contactPhone: data.ContactPhone || "",
  email: data.Email || "",
});
      } catch (error) {
        console.error("Failed to load building information:", error);
      }
    };

    fetchBuilding();
  }, []);

  function handleLanguageChange(newLanguage) {
    localStorage.setItem("language", newLanguage);
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

 function handleChange(event) {
  const { name, value } = event.target;

  setFormData((previousData) => ({
    ...previousData,
    [name]: value,
  }));
}

async function handleSubmit(event) {
  event.preventDefault();

  try {
    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:5000/building", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.name,
        address: formData.address,
        city: formData.city,
        numberOfFloors: Number(formData.numberOfFloors),
        numberOfApartments: Number(formData.numberOfApartments),
        maintenanceFee: Number(formData.maintenanceFee),
        contactPhone: formData.contactPhone,
        email: formData.email,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update building information."
      );
    }

    navigate("/building-information");
  } catch (error) {
    console.error("Failed to update building:", error);
    alert(error.message);
  }
}

  return (
    <div
      className={`building-edit-page ${
        isArabic ? "building-edit-rtl" : ""
      }`}
      dir="ltr"
    >
      <header className="building-edit-header">
        <div className="building-edit-header-left">
          <button
            type="button"
            className="building-edit-menu-button"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>

          <div className="building-edit-header-brand">
            <span className="building-edit-header-title">
              SBM
            </span>

            <span className="building-edit-header-subtitle">
              {isArabic
                ? "إدارة المباني الذكية"
                : "Smart Block Management"}
            </span>
          </div>
        </div>

        <div className="building-edit-header-actions">
          <div
            className="building-edit-language-switcher"
            dir="ltr"
          >
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

          <span className="material-symbols-outlined building-edit-header-icon">
            notifications
          </span>

          <button
            type="button"
            className="building-edit-header-settings"
            aria-label={currentText.settings}
          >
            <span className="material-symbols-outlined">
              settings
            </span>
          </button>

          <button
            type="button"
            className="building-edit-logout-button"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined">
              logout
            </span>

            {currentText.logout}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="building-edit-mobile-menu">
            <button
              type="button"
              className="building-edit-sidebar-link"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/building-information");
              }}
            >
              <span className="material-symbols-outlined">
                dashboard
              </span>

              {currentText.dashboard}
            </button>

            <button
              type="button"
              className="building-edit-sidebar-link active"
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
              className="building-edit-sidebar-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="material-symbols-outlined">
                engineering
              </span>

              {currentText.maintenance}
            </button>

            <button
              type="button"
              className="building-edit-sidebar-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="material-symbols-outlined">
                payments
              </span>

              {currentText.finance}
            </button>

            <button
              type="button"
              className="building-edit-sidebar-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="material-symbols-outlined">
                groups
              </span>

              {currentText.residents}
            </button>

            <button
              type="button"
              className="building-edit-sidebar-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="material-symbols-outlined">
                chat
              </span>

              {currentText.communication}
            </button>
          </nav>
        )}
      </header>

      <div className="building-edit-layout">
        <aside className="building-edit-sidebar">
          <div className="building-edit-sidebar-heading">
            <h2>{currentText.superAdmin}</h2>
            <p>{currentText.managementPortal}</p>
          </div>

          <nav className="building-edit-sidebar-nav">
            <button
              type="button"
              className="building-edit-sidebar-link"
              onClick={() => navigate("/building-information")}
            >
              <span className="material-symbols-outlined">
                dashboard
              </span>

              {currentText.dashboard}
            </button>

            <button
              type="button"
              className="building-edit-sidebar-link active"
              onClick={() => navigate("/building-information")}
            >
              <span className="material-symbols-outlined">
                apartment
              </span>

              {currentText.building}
            </button>

            <button
              type="button"
              className="building-edit-sidebar-link"
            >
              <span className="material-symbols-outlined">
                engineering
              </span>

              {currentText.maintenance}
            </button>

            <button
              type="button"
              className="building-edit-sidebar-link"
            >
              <span className="material-symbols-outlined">
                payments
              </span>

              {currentText.finance}
            </button>

            <button
              type="button"
              className="building-edit-sidebar-link"
            >
              <span className="material-symbols-outlined">
                groups
              </span>

              {currentText.residents}
            </button>

            <button
  type="button"
  className="building-edit-sidebar-link"
  onClick={() => {
    setIsMenuOpen(false);
    navigate("/assets");
  }}
>
  <span className="material-symbols-outlined">
    precision_manufacturing
  </span>

  {currentText.assets}
</button>

            <button
              type="button"
              className="building-edit-sidebar-link"
            >
              <span className="material-symbols-outlined">
                chat
              </span>

              {currentText.communication}
            </button>
          </nav>

          <div className="building-edit-sidebar-footer">
            SBM Management Portal
          </div>
        </aside>

        <main className="building-edit-content">

          <h1>{currentText.buildingMasterData}</h1>

          <form
  className="building-edit-form"
  onSubmit={handleSubmit}
>
            <div className="building-edit-grid">
              <label>
                <span className="building-edit-label">
                  {currentText.buildingName}
                  <span>*</span>
                </span>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={currentText.buildingNamePlaceholder}
                />
              </label>

              <label>
                <span className="building-edit-label">
                  {currentText.buildingAddress}
                  <span>*</span>
                </span>

                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={
                    currentText.buildingAddressPlaceholder
                  }
                />
              </label>

              <label>
                <span className="building-edit-label">
                  {currentText.city}
                  <span>*</span>
                </span>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder={currentText.cityPlaceholder}
                />
              </label>

              <label>
                <span className="building-edit-label">
                  {currentText.numberOfFloors}
                  <span>*</span>
                </span>

                <input
                  type="number"
                  name="numberOfFloors"
                  min="0"
                  value={formData.numberOfFloors}
                  onChange={handleChange}
                  placeholder={currentText.floorsPlaceholder}
                />
              </label>

              <label>
                <span className="building-edit-label">
                  {currentText.numberOfApartments}
                  <span>*</span>
                </span>

                <input
                  type="number"
                  name="numberOfApartments"
                  min="0"
                  value={formData.numberOfApartments}
                  onChange={handleChange}
                  placeholder={
                    currentText.apartmentsPlaceholder
                  }
                />
              </label>

              <label>
                <span className="building-edit-label">
                  {currentText.yearlyMaintenanceFee}
                  <span>*</span>
                </span>

                <input
                  type="number"
                  name="maintenanceFee"
                  min="0"
                  step="0.01"
                  value={formData.maintenanceFee}
                  onChange={handleChange}
                  placeholder={
                    currentText.maintenanceFeePlaceholder
                  }
                />
              </label>

              <label>
                <span className="building-edit-label">
                  {currentText.contactPhone}
                </span>

                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder={
                    currentText.contactPhonePlaceholder
                  }
                />
              </label>

              <label>
                <span className="building-edit-label">
                  {currentText.email}
                </span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={currentText.emailPlaceholder}
                />
              </label>
            </div>

            <div className="building-edit-actions">
              <button
                type="button"
                className="building-edit-cancel"
                onClick={() =>
                  navigate("/building-information")
                }
              >
                {currentText.cancel}
              </button>

              <button
                type="submit"
                className="building-edit-save"
              >
                {currentText.saveChanges}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default BuildingEdit;