const express = require("express");

const Category = require("../database/models/category");
const Product = require("../database/models/product");

const parsePaginationParams = require("../utils/parsePaginationParams");
const parseProductsFilterParams = require("../utils/parseProductsFilterParams");
import {createSortFilter} from "./products";
import {orderBy} from "./products";

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

  const total = await Product.count({
    where
  });

  const categoryRequest = await Category.findOne({ where: { id: normalizedId } });

  const totalPages = Math.ceil(total / limit);

  const data = await Product.findAll({
    offset,
    limit,
    where,
    order,
  });

  const productsRequest = Product.findAll({
    where: { categoryId: normalizedId },
  });

  const [products, category] = await Promise.all([
    productsRequest,
    categoryRequest,
  ]);

  if (!category) {
    res.status(404).json({ message: `Category with id=${id} not found` });
    return;
  }

  res.json({
    total,
    totalPages,
    data,
  });

  res.json({
    category,
    data: products,
  });
});

module.exports = router;
