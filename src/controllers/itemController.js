const { PrismaClient } = require('@prisma/client');
const { resSuccess, resError } = require('../utils/response');
const prisma = new PrismaClient();
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

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

exports.getItemReport = async (req, res) => {
  try {
    const { hotel_code, department_code, status } = req.query;
    const where = {};

    if (hotel_code) where.hotel_code = hotel_code;          
    if (department_code) where.department_code = department_code;
    if (status) where.status = status;

    const items = await prisma.item_Master.findMany({ where });
    return resSuccess(res, 'Filtered report fetched', items);
  } catch (err) {
    console.error(err);
    return resError(res, 'Failed to fetch report');
  }
};

exports.exportItemReportCSV = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Invalid IDs' });
    }

    const items = await prisma.item_Master.findMany({
      where: { id: { in: ids } },
    });

    if (!items.length) {
      return res.status(404).json({ message: 'No items found' });
    }

    const csvHeaders = Object.keys(items[0]).join(',');
    const csvRows = items.map(item =>
      Object.values(item).join(',')
    ).join('\n');
    const csvContent = `${csvHeaders}\n${csvRows}`;

    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const filePath = path.join(tempDir, `report-${Date.now()}.csv`);
    fs.writeFileSync(filePath, csvContent);

    res.download(filePath, 'report.csv', (err) => {
      if (err) {
        console.error('❌ Error sending file:', err);
        res.status(500).json({ message: 'Failed to send file' });
      } else {
        fs.unlinkSync(filePath);
      }
    });
  } catch (err) {
    console.error('🔥 exportItemReportCSV error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};