import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "../../i18n";
import "./Residents.css";

function Residents() {
  const navigate = useNavigate();

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [accessLevelFilter, setAccessLevelFilter] = useState("all");

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

      people: "Residents",
      peopleDescription:
        "Manage owners, residents and their apartment relationships.",

      addPerson: "Add Person",

      searchPlaceholder: "Search by name, mobile number or ID...",
      accessLevel: "Access Level",
      allAccessLevels: "Access Level: All",
      status: "Status",
      allStatuses: "Status: All",
      active: "Active",
      inactive: "Inactive",

      fullName: "Full Name",
      idNumber: "ID Number",
      mobileNumber: "Mobile Number",
      email: "Email",
      relationship: "Relationship",
      apartments: "Apartments",
      accountStatus: "Account Status",
      actions: "Actions",

      noEmail: "—",
      noApartment: "—",
      noAccounts: "No accounts found.",

      showing: "Showing",
      of: "of",
      entries: "entries",

      loading: "Loading accounts...",
      loadingDescription:
        "Please wait while the account information is loaded.",
      loadingError: "Unable to load accounts",

      portalFooter: "SBM Management Portal",
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

      people: "السكان",
      peopleDescription:
        "إدارة الملاك والسكان وعلاقاتهم بالشقق.",

      addPerson: "إضافة شخص",

      searchPlaceholder: "البحث بالاسم أو رقم الهاتف أو الرقم التعريفي...",
      accessLevel: "مستوى الصلاحية",
      allAccessLevels: "مستوى الصلاحية: الكل",
      status: "الحالة",
      allStatuses: "الحالة: الكل",
      active: "نشط",
      inactive: "غير نشط",

      fullName: "الاسم الكامل",
      idNumber: "الرقم التعريفي",
      mobileNumber: "رقم الهاتف",
      email: "البريد الإلكتروني",
      relationship: "العلاقة",
      apartments: "الشقق",
      accountStatus: "حالة الحساب",
      actions: "الإجراءات",

      noEmail: "—",
      noApartment: "—",
      noAccounts: "لم يتم العثور على حسابات.",

      showing: "عرض",
      of: "من",
      entries: "حسابات",

      loading: "جاري تحميل الحسابات...",
      loadingDescription:
        "يرجى الانتظار حتى يتم تحميل بيانات الحسابات.",
      loadingError: "تعذر تحميل الحسابات",

      portalFooter: "بوابة إدارة إس بي إم",
      english: "EN",
      arabic: "عربي",
    },
  };

  const currentText = text[language];

  useEffect(() => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
  }, [language, isArabic]);

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("https://backend-production-b205a.up.railway.app/accounts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            localStorage.removeItem("token");
            navigate("/login");
            return;
          }

          throw new Error(
            data.message || "Failed to load accounts."
          );
        }

        setAccounts(Array.isArray(data) ? data : []);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, [navigate]);

  function handleLanguageChange(newLanguage) {
    localStorage.setItem("language", newLanguage);
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function getFilteredAccounts() {
    return accounts.filter((account) => {
      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        account.FullName?.toLowerCase().includes(search) ||
        account.IDNumber?.toLowerCase().includes(search) ||
        account.MobileNumber?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && account.IsActive === true) ||
        (statusFilter === "inactive" && account.IsActive === false);

      const matchesAccessLevel =
        accessLevelFilter === "all" ||
        account.AccessLevel === accessLevelFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesAccessLevel
      );
    });
  }

  const filteredAccounts = getFilteredAccounts();

  if (loading) {
    return (
      <div className="residents-state">
        <div className="residents-state-card">
          <h1>{currentText.loading}</h1>
          <p>{currentText.loadingDescription}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="residents-state">
        <div className="residents-state-card">
          <h1>{currentText.loadingError}</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`residents-page ${isArabic ? "residents-rtl" : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <header className="residents-header">
        <div className="residents-header-left">
          <button
            type="button"
            className="residents-menu-button"
            onClick={() => setIsMenuOpen((previous) => !previous)}
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined">
              {isMenuOpen ? "close" : "menu"}
            </span>
          </button>

          <div className="residents-header-brand">
            <span className="residents-header-title">SBM</span>

            <span className="residents-header-subtitle">
              {isArabic
                ? "إدارة المباني الذكية"
                : "Smart Block Management"}
            </span>
          </div>
        </div>

        <div className="residents-header-actions">
          <div className="residents-language-switcher" dir="ltr">
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

          <span className="material-symbols-outlined residents-header-icon">
            notifications
          </span>

          <button
            type="button"
            className="residents-header-settings"
            aria-label={currentText.settings}
          >
            <span className="material-symbols-outlined">
              settings
            </span>
          </button>

          <button
            type="button"
            className="residents-logout-button"
            onClick={handleLogout}
          >
            <span className="material-symbols-outlined">
              logout
            </span>

            {currentText.logout}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="residents-mobile-menu">
            <button
              type="button"
              className="residents-sidebar-link"
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
              className="residents-sidebar-link"
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
              className="residents-sidebar-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="material-symbols-outlined">
                engineering
              </span>

              {currentText.maintenance}
            </button>

            <button
              type="button"
              className="residents-sidebar-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="material-symbols-outlined">
                payments
              </span>

              {currentText.finance}
            </button>

            <button
              type="button"
              className="residents-sidebar-link active"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="material-symbols-outlined">
                groups
              </span>

              {currentText.residents}
            </button>

            <button
              type="button"
              className="residents-sidebar-link"
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

      <div className="residents-layout">
        <aside className="residents-sidebar">
          <div className="residents-sidebar-heading">
            <h2>{currentText.superAdmin}</h2>
            <p>{currentText.managementPortal}</p>
          </div>

          <nav className="residents-sidebar-nav">
            <button
              type="button"
              className="residents-sidebar-link"
              onClick={() => navigate("/building-information")}
            >
              <span className="material-symbols-outlined">
                dashboard
              </span>

              {currentText.dashboard}
            </button>

            <button
              type="button"
              className="residents-sidebar-link"
              onClick={() => navigate("/building-information")}
            >
              <span className="material-symbols-outlined">
                apartment
              </span>

              {currentText.building}
            </button>

            <button
              type="button"
              className="residents-sidebar-link"
            >
              <span className="material-symbols-outlined">
                engineering
              </span>

              {currentText.maintenance}
            </button>

            <button
              type="button"
              className="residents-sidebar-link"
            >
              <span className="material-symbols-outlined">
                payments
              </span>

              {currentText.finance}
            </button>

            <button
              type="button"
              className="residents-sidebar-link active"
            >
              <span className="material-symbols-outlined">
                groups
              </span>

              {currentText.residents}
            </button>

            <button
              type="button"
              className="residents-sidebar-link"
            >
              <span className="material-symbols-outlined">
                chat
              </span>

              {currentText.communication}
            </button>
          </nav>

          <div className="residents-sidebar-footer">
            {currentText.portalFooter}
          </div>
        </aside>

        <main className="residents-content">
          <div className="residents-content-top">
            <div>
              <h1 className="residents-page-title">
                {currentText.people}
              </h1>

              <p className="residents-page-description">
                {currentText.peopleDescription}
              </p>
            </div>

            <button
  type="button"
  className="residents-add-button"
  onClick={() => navigate("/account/create")}
>
  <span className="material-symbols-outlined">
    add
  </span>

  {currentText.addPerson}
</button>
          </div>

          <section className="residents-table-card">
            <div className="residents-filters">
              <div className="residents-search">
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
                value={accessLevelFilter}
                onChange={(event) =>
                  setAccessLevelFilter(event.target.value)
                }
              >
                <option value="all">
                  {currentText.allAccessLevels}
                </option>
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

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
              >
                <option value="all">
                  {currentText.allStatuses}
                </option>
                <option value="active">
                  {currentText.active}
                </option>
                <option value="inactive">
                  {currentText.inactive}
                </option>
              </select>
            </div>

            <div className="residents-table-wrapper">
              <table className="residents-table">
                <thead>
                  <tr>
                    <th>{currentText.fullName}</th>
                    <th>{currentText.idNumber}</th>
                    <th>{currentText.mobileNumber}</th>
                    <th>{currentText.email}</th>
                    <th>{currentText.accessLevel}</th>
                    <th>{currentText.relationship}</th>
                    <th>{currentText.apartments}</th>
                    <th>{currentText.accountStatus}</th>
                    <th>{currentText.actions}</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAccounts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="residents-empty"
                      >
                        {currentText.noAccounts}
                      </td>
                    </tr>
                  ) : (
                    filteredAccounts.map((account) => (
                      <tr key={account.AccountID}>
                        <td className="residents-name">
                          {account.FullName}
                        </td>

                        <td>{account.IDNumber}</td>

                        <td>
                          {account.MobileNumber || "—"}
                        </td>

                        <td>{currentText.noEmail}</td>

                        <td>
                          <span className="residents-access-badge">
                            {account.AccessLevel}
                          </span>
                        </td>

                        <td>{currentText.noApartment}</td>

                        <td>{currentText.noApartment}</td>

                        <td>
                          <span
                            className={`residents-status ${
                              account.IsActive
                                ? "active"
                                : "inactive"
                            }`}
                          >
                            <span className="residents-status-dot" />

                            {account.IsActive
                              ? currentText.active
                              : currentText.inactive}
                          </span>
                        </td>

                        <td>
                          <div className="residents-actions">
                            <button
  type="button"
  aria-label="View account"
  title="View"
  onClick={() => navigate(`/account/${account.AccountID}`)}
>
  <span className="material-symbols-outlined">
    visibility
  </span>
</button>

   <button
  type="button"
  aria-label="Edit account"
  title="Edit"
  onClick={() =>
    navigate(`/account/${account.AccountID}/edit`)
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

            <div className="residents-table-footer">
              <span>
                {currentText.showing}{" "}
                {filteredAccounts.length}{" "}
                {currentText.of} {accounts.length}{" "}
                {currentText.entries}
              </span>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Residents;