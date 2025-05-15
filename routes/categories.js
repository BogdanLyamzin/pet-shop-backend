const express = require("express");

const Category = require("../database/models/category");
const Product = require("../database/models/product");

const parsePaginationParams = require("../utils/parsePaginationParams");
const parseProductsFilterParams = require("../utils/parseProductsFilterParams");
const orderBy = require("../utils/orderBy");
const createSortFilter = require("../utils/createSortFilter");

const router = express.Router();

router.get("/all", async (req, res) => {
  const { page, limit } = parsePaginationParams(req.query);
  const offset = (page - 1) * limit;
  const data = await Category.findAll({
    offset,
    limit,
  });

  const total = await Category.count();

  const totalPages = Math.ceil(total / limit);

  res.json({
    total,
    totalPages,
    data,
  });
});

router.get("/popular", async (req, res) => {
  const result = await Category.findAll({
    limit: 4,
  });
  res.json(result);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const normalizedId = Number(id);

  if (isNaN(id)) {
    return res.status(404).json({ message: "wrong id" });
  }

  const { page, limit } = parsePaginationParams(req.query);
  const {priceFrom, priceTo, discont} = parseProductsFilterParams(req.query);
  const {sort} = req.query;

  const offset = (page - 1) * limit;

  const where = createSortFilter({priceFrom, priceTo, discont});
  where.categoryId = normalizedId;

  const order = orderBy[sort] ? orderBy[sort] : orderBy.default;

  const category = await Category.findOne({ where: { id: normalizedId } });

  if (!category) {
    res.status(404).json({ message: `Category with id=${id} not found` });
    return;
  }

  const total = await Product.count({
    where
  });

  const products = await Product.findAll({
    offset,
    limit,
    where,
    order,
  });

  const totalPages = Math.ceil(total / limit);

  res.json({
    total,
    totalPages,
    data: {
      category,
      products,
    }
  });

});

module.exports = router;
