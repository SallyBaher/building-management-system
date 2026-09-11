import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import "./CreateBuilding.css";

function CreateBuilding() {
  const { t } = useTranslation();

  const isArabic = i18n.language === "ar";

  const [formData, setFormData] = useState({
    buildingName: "",
    address: "",
    city: "",
    numberOfFloors: "",
    numberOfApartments: "",
    contactPhone: "",
    email: "",
    fullName: "",
    idNumber: "",
    mobileNumber: ""
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
  const { name, value } = event.target;

  setFormData((previousData) => ({
    ...previousData,
    [name]: value
  }));
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const floors = Number(formData.numberOfFloors);
const apartments = Number(formData.numberOfApartments);

if (!Number.isInteger(floors) || floors < 0) {
  setError(t("invalidFloors"));
  setMessage("");
  return;
}

if (!Number.isInteger(apartments) || apartments < 0) {
  setError(t("invalidApartments"));
  setMessage("");
  return;
}

  setMessage("");
  setError("");
  setIsSubmitting(true);

  try {
    const response = await fetch(
  `${import.meta.env.VITE_API_URL}/setup/initial`,
  {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...formData,
        numberOfFloors: Number(formData.numberOfFloors),
        numberOfApartments: Number(formData.numberOfApartments)
      })
    });

    const data = await response.json();

    if (!response.ok) {
  if (response.status === 400) {
    throw new Error(t("setupAlreadyCompleted"));
  }

  throw new Error(data.message || "Something went wrong.");
}

    setMessage(data.message);
  } catch (submitError) {
    setError(submitError.message);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div
      className="setup-page"
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Header */}
      <header className="setup-header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-icon">
              <span className="material-symbols-outlined">
                domain
              </span>
            </div>

            <div className="brand-content">
              <span className="brand-name">
                {t("brandName")}
              </span>

              <span className="setup-badge">
                {t("adminSetup")}
              </span>
            </div>
          </div>

          <div className="header-actions">
            <div className="language-switcher">
              <button
  type="button"
  className={!isArabic ? "language-active" : ""}
  onClick={() => i18n.changeLanguage("en")}
>
  {isArabic ? "الإنجليزية" : "EN"}
</button>

<button
  type="button"
  className={isArabic ? "language-active" : ""}
  onClick={() => i18n.changeLanguage("ar")}
>
  {isArabic ? "العربية" : "AR"}
</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="setup-main">
        <div className="setup-container">

          {/* Step indicator */}
          <div className="setup-step">
            <div className="setup-step-left">
              <strong>
                <span className="material-symbols-outlined">
                  flag
                </span>

                {t("initialSetup")}
              </strong>

              <span>•</span>

              <span className="step-badge">
                {t("stepOf", {
                  current: 1,
                  total: 1
                })}
              </span>
            </div>

            <div className="secure-status">
              <span />

              {t("secureSetup")}
            </div>
          </div>

          {/* Page heading */}
          <div className="page-heading">
            <h1>{t("createYourBuilding")}</h1>

            <p>{t("createBuildingSubtitle")}</p>
          </div>

          {/* Form */}
          <form className="setup-form" onSubmit={handleSubmit}>

            {/* Building Information */}
            <section className="form-card">
              <div className="card-header">
                <div className="card-icon">
                  <span className="material-symbols-outlined">
                    apartment
                  </span>
                </div>

                <div>
                  <h2>
                    {t("buildingInformation")}
                  </h2>

                  <p>
                    {t("buildingInformationDescription")}
                  </p>
                </div>
              </div>

              <div className="card-body">

                {/* Building Name + City */}
                <div className="form-grid">

                  <div className="form-field">
                    <label htmlFor="buildingName">
                      {t("buildingName")}{" "}
                      <span>*</span>
                    </label>

                    <div className="input-wrapper">
                      <span className="material-symbols-outlined">
                        corporate_fare
                      </span>

                     <input
  id="buildingName"
  name="buildingName"
  type="text"
  value={formData.buildingName}
  onChange={handleChange}
  placeholder={t("buildingNamePlaceholder")}
  required
/>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="city">
                      {t("city")}{" "}
                      <span>*</span>
                    </label>

                    <div className="input-wrapper">
                      <span className="material-symbols-outlined">
                        location_city
                      </span>

                      <input
  id="city"
  name="city"
  type="text"
  value={formData.city}
  onChange={handleChange}
  placeholder={t("cityPlaceholder")}
  required
/>
                    </div>
                  </div>

                </div>

                {/* Address */}
                <div className="form-field">
                  <label htmlFor="address">
                    {t("address")}{" "}
                    <span>*</span>
                  </label>

                  <div className="input-wrapper">
                    <span className="material-symbols-outlined">
                      map
                    </span>

                    <input
  id="address"
  name="address"
  type="text"
  value={formData.address}
  onChange={handleChange}
  placeholder={t("addressPlaceholder")}
  required
/>
                  </div>
                </div>

                {/* Floors + Apartments */}
                <div className="form-grid">

                  <div className="form-field">
                    <label htmlFor="numberOfFloors">
                      {t("numberOfFloors")}{" "}
                      <span>*</span>
                    </label>

                    <div className="input-wrapper">
                      <span className="material-symbols-outlined">
                        layers
                      </span>

                      <input
  id="numberOfFloors"
  name="numberOfFloors"
  type="number"
  min="0"
  value={formData.numberOfFloors}
  onChange={handleChange}
  placeholder={t("floorsPlaceholder")}
  required
/>
                    </div>

                    <small>
                      {t("floorsNote")}
                    </small>
                  </div>

                  <div className="form-field">
                    <label htmlFor="numberOfApartments">
                      {t("numberOfApartments")}{" "}
                      <span>*</span>
                    </label>

                    <div className="input-wrapper">
                      <span className="material-symbols-outlined">
                        meeting_room
                      </span>

                      <input
  id="numberOfApartments"
  name="numberOfApartments"
  type="number"
  min="0"
  value={formData.numberOfApartments}
  onChange={handleChange}
  placeholder={t("apartmentsPlaceholder")}
  required
/>
                    </div>

                    <small>
                      {t("apartmentsNote")}
                    </small>
                  </div>

                </div>

                {/* Optional contact information */}
                <div className="optional-section">

                  <div className="optional-heading">
                    <strong>
                      <span className="material-symbols-outlined">
                        contact_phone
                      </span>

                      {t(
                        "optionalBuildingContactInformation"
                      )}
                    </strong>

                    <span>
                      {t("optional")}
                    </span>
                  </div>

                  <div className="form-grid">

                    <div className="form-field">
                      <label htmlFor="contactPhone">
                        {t("contactPhone")}
                      </label>

                      <div className="input-wrapper">
                        <span className="material-symbols-outlined">
                          call
                        </span>

                       <input
  id="contactPhone"
  name="contactPhone"
  type="tel"
  dir={isArabic ? "rtl" : "ltr"}
  style={{
    textAlign: isArabic ? "right" : "left"
  }}
  value={formData.contactPhone}
  onChange={handleChange}
  placeholder={t("contactPhonePlaceholder")}
/>
                      </div>
                    </div>

                    <div className="form-field">
                      <label htmlFor="email">
                        {t("email")}
                      </label>

                      <div className="input-wrapper">
                        <span className="material-symbols-outlined">
                          mail
                        </span>

                       <input
  id="email"
  name="email"
  type="email"
  dir={isArabic ? "rtl" : "ltr"}
  value={formData.email}
  onChange={handleChange}
  placeholder={t("emailPlaceholder")}
/>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </section>

            {/* Super Admin */}
            <section className="form-card">

              <div className="card-header">
                <div className="card-icon admin-icon">
                  <span className="material-symbols-outlined">
                    admin_panel_settings
                  </span>
                </div>

                <div>
                  <h2>
                    {t("createSuperAdminAccount")}
                  </h2>

                  <p>
                    {t("superAdminDescription")}
                  </p>
                </div>
              </div>

              <div className="card-body">

                {/* Full Name + ID */}
                <div className="form-grid">

                  <div className="form-field">
                    <label htmlFor="fullName">
                      {t("fullName")}{" "}
                      <span>*</span>
                    </label>

                    <div className="input-wrapper">
                      <span className="material-symbols-outlined">
                        person
                      </span>

                      <input
  id="fullName"
  name="fullName"
  type="text"
  value={formData.fullName}
  onChange={handleChange}
  placeholder={t("fullNamePlaceholder")}
  required
/>
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="idNumber">
                      {t("idNumber")}{" "}
                      <span>*</span>
                    </label>

                    <div className="input-wrapper">
                      <span className="material-symbols-outlined">
                        badge
                      </span>

                      <input
  id="idNumber"
  name="idNumber"
  type="text"
  dir="ltr"
  value={formData.idNumber}
  onChange={handleChange}
  placeholder={t("idNumberPlaceholder")}
  required
/>
                    </div>
                  </div>

                </div>

                {/* Mobile */}
                <div className="form-field">
                  <label htmlFor="mobileNumber">
                    {t("mobileNumber")}{" "}
                    <span>*</span>
                  </label>

                  <div className="input-wrapper">
                    <span className="material-symbols-outlined">
                      smartphone
                    </span>

                 <input
  id="mobileNumber"
  name="mobileNumber"
  type="tel"
  dir={isArabic ? "rtl" : "ltr"}
  style={{
    textAlign: isArabic ? "right" : "left"
  }}
  value={formData.mobileNumber}
  onChange={handleChange}
  placeholder={t("mobileNumberPlaceholder")}
  required
/>
                  </div>

                  <div className="otp-note">
                    <span className="material-symbols-outlined">
                      chat
                    </span>

                    <p>
                      {t("otpNote")}
                    </p>
                  </div>
                </div>

              </div>
            </section>

           {/* Required fields note */}
<div className="required-note">
  <span>*</span>{" "}
  {t("requiredFieldsNote")}

  {message && <p>{message}</p>}
  {error && <p>{error}</p>}
</div>

            {/* Actions */}
            <div className="form-actions">
              <button
  type="submit"
  className="create-button"
  disabled={isSubmitting}
>
  <span>
    {isSubmitting ? t("creating") : t("createBuilding")}
  </span>

  <span className="material-symbols-outlined">
    arrow_forward
  </span>
</button>
            </div>

          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="setup-footer">
        {t("footer")}
      </footer>
    </div>
  );
}

export default CreateBuilding;