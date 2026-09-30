import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "../../i18n";
import "./AssetCreate.css";

function AssetCreate() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [buildingId, setBuildingId] = useState(null);

  const [formData, setFormData] = useState({
    assetName: "",
    assetType: "",
    apartmentId: "",
    description: "",
    status: "Operational",
  });

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
      assets: "Assets",

      addAsset: "Add Asset",
      addAssetDescription: "Add a new building asset.",

      assetName: "Asset Name",
      assetNamePlaceholder: "Enter asset name",

      assetType: "Asset Type",
      assetTypePlaceholder: "Enter asset type",

      location: "Location",
      buildingWide: "Building-wide",
      apartmentId: "Apartment ID",
      apartmentIdPlaceholder: "Enter apartment ID",

      description: "Description",
      descriptionPlaceholder: "Enter asset description",

      status: "Status",

      operational: "Operational",
      underMaintenance: "Under Maintenance",
      outOfService: "Out of Service",
      retired: "Retired",

      cancel: "Cancel",
      saveAsset: "Save Asset",
      saving: "Saving...",

      requiredFields: "Please fill in all required fields.",
      failedToLoadBuilding: "Failed to load building information.",
      failedToCreate: "Failed to create asset.",

      settings: "Settings",
      logout: "Log out",
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
      assets: "الأصول",

      addAsset: "إضافة أصل",
      addAssetDescription: "إضافة أصل جديد للمبنى.",

      assetName: "اسم الأصل",
      assetNamePlaceholder: "أدخل اسم الأصل",

      assetType: "نوع الأصل",
      assetTypePlaceholder: "أدخل نوع الأصل",

      location: "الموقع",
      buildingWide: "على مستوى المبنى",
      apartmentId: "رقم الشقة",
      apartmentIdPlaceholder: "أدخل رقم الشقة",

      description: "الوصف",
      descriptionPlaceholder: "أدخل وصف الأصل",

      status: "الحالة",

      operational: "تشغيلي",
      underMaintenance: "قيد الصيانة",
      outOfService: "خارج الخدمة",
      retired: "متقاعد",

      cancel: "إلغاء",
      saveAsset: "حفظ الأصل",
      saving: "جارٍ الحفظ...",

      requiredFields: "يرجى إدخال جميع الحقول المطلوبة.",
      failedToLoadBuilding: "تعذر تحميل بيانات المبنى.",
      failedToCreate: "تعذر إنشاء الأصل.",

      settings: "الإعدادات",
      logout: "تسجيل الخروج",
      english: "EN",
      arabic: "عربي",
    },
  };

  const currentText = text[language];

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    const fetchBuilding = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://backend-production-b205a.up.railway.app/building", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(
            data.message || currentText.failedToLoadBuilding
          );
        }

        setBuildingId(data.BuildingID);
      } catch (error) {
        console.error("Failed to load building:", error);
        setError(error.message || currentText.failedToLoadBuilding);
      }
    };

    fetchBuilding();
  }, [navigate]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !buildingId ||
      !formData.assetName.trim() ||
      !formData.assetType.trim() ||
      !formData.status
    ) {
      setError(currentText.requiredFields);
      return;
    }

    try {
      setIsSaving(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://backend-production-b205a.up.railway.app/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          buildingId,
          apartmentId: formData.apartmentId
            ? Number(formData.apartmentId)
            : null,
          assetType: formData.assetType.trim(),
          assetName: formData.assetName.trim(),
          description: formData.description.trim() || null,
          status: formData.status,
        }),
      });

      const data = await response.json();

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || currentText.failedToCreate);
      }

      navigate("/assets");
    } catch (error) {
      console.error("Failed to create asset:", error);
      setError(error.message || currentText.failedToCreate);
    } finally {
      setIsSaving(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <div className="asset-create-page" dir={isArabic ? "rtl" : "ltr"}>
      <header className="asset-create-header" dir="ltr">
        <div className="asset-create-header-left">
          <button
            type="button"
            className="asset-create-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>

          <div className="asset-create-header-brand">
            <span className="asset-create-header-title">SBM</span>
            <span className="asset-create-header-subtitle">
              {isArabic
                ? "إدارة المباني الذكية"
                : "Smart Block Management"}
            </span>
          </div>
        </div>

       <div className="asset-create-header-actions" dir="ltr">
          <div className="asset-create-language-switcher" dir="ltr">
            <button
              type="button"
              className={language === "en" ? "active" : ""}
              onClick={() => {
                localStorage.setItem("language", "en");
                setLanguage("en");
              }}
            >
              {currentText.english}
            </button>

            <button
              type="button"
              className={language === "ar" ? "active" : ""}
              onClick={() => {
                localStorage.setItem("language", "ar");
                setLanguage("ar");
              }}
            >
              {currentText.arabic}
            </button>
          </div>

          <span className="material-symbols-outlined asset-create-header-icon">
            notifications
          </span>

          <button
            type="button"
            className="asset-create-header-settings"
            aria-label={currentText.settings}
          >
            <span className="material-symbols-outlined">settings</span>
          </button>

          <button
            type="button"
            className="asset-create-logout-button"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined">logout</span>
            {currentText.logout}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="asset-create-mobile-menu">
            <button type="button" onClick={() => navigate("/dashboard")}>
              {currentText.dashboard}
            </button>

            <button type="button" onClick={() => navigate("/building")}>
              {currentText.building}
            </button>

            <button type="button" onClick={() => navigate("/maintenance")}>
              {currentText.maintenance}
            </button>

            <button type="button" onClick={() => navigate("/finance")}>
              {currentText.finance}
            </button>

            <button type="button" onClick={() => navigate("/residents")}>
              {currentText.residents}
            </button>

            <button type="button" onClick={() => navigate("/communication")}>
              {currentText.communication}
            </button>

            <button type="button" onClick={() => navigate("/assets")}>
              {currentText.assets}
            </button>
          </nav>
        )}
      </header>

      <div className="asset-create-layout">
        <aside className="asset-create-sidebar">
          <div className="asset-create-sidebar-heading">
            <h2>{currentText.superAdmin}</h2>
            <p>{currentText.managementPortal}</p>
          </div>

          <nav className="asset-create-sidebar-nav">
  <button
    type="button"
    className="asset-create-sidebar-link"
    onClick={() => navigate("/dashboard")}
  >
    <span className="material-symbols-outlined">
      dashboard
    </span>
    <span>{currentText.dashboard}</span>
  </button>

  <button
    type="button"
    className="asset-create-sidebar-link"
    onClick={() => navigate("/building-information")}
  >
    <span className="material-symbols-outlined">
      domain
    </span>
    <span>{currentText.building}</span>
  </button>

  <button
    type="button"
    className="asset-create-sidebar-link"
    onClick={() => navigate("/residents")}
  >
    <span className="material-symbols-outlined">
      group
    </span>
    <span>{currentText.residents}</span>
  </button>

  <button
    type="button"
    className="asset-create-sidebar-link active"
    onClick={() => navigate("/assets")}
  >
    <span className="material-symbols-outlined">
      precision_manufacturing
    </span>
    <span>{currentText.assets}</span>
  </button>

  <button
    type="button"
    className="asset-create-sidebar-link"
    onClick={() => navigate("/maintenance")}
  >
    <span className="material-symbols-outlined">
      engineering
    </span>
    <span>{currentText.maintenance}</span>
  </button>

  <button
    type="button"
    className="asset-create-sidebar-link"
    onClick={() => navigate("/finance")}
  >
    <span className="material-symbols-outlined">
      payments
    </span>
    <span>{currentText.finance}</span>
  </button>

  <button
    type="button"
    className="asset-create-sidebar-link"
    onClick={() => navigate("/communication")}
  >
    <span className="material-symbols-outlined">
      forum
    </span>
    <span>{currentText.communication}</span>
  </button>
