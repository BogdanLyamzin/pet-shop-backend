const express = require("express");

const Product = require("../database/models/product");

const parsePaginationParams = require("../utils/parsePaginationParams");
const parseProductsFilterParams = require("../utils/parseProductsFilterParams");
const orderBy = require("../utils/orderBy");
const createSortFilter = require("../utils/createSortFilter");

const router = express.Router();

router.get("/all", async (req, res) => {
  const { page, limit } = parsePaginationParams(req.query);
  const {priceFrom, priceTo, discont} = parseProductsFilterParams(req.query);
  const {sort} = req.query;

  const offset = (page - 1) * limit;

  const where = createSortFilter({priceFrom, priceTo, discont});

  const order = orderBy[sort] ? orderBy[sort] : orderBy.default;

  const total = await Product.count({
    where
  });

  const totalPages = Math.ceil(total / limit);

  const data = await Product.findAll({
    offset,
    limit,
    where,
    order,
  });

  res.json({
    total,
    totalPages,
    data,
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.json({ status: "ERR", message: "wrong id" });
    return;
  }
  const all = await Product.findAll({ where: { id: +id } });

  if (all.length === 0) {
    res.json({ status: "ERR", message: "product not found" });
    return;
  }

  res.json(all);
});

module.exports = router;
