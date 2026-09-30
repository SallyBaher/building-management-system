import pool from "../db/pool.js";

export async function findAllAssets() {
  const result = await pool.query(
    `SELECT
       "AssetID",
       "BuildingID",
       "ApartmentID",
       "AssetType",
       "AssetName",
       "Description",
       "Status"
     FROM "ASSET"
     ORDER BY "AssetID" ASC`
  );

  return result.rows;
}

export async function findAssetById(assetId) {
  const result = await pool.query(
    `SELECT
       "AssetID",
       "BuildingID",
       "ApartmentID",
       "AssetType",
       "AssetName",
       "Description",
       "Status"
     FROM "ASSET"
     WHERE "AssetID" = $1`,
    [assetId]
  );

  return result.rows[0] || null;
}

export async function createAsset(
  buildingId,
  apartmentId,
  assetType,
  assetName,
  description,
  status
) {
  const result = await pool.query(
    `INSERT INTO "ASSET"
      (
        "BuildingID",
        "ApartmentID",
        "AssetType",
        "AssetName",
        "Description",
        "Status"
      )
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING
       "AssetID",
       "BuildingID",
       "ApartmentID",
       "AssetType",
       "AssetName",
       "Description",
       "Status"`,
    [
      buildingId,
      apartmentId,
      assetType,
      assetName,
      description,
      status,
    ]
  );

  return result.rows[0];
}

export async function updateAsset(
  assetId,
  apartmentId,
  assetType,
  assetName,
  description,
  status
) {
  const result = await pool.query(
    `UPDATE "ASSET"
     SET
       "ApartmentID" = $1,
       "AssetType" = $2,
       "AssetName" = $3,
       "Description" = $4,
       "Status" = $5
     WHERE "AssetID" = $6
     RETURNING
       "AssetID",
       "BuildingID",
       "ApartmentID",
       "AssetType",
       "AssetName",
       "Description",
       "Status"`,
    [
      apartmentId,
      assetType,
      assetName,
      description,
      status,
      assetId,
    ]
  );

  return result.rows[0] || null;
}