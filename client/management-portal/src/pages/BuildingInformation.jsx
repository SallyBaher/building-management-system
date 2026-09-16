import { useEffect, useState } from "react";

function BuildingInformation() {
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBuildingInformation() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          window.location.href = "/login";
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
            window.location.href = "/login";
            return;
          }

          throw new Error(
            data.message || "Failed to load building information."
          );
        }

        setBuilding(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchBuildingInformation();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  if (loading) {
    return <h1>Loading building information...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <main>
      <h1>Building Information</h1>

      <button type="button" onClick={handleLogout}>
        Logout
      </button>

      <p>
        <strong>Name:</strong> {building.Name}
      </p>

      <p>
        <strong>Address:</strong> {building.Address}
      </p>

      <p>
        <strong>City:</strong> {building.City}
      </p>

      <p>
        <strong>Number of floors:</strong> {building.NumberOfFloors}
      </p>

      <p>
        <strong>Number of apartments:</strong>{" "}
        {building.NumberOfApartments}
      </p>

      <p>
        <strong>Contact phone:</strong>{" "}
        {building.ContactPhone || "Not provided"}
      </p>

      <p>
        <strong>Email:</strong> {building.Email || "Not provided"}
      </p>

      <p>
        <strong>Maintenance fee:</strong>{" "}
        {building.MaintenanceFee ?? "Not provided"}
      </p>
    </main>
  );
}

export default BuildingInformation;