import {
  createFloor,
  FloorServiceError
} from "../services/floorService.js";

export async function createFloorController(req, res, next) {
  try {
    const floor = await createFloor(req.body);

    return res.status(201).json(floor);
  } catch (error) {
    if (error instanceof FloorServiceError) {
      return res.status(400).json({
        message: error.message
      });
    }

    return next(error);
  }
}