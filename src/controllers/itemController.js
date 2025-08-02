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
    const {
      hotel_code,
      department_code,
      category,
      serial_number,
      brand_model,
      status,
      image,      
      asset_name,
      asset_type,
    } = req.body;

    const itemCount = await prisma.item_Master.count();
    const nextId = itemCount + 1;

    const sanitizedCategory = category.replace(/\s/g, '').toUpperCase();

    const asset_id = `${hotel_code}${department_code}${sanitizedCategory}${nextId}`;
    const barcode = asset_id;

    const existingSN = await prisma.item_Master.findUnique({ where: { serial_number } });
    if (existingSN) return resError(res, 'Serial Number already exists', 400);

    const existingAssetId = await prisma.item_Master.findUnique({ where: { asset_id } });
    if (existingAssetId) return resError(res, 'Asset ID already exists', 400);

    const existingBarcode = await prisma.item_Master.findUnique({ where: { barcode } });
    if (existingBarcode) return resError(res, 'Barcode already exists', 400);

    const item = await prisma.item_Master.create({
      data: {
        asset_id,
        barcode,
        hotel_code,
        department_code,
        category,
        serial_number,
        brand_model,
        status,
        image, 
        asset_name,
        asset_type,
        date_created: new Date(),
      }
    });

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
