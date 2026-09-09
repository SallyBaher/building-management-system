import "./CreateBuilding.css";

function CreateBuilding() {
  return (
    <div className="setup-page">
      {/* Header */}
      <header className="setup-header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-icon">
              <span className="material-symbols-outlined">domain</span>
            </div>

            <div className="brand-content">
              <span className="brand-name">HOA Management Portal</span>
              <span className="setup-badge">Admin Setup</span>
            </div>
          </div>

          <div className="header-actions">
            <div className="language-switcher">
              <button
                type="button"
                className="language-active"
              >
                EN
              </button>

              <button type="button">
                AR
              </button>
            </div>

            <div className="header-divider" />

            <button
              type="button"
              className="support-button"
            >
              <span className="material-symbols-outlined">
                help_outline
              </span>

              <span>Support</span>
            </button>
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

                Initial Setup
              </strong>

              <span>•</span>

              <span className="step-badge">
                Step 1 of 1
              </span>
            </div>

            <div className="secure-status">
              <span />

              Secure Setup
            </div>
          </div>

          {/* Page heading */}
          <div className="page-heading">
            <h1>Create Your Building</h1>

            <p>
              Set up your building and create your Super Admin account
              to get started.
            </p>
          </div>

          {/* Form */}
          <form className="setup-form">

            {/* Building Information */}
            <section className="form-card">
              <div className="card-header">
                <div className="card-icon">
                  <span className="material-symbols-outlined">
                    apartment
                  </span>
                </div>

                <div>
                  <h2>Building Information</h2>

                  <p>
                    Enter the physical and capacity details of the property.
                  </p>
                </div>
              </div>

              <div className="card-body">

                {/* Building Name + City */}
                <div className="form-grid">

                  <div className="form-field">
                    <label htmlFor="buildingName">
                      Building Name <span>*</span>
                    </label>

                    <div className="input-wrapper">
                      <span className="material-symbols-outlined">
                        corporate_fare
                      </span>

                      <input
                        id="buildingName"
                        name="buildingName"
                        type="text"
                        placeholder="e.g., Oceanview Tower"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="city">
                      City <span>*</span>
                    </label>

                    <div className="input-wrapper">
                      <span className="material-symbols-outlined">
                        location_city
                      </span>

                      <input
                        id="city"
                        name="city"
                        type="text"
                        placeholder="e.g., Cairo"
                        required
                      />
                    </div>
                  </div>

                </div>

                {/* Address */}
                <div className="form-field">
                  <label htmlFor="address">
                    Address <span>*</span>
                  </label>

                  <div className="input-wrapper">
                    <span className="material-symbols-outlined">
                      map
                    </span>

                    <input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="e.g., 14 El-Tahrir St., Zamalek"
                      required
                    />
                  </div>
                </div>

                {/* Floors + Apartments */}
                <div className="form-grid">

                  <div className="form-field">
                    <label htmlFor="numberOfFloors">
                      Number of Floors <span>*</span>
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
                        placeholder="e.g., 12"
                        required
                      />
                    </div>

                    <small>
                      Can be set to 0 initially if configuring later.
                    </small>
                  </div>

                  <div className="form-field">
                    <label htmlFor="numberOfApartments">
                      Number of Apartments <span>*</span>
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
                        placeholder="e.g., 48"
                        required
                      />
                    </div>

                    <small>
                      Can be set to 0 initially if units are unassigned.
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

                      Optional Building Contact Information
                    </strong>

                    <span>Optional</span>
                  </div>

                  <div className="form-grid">

                    <div className="form-field">
                      <label htmlFor="contactPhone">
                        Contact Phone
                      </label>

                      <div className="input-wrapper">
                        <span className="material-symbols-outlined">
                          call
                        </span>

                        <input
                          id="contactPhone"
                          name="contactPhone"
                          type="tel"
                          placeholder="e.g., +20 100 123 4567"
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label htmlFor="email">
                        Email
                      </label>

                      <div className="input-wrapper">
                        <span className="material-symbols-outlined">
                          mail
                        </span>

                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="e.g., management@oceanview.com"
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
                  <h2>Create Super Admin Account</h2>

                  <p>
                    Your account will have Super Admin access to manage
                    the building.
                  </p>
                </div>
              </div>

              <div className="card-body">

                {/* Full Name + ID */}
                <div className="form-grid">

                  <div className="form-field">
                    <label htmlFor="fullName">
                      Full Name <span>*</span>
                    </label>

                    <div className="input-wrapper">
                      <span className="material-symbols-outlined">
                        person
                      </span>

                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder="e.g., Tamer Mansour"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label htmlFor="idNumber">
                      ID Number <span>*</span>
                    </label>

                    <div className="input-wrapper">
                      <span className="material-symbols-outlined">
                        badge
                      </span>

                      <input
                        id="idNumber"
                        name="idNumber"
                        type="text"
                        placeholder="e.g., 29001011234567"
                        required
                      />
                    </div>
                  </div>

                </div>

                {/* Mobile */}
                <div className="form-field">
                  <label htmlFor="mobileNumber">
                    Mobile Number <span>*</span>
                  </label>

                  <div className="input-wrapper">
                    <span className="material-symbols-outlined">
                      smartphone
                    </span>

                    <input
                      id="mobileNumber"
                      name="mobileNumber"
                      type="tel"
                      placeholder="e.g., +20 10 1234 5678"
                      required
                    />
                  </div>

                  <div className="otp-note">
                    <span className="material-symbols-outlined">
                      chat
                    </span>

                    <p>
                      Used to receive your login OTP via WhatsApp.
                      No password creation required.
                    </p>
                  </div>
                </div>

              </div>
            </section>

            {/* Required fields note */}
            <div className="required-note">
              <span>*</span> Indicates mandatory fields.
            </div>

            {/* Actions */}
            <div className="form-actions">

              <button
                type="button"
                className="support-link"
              >
                <span className="material-symbols-outlined">
                  support_agent
                </span>

                Need assistance? Contact Support
              </button>

              <button
                type="submit"
                className="create-button"
              >
                <span>Create Building</span>

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
        © {new Date().getFullYear()} HOA Management Portal. All rights reserved.
      </footer>
    </div>
  );
}

export default CreateBuilding;