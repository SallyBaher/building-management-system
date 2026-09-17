import { useNavigate } from "react-router-dom";
import "./BuildingEdit.css";

function BuildingEdit() {
  const navigate = useNavigate();

  return (
    <div className="building-edit-page">
      <div className="building-edit-content">
        <div className="building-edit-breadcrumb">
          Home <span>›</span> Building
        </div>

        <h1>Building Master-Data</h1>

        <form className="building-edit-form">
          <div className="building-edit-grid">
            <label>
              Building Name *
              <input
                type="text"
                name="buildingName"
                placeholder="Enter building name"
              />
            </label>

            <label>
              Building Address *
              <input
                type="text"
                name="address"
                placeholder="Enter building address"
              />
            </label>

            <label>
              City *
              <input
                type="text"
                name="city"
                placeholder="Enter city"
              />
            </label>

            <label>
              Number of Floors *
              <input
                type="number"
                name="numberOfFloors"
                min="0"
                placeholder="Enter number of floors"
              />
            </label>

            <label>
              Number of Apartments *
              <input
                type="number"
                name="numberOfApartments"
                min="0"
                placeholder="Enter number of apartments"
              />
            </label>

            <label>
              Contact Phone
              <input
                type="tel"
                name="contactPhone"
                placeholder="Enter contact phone"
              />
            </label>

            <label className="building-edit-full-width">
              Email
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
              />
            </label>

            <label className="building-edit-full-width">
              Other Information
              <textarea
                name="otherInformation"
                placeholder="Enter other information"
                rows="5"
              />
            </label>
          </div>

          <div className="building-edit-actions">
            <button
              type="button"
              className="building-edit-cancel"
              onClick={() => navigate("/building-information")}
            >
              Cancel
            </button>

            <button type="submit" className="building-edit-save">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default BuildingEdit;