</nav>

          <div className="asset-create-sidebar-footer">
            SBM Management Portal
          </div>
        </aside>

        <main
  className="asset-create-content"
  dir={isArabic ? "rtl" : "ltr"}
>
          <div className="asset-create-page-heading">
            <div>
              <h1>{currentText.addAsset}</h1>
              <p>{currentText.addAssetDescription}</p>
            </div>
          </div>

          <form
            className="asset-create-form-card"
            onSubmit={handleSubmit}
          >
            {error && (
              <div className="asset-create-error">
                {error}
              </div>
            )}

            <div className="asset-create-form-grid">
              <label>
                <span>
                  {currentText.assetName}
                  <span className="required-mark">*</span>
                </span>

                <input
                  type="text"
                  name="assetName"
                  value={formData.assetName}
                  onChange={handleChange}
                  placeholder={currentText.assetNamePlaceholder}
                />
              </label>

              <label>
                <span>
                  {currentText.assetType}
                  <span className="required-mark">*</span>
                </span>

                <input
                  type="text"
                  name="assetType"
                  value={formData.assetType}
                  onChange={handleChange}
                  placeholder={currentText.assetTypePlaceholder}
                />
              </label>

              <label>
                <span>{currentText.location}</span>

                <select
                  name="apartmentId"
                  value={formData.apartmentId}
                  onChange={handleChange}
                >
                  <option value="">{currentText.buildingWide}</option>
                </select>

                <small>
                  {currentText.apartmentId}
                </small>

                <input
                  type="number"
                  name="apartmentId"
                  value={formData.apartmentId}
                  onChange={handleChange}
                  placeholder={currentText.apartmentIdPlaceholder}
                  min="1"
                />
              </label>

              <label>
                <span>
                  {currentText.status}
                  <span className="required-mark">*</span>
                </span>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Operational">
                    {currentText.operational}
                  </option>

                  <option value="Under Maintenance">
                    {currentText.underMaintenance}
                  </option>

                  <option value="Out of Service">
                    {currentText.outOfService}
                  </option>

                  <option value="Retired">
                    {currentText.retired}
                  </option>
                </select>
              </label>

              <label className="asset-create-description-field">
                <span>{currentText.description}</span>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={currentText.descriptionPlaceholder}
                  rows="5"
                />
              </label>
            </div>

            <div className="asset-create-form-actions">
              <button
                type="button"
                className="asset-create-cancel-button"
                onClick={() => navigate("/assets")}
              >
                {currentText.cancel}
              </button>

              <button
                type="submit"
                className="asset-create-save-button"
                disabled={isSaving}
              >
                {isSaving
                  ? currentText.saving
                  : currentText.saveAsset}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default AssetCreate;