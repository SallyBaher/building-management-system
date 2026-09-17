import { useState } from "react";
import { useNavigate } from "react-router-dom";
import i18n from "../../i18n";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

  const isArabic = language === "ar";

  const text = {
    en: {
      brandName: "Smart Block Management",
      login: "Login",
      landingEyebrow: "SMART BLOCK MANAGEMENT",
      landingTitle:
        "Manage your building. Simplify your community.",
      landingDescription:
        "SBM helps building managers organize residents, apartments, payments, maintenance activities, and community information in one simple platform.",
      startBuilding: "Start your building",
      buildingManagement: "Building Management",
      buildingManagementDescription:
        "Organize your building information, apartments, and residents in one place.",
      paymentsReports: "Payments & Reports",
      paymentsReportsDescription:
        "Track payments, expenses, income, and important financial reports.",
      communityManagement: "Community Management",
      communityManagementDescription:
        "Keep residents connected and manage community activities more easily.",
      footer:
        "© 2026 Smart Block Management. All rights reserved.",
    },

    ar: {
      brandName: "إدارة المباني الذكية",
      login: "تسجيل الدخول",
      landingEyebrow: "إس بي إم لإدارة المباني",
      landingTitle: "أدر مبناك. وبسّط مجتمعك.",
      landingDescription:
        "يساعدك إس بي إم على تنظيم معلومات المبنى والشقق والسكان والمدفوعات وأنشطة الصيانة في منصة واحدة بسيطة.",
      startBuilding: "ابدأ مبناك",
      buildingManagement: "إدارة المبنى",
      buildingManagementDescription:
        "نظّم معلومات المبنى والشقق والسكان في مكان واحد.",
      paymentsReports: "المدفوعات والتقارير",
      paymentsReportsDescription:
        "تابع المدفوعات والمصروفات والإيرادات والتقارير المالية المهمة.",
      communityManagement: "إدارة المجتمع",
      communityManagementDescription:
        "حافظ على تواصل السكان وأدر أنشطة المجتمع بسهولة أكبر.",
      footer:
        "© 2026 إس بي إم لإدارة المباني. جميع الحقوق محفوظة.",
    },
  };

  const currentText = text[language];

  const handleLanguageChange = (newLanguage) => {
    localStorage.setItem("language", newLanguage);
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <div
      className={`landing-page ${
        isArabic ? "landing-rtl" : ""
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <header className="landing-header">
        <div className="landing-header-inner">
          <div className="landing-brand">
            <span className="landing-brand-name">
              SBM
            </span>

            <span className="landing-brand-subtitle">
              {currentText.brandName}
            </span>
          </div>

          <div className="landing-header-actions">
            <button
              type="button"
              className="landing-language-switcher"
              onClick={() =>
                handleLanguageChange(
                  isArabic ? "en" : "ar"
                )
              }
              dir="ltr"
            >
              <span className="material-symbols-outlined">
                language
              </span>

              <span>{isArabic ? "EN" : "عربي"}</span>
            </button>

            <button
              type="button"
              className="landing-login-button"
              onClick={() => navigate("/login")}
            >
              {currentText.login}
            </button>
          </div>
        </div>
      </header>

      <main className="landing-main">
        <section className="landing-content">
          <p className="landing-eyebrow">
            {currentText.landingEyebrow}
          </p>

          <h1>{currentText.landingTitle}</h1>

          <p className="landing-description">
            {currentText.landingDescription}
          </p>

          <button
            type="button"
            className="landing-start-button"
            onClick={() => navigate("/create-building")}
          >
            <span>{currentText.startBuilding}</span>

            <span className="material-symbols-outlined">
              {isArabic ? "arrow_back" : "arrow_forward"}
            </span>
          </button>
        </section>

<p className="landing-features-label">
  {isArabic ? "كل ما تحتاجه لإدارة مبناك" : "Everything you need to manage your building"}
</p>

        <section className="landing-features">
          <div className="landing-feature-card">
            <span className="material-symbols-outlined">
              apartment
            </span>

            <h2>{currentText.buildingManagement}</h2>

            <p>
              {currentText.buildingManagementDescription}
            </p>
          </div>

          <div className="landing-feature-card">
            <span className="material-symbols-outlined">
              payments
            </span>

            <h2>{currentText.paymentsReports}</h2>

            <p>
              {currentText.paymentsReportsDescription}
            </p>
          </div>

          <div className="landing-feature-card">
            <span className="material-symbols-outlined">
              groups
            </span>

            <h2>{currentText.communityManagement}</h2>

            <p>
              {currentText.communityManagementDescription}
            </p>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        {currentText.footer}
      </footer>
    </div>
  );
}

export default Landing;