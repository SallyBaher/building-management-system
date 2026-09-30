import {
  findAllAssets,
  findAssetById,
  createAsset,
  updateAsset,
} from "../repositories/assetRepository.js";

export async function getAllAssets() {
  return await findAllAssets();
}

export async function getAssetById(assetId) {
  return await findAssetById(assetId);
}

export async function addAsset(
  buildingId,
  apartmentId,
  assetType,
  assetName,
  description,
  status
) {
  return await createAsset(
    buildingId,
    apartmentId,
    assetType,
    assetName,
    description,
    status
  );
}

export async function editAsset(
  assetId,
  apartmentId,
  assetType,
  assetName,
  description,
  status
) {
  return await updateAsset(
    assetId,
    apartmentId,
    assetType,
    assetName,
    description,
    status
  );
}