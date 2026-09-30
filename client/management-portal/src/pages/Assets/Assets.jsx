import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "../../i18n";
import "./Assets.css";

function Assets() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [assetsData, setAssetsData] = useState([]);

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
assetsDescription:
  "Manage building equipment and physical assets.",
addAsset: "Add Asset",

searchPlaceholder: "Search assets...",
allAssetTypes: "Asset Type: All",
allStatuses: "Status: All",
allLocations: "Location: All",

assetName: "Asset Name",
assetType: "Asset Type",
location: "Location",
status: "Status",
actions: "Actions",

operational: "Operational",
underMaintenance: "Under Maintenance",
outOfService: "Out of Service",
retired: "Retired",

noAssets: "No assets found.",
showing: "Showing",
of: "of",
entries: "entries",

      noAssets: "No assets found.",

      english: "EN",
      arabic: "عربي",

      portalFooter: "SBM Management Portal",
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
assetsDescription:
  "إدارة معدات وأصول المبنى.",
addAsset: "إضافة أصل",

searchPlaceholder: "البحث عن الأصول...",
allAssetTypes: "نوع الأصل: الكل",
allStatuses: "الحالة: الكل",
allLocations: "الموقع: الكل",

assetName: "اسم الأصل",
assetType: "نوع الأصل",
location: "الموقع",
status: "الحالة",
actions: "الإجراءات",

operational: "يعمل",
underMaintenance: "تحت الصيانة",
outOfService: "خارج الخدمة",
retired: "متقاعد",

