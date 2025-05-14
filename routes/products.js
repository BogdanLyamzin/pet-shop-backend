const express = require("express");
const { Op } = require("sequelize");

const Product = require("../database/models/product");

const parsePaginationParams = require("../utils/parsePaginationParams");
const parseProductsFilterParams = require("../utils/parseProductsFilterParams");

const router = express.Router();

router.get("/all", async (req, res) => {
  const { page, limit } = parsePaginationParams(req.query);
  const filters = parseProductsFilterParams(req.query);

  const offset = (page - 1) * limit;

  const where = {};

  if (filters.priceFrom && filters.priceTo) {
    where.price = {
      [Op.between]: [filters.priceFrom, filters.priceTo],
    };
  } else if (filters.priceFrom && !filters.priceTo) {
    where.price = { [Op.gte]: filters.priceFrom };
  } else if(!filters.priceFrom && filters.priceTo) {
    where.price = {
      [Op.lte]: filters.priceTo
    }
  }

  // if (filters.priceFrom && filters.priceTo) {
  // where.price = {
  //     [Op.between]: [priceFrom, priceTo]
  // };
  // } else if (priceFrom !== null) {
  // where.price = {
  //     [Op.gte]: priceFrom
  // };
  // } else if (priceTo !== null) {
  // where.price = {
  //     [Op.lte]: priceTo
  // };
  // }

  const result = await Product.findAll({
    offset,
    limit,
    where,
  });

  res.json(result);
});

router.get("/sale", async (req, res) => {
  const { page, limit } = parsePaginationParams(req.query);
  const offset = (page - 1) * limit;
  const data = await Product.findAll({
    offset,
    limit,
    where: {
      discont_price: {
        [Op.ne]: null,
      },
    },
  });

  const total = await Product.count({
    discont_price: {
      [Op.ne]: null,
    },
  });

  const totalPages = Math.ceil(total / limit);

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

router.get("/add/:title/:price/:discont_price/:description", (req, res) => {
  const { title, price, discont_price, description } = req.params;
  Product.create({ title, price, discont_price, description, categoryId: 1 });
  res.json(`добавлено`);
});

module.exports = router;
