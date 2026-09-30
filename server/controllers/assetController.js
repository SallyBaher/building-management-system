import {
  getAllAssets,
  getAssetById,
  addAsset,
  editAsset,
} from "../services/assetService.js";

const VALID_STATUSES = [
  "Operational",
  "Under Maintenance",
  "Out of Service",
  "Retired",
];

export async function getAssets(req, res, next) {
  try {
    const assets = await getAllAssets();

    return res.status(200).json(assets);
  } catch (error) {
    return next(error);
  }
}

export async function getAsset(req, res, next) {
  try {
    const assetId = Number(req.params.assetId);

    if (!Number.isInteger(assetId) || assetId <= 0) {
      return res.status(400).json({
        message: "Invalid asset ID.",
      });
    }

    const asset = await getAssetById(assetId);

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found.",
      });
    }

    return res.status(200).json(asset);
  } catch (error) {
    return next(error);
  }
}

export async function createAsset(req, res, next) {
  try {
    const {
      buildingId,
      apartmentId,
      assetType,
      assetName,
      description,
      status,
    } = req.body;

    if (!buildingId || !assetType || !assetName || !status) {
      return res.status(400).json({
        message:
          "Building ID, asset type, asset name and status are required.",
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid asset status.",
      });
    }

    const asset = await addAsset(
      Number(buildingId),
      apartmentId ? Number(apartmentId) : null,
      assetType,
      assetName,
      description || null,
      status
    );

    return res.status(201).json(asset);
  } catch (error) {
    return next(error);
  }
}

export async function updateAsset(req, res, next) {
  try {
    const assetId = Number(req.params.assetId);

    if (!Number.isInteger(assetId) || assetId <= 0) {
      return res.status(400).json({
        message: "Invalid asset ID.",
      });
    }

    const {
      apartmentId,
      assetType,
      assetName,
      description,
      status,
    } = req.body;

    if (!assetType || !assetName || !status) {
      return res.status(400).json({
        message:
          "Asset type, asset name and status are required.",
      });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        message: "Invalid asset status.",
      });
    }

    const asset = await editAsset(
      assetId,
      apartmentId ? Number(apartmentId) : null,
      assetType,
      assetName,
      description || null,
      status
    );

    if (!asset) {
      return res.status(404).json({
        message: "Asset not found.",
      });
    }

    return res.status(200).json(asset);
  } catch (error) {
    return next(error);
  }
}