noAssets: "لم يتم العثور على أصول.",
showing: "عرض",
of: "من",
entries: "أصول",

      noAssets: "لم يتم العثور على أصول.",

      english: "EN",
      arabic: "عربي",

      portalFooter: "بوابة إدارة إس بي إم",
    },
  };

  const currentText = text[language];

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [language, isArabic]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          "http://localhost:5000/assets",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (
            response.status === 401 ||
            response.status === 403
          ) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }

          throw new Error(
            data.message || "Failed to load assets."
          );
        }

        setAssetsData(
          data.map((asset) => ({
            id: asset.AssetID,
            name: asset.AssetName,
            type: asset.AssetType,
            location:
              asset.ApartmentID === null
                ? currentText.buildingWide
                : `Apartment ${asset.ApartmentID}`,
            status: asset.Status,
          }))
        );
      } catch (error) {
        console.error("Failed to load assets:", error);
      }
    };

    fetchAssets();
  }, [navigate, language]);

  function handleLanguageChange(newLanguage) {
    localStorage.setItem("language", newLanguage);
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function getStatusClass(status) {
    switch (status) {
      case "Operational":
        return "assets-status assets-status-operational";

      case "Under Maintenance":
        return "assets-status assets-status-maintenance";

      case "Out of Service":
        return "assets-status assets-status-out";

      case "Retired":
        return "assets-status assets-status-retired";

      default:
        return "assets-status";
    }
  }

  function getStatusText(status) {
    switch (status) {
      case "Operational":
        return currentText.operational;

      case "Under Maintenance":
        return currentText.underMaintenance;

      case "Out of Service":
        return currentText.outOfService;

      case "Retired":
        return currentText.retired;

      default:
        return status;
    }
  }

  const filteredAssets = assetsData.filter((asset) => {
    const searchValue = searchTerm.toLowerCase();

    const matchesSearch =
      asset.name.toLowerCase().includes(searchValue) ||
      asset.type.toLowerCase().includes(searchValue) ||
      asset.location.toLowerCase().includes(searchValue);

    const matchesStatus =
      !statusFilter || asset.status === statusFilter;

    const matchesType =
      !typeFilter || asset.type === typeFilter;

    const matchesLocation =
      !locationFilter ||
      asset.location === locationFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesType &&
      matchesLocation
    );
  });

  return (
    <div
      className={`assets-page ${
        isArabic ? "assets-rtl" : ""
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* ==================== HEADER ==================== */}

      <header className="assets-header">
        <div className="assets-header-left">
          <button
            type="button"
            className="assets-menu-button"
            onClick={() =>
              setIsMenuOpen((previous) => !previous)
            }
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>

          <div className="assets-header-brand">
            <span className="assets-header-title">
              SBM
            </span>

            <span className="assets-header-subtitle">
              {isArabic
                ? "إدارة المباني الذكية"
                : "Smart Block Management"}
            </span>
          </div>
        </div>

        <div className="assets-header-actions">
          <div
            className="assets-language-switcher"
            dir="ltr"
          >
            <button
              type="button"
              className={
                language === "en" ? "active" : ""
              }
              onClick={() =>
                handleLanguageChange("en")
              }
            >
              {currentText.english}
            </button>

            <button
              type="button"
              className={
                language === "ar" ? "active" : ""
              }
              onClick={() =>
                handleLanguageChange("ar")
              }
            >
              {currentText.arabic}
            </button>
          </div>

          <span className="material-symbols-outlined assets-header-icon">
            notifications
          </span>

          <button
            type="button"
            className="assets-header-settings"
            aria-label={currentText.settings}
          >
            <span className="material-symbols-outlined">
              settings
            </span>
          </button>

          <button
            type="button"
            className="assets-logout-button"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined">
              logout
            </span>

            {currentText.logout}
          </button>
        </div>

        {/* Mobile menu */}

        {isMenuOpen && (
          <nav className="assets-mobile-menu">
            <button
              type="button"
              className="assets-sidebar-link"
              onClick={() => {
                setIsMenuOpen(false);
                navigate("/dashboard");
              }}
            >
              <span className="material-symbols-outlined">
                dashboard
              </span>

              {currentText.dashboard}
            </button>

            <button
              type="button"
              className="assets-sidebar-link"
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
              className="assets-sidebar-link"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              <span className="material-symbols-outlined">
                engineering
              </span>

              {currentText.maintenance}
            </button>

            <button
              type="button"
              className="assets-sidebar-link"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              <span className="material-symbols-outlined">
                payments
              </span>

              {currentText.finance}
            </button>

            <button
              type="button"
              className="assets-sidebar-link"
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

            <button
              type="button"
              className="assets-sidebar-link"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              <span className="material-symbols-outlined">
                chat
              </span>

              {currentText.communication}
            </button>

            <button
              type="button"
              className="assets-sidebar-link active"
              onClick={() =>
                setIsMenuOpen(false)
              }
            >
              <span className="material-symbols-outlined">
                precision_manufacturing
              </span>

              {currentText.assets}
            </button>
          </nav>
        )}
      </header>

      {/* ==================== MAIN LAYOUT ==================== */}

      <div className="assets-layout">
        {/* ==================== SIDEBAR ==================== */}

       <aside className="assets-sidebar">
  <div className="assets-sidebar-heading">
    <h2>Super Admin</h2>
    <p>Management Portal</p>
  </div>

  <nav className="assets-sidebar-nav">
    <button
      type="button"
      className="assets-sidebar-link"
      onClick={() => navigate("/dashboard")}
    >
      <span className="material-symbols-outlined">
        dashboard
      </span>
      <span>{currentText.dashboard}</span>
    </button>

    <button
      type="button"
      className="assets-sidebar-link"
      onClick={() => navigate("/building-information")}
    >
      <span className="material-symbols-outlined">
        apartment
      </span>
      <span>{currentText.building}</span>
    </button>

    <button type="button" className="assets-sidebar-link">
      <span className="material-symbols-outlined">
        engineering
      </span>
      <span>{currentText.maintenance}</span>
    </button>

    <button type="button" className="assets-sidebar-link">
      <span className="material-symbols-outlined">
        payments
      </span>
      <span>{currentText.finance}</span>
    </button>

    <button
      type="button"
      className="assets-sidebar-link"
      onClick={() => navigate("/residents")}
    >
      <span className="material-symbols-outlined">
        groups
      </span>
      <span>{currentText.residents}</span>
    </button>

    <button type="button" className="assets-sidebar-link">
      <span className="material-symbols-outlined">
        chat
      </span>
      <span>{currentText.communication}</span>
    </button>

    <button
      type="button"
      className="assets-sidebar-link active"
    >
      <span className="material-symbols-outlined">
        precision_manufacturing
      </span>
      <span>{currentText.assets}</span>
    </button>
  </nav>

  <div className="assets-sidebar-footer">
    SBM Management Portal
  </div>
</aside>

        {/* ==================== CONTENT ==================== */}

        <main className="assets-content">
  <div className="assets-content-top">
    <div>
      <h1 className="assets-page-title">
        {currentText.assets}
      </h1>

      <p className="assets-page-description">
        {currentText.assetsDescription}
      </p>
    </div>

    <button
      type="button"
      className="assets-add-button"
      onClick={() => navigate("/asset/create")}
    >
      <span className="material-symbols-outlined">
        add
      </span>

      {currentText.addAsset}
    </button>
  </div>

  <section className="assets-table-card">
    <div className="assets-filters">
      <div className="assets-search">
        <span className="material-symbols-outlined">
          search
        </span>

        <input
          type="text"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          placeholder={currentText.searchPlaceholder}
        />
      </div>

      <select
        value={typeFilter}
        onChange={(event) =>
          setTypeFilter(event.target.value)
        }
      >
        <option value="all">
          {currentText.allAssetTypes}
        </option>

        {[...new Set(assetsData.map((asset) => asset.type))].map(
          (type) => (
            <option key={type} value={type}>
              {type}
            </option>
          )
        )}
      </select>

      <select
        value={statusFilter}
        onChange={(event) =>
          setStatusFilter(event.target.value)
        }
      >
        <option value="all">
          {currentText.allStatuses}
        </option>

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

      <select
        value={locationFilter}
        onChange={(event) =>
          setLocationFilter(event.target.value)
        }
      >
        <option value="all">
          {currentText.allLocations}
        </option>

        {[...new Set(assetsData.map((asset) => asset.location))].map(
          (location) => (
            <option key={location} value={location}>
              {location}
            </option>
          )
        )}
      </select>
    </div>

    <div className="assets-table-wrapper">
      <table className="assets-table">
        <thead>
          <tr>
            <th>{currentText.assetName}</th>
            <th>{currentText.assetType}</th>
            <th>{currentText.location}</th>
            <th>{currentText.status}</th>
            <th>{currentText.actions}</th>
          </tr>
        </thead>

        <tbody>
          {filteredAssets.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                className="assets-empty"
              >
                {currentText.noAssets}
              </td>
            </tr>
          ) : (
            filteredAssets.map((asset) => (
              <tr key={asset.id}>
                <td className="assets-name">
                  <div className="assets-name-cell">
                    <span className="assets-name-icon">
                      <span className="material-symbols-outlined">
                        precision_manufacturing
                      </span>
                    </span>

                    <span>{asset.name}</span>
                  </div>
                </td>

                <td>{asset.type}</td>

                <td>{asset.location}</td>

                <td>
                  <span
                    className={`assets-status ${
                      asset.status === "Operational"
                        ? "operational"
                        : asset.status === "Under Maintenance"
                        ? "maintenance"
                        : asset.status === "Out of Service"
                        ? "out-of-service"
                        : "retired"
                    }`}
                  >
                    <span className="assets-status-dot" />

                    {asset.status}
                  </span>
                </td>

                <td>
                  <div className="assets-actions">
                    <button
                      type="button"
                      aria-label="View asset"
                      title="View"
                      onClick={() =>
                        navigate(`/asset/${asset.id}`)
                      }
                    >
                      <span className="material-symbols-outlined">
                        visibility
                      </span>
                    </button>

                    <button
                      type="button"
                      aria-label="Edit asset"
                      title="Edit"
                      onClick={() =>
                        navigate(`/asset/${asset.id}/edit`)
                      }
                    >
                      <span className="material-symbols-outlined">
                        edit
                      </span>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    <div className="assets-table-footer">
      <span>
        {currentText.showing}{" "}
        {filteredAssets.length}{" "}
        {currentText.of}{" "}
        {assetsData.length}{" "}
        {currentText.entries}
      </span>
    </div>
  </section>
</main>
      </div>
    </div>
  );
}

export default Assets;