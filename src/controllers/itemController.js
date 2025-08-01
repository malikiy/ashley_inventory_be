const { PrismaClient } = require('@prisma/client');
const { resSuccess, resError } = require('../utils/response');
const prisma = new PrismaClient();

exports.getItems = async (req, res) => {
  try {
    const items = await prisma.item_Master.findMany();
    return resSuccess(res, 'Items fetched successfully', items);
  } catch (err) {
    console.error(err);
    return resError(res, 'Failed to fetch items');
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await prisma.item_Master.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!item) return resError(res, 'Item not found', 404);
    return resSuccess(res, 'Item fetched successfully', item);
  } catch (err) {
    console.error(err);
    return resError(res, 'Failed to fetch item');
  }
};

exports.createItem = async (req, res) => {
  try {
    const { asset_id, serial_number, barcode } = req.body;

    const existingAssetId = await prisma.item_Master.findUnique({ where: { asset_id } });
    if (existingAssetId) return resError(res, 'Asset ID already exists', 400);

    const existingSN = await prisma.item_Master.findUnique({ where: { serial_number } });
    if (existingSN) return resError(res, 'Serial Number already exists', 400);

    const existingBarcode = await prisma.item_Master.findUnique({ where: { barcode } });
    if (existingBarcode) return resError(res, 'Barcode already exists', 400);

    const item = await prisma.item_Master.create({ data: req.body });
    return resSuccess(res, 'Item created successfully', item, 201);
  } catch (err) {
    console.error(err);
    return resError(res, 'Failed to create item');
  }
};


exports.updateItem = async (req, res) => {
  try {
    const item = await prisma.item_Master.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    return resSuccess(res, 'Item updated successfully', item);
  } catch (err) {
    console.error(err);
    return resError(res, 'Failed to update item');
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await prisma.item_Master.delete({ where: { id: parseInt(req.params.id) } });
    return resSuccess(res, 'Item deleted successfully');
  } catch (err) {
    console.error(err);
    return resError(res, 'Failed to delete item');
  }
};
