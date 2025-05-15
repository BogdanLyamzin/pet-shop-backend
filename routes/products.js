const express = require("express");
const { Op, fn, col, where, literal } = require("sequelize");

const Product = require("../database/models/product");

const parsePaginationParams = require("../utils/parsePaginationParams");
const parseProductsFilterParams = require("../utils/parseProductsFilterParams");
const Category = require("../database/models/category");

const router = express.Router();

export const orderBy = {
  "newest": [['createdAt', 'DESC']],
  "low-high": [[literal('COALESCE(discont_price, price)'), 'ASC']],
  "high-low": [[literal('COALESCE(discont_price, price)'), 'DESC']],
  "default": [['createdAt', 'DESC']],
};

export const createSortFilter = ({priceFrom, priceTo, discont}) => {
  const where = {};
  if (discont) {
    where.discont_price = {
      [Op.ne]: null
    };

    if (priceFrom || priceTo) {
      where.discont_price = {
        ...where.discont_price,
        ...(priceFrom && { [Op.gte]: priceFrom }),
        ...(priceTo && { [Op.lte]: priceTo })
      };
    }
  } else {
    where[Op.or] = [];

    if (priceFrom || priceTo) {
      where[Op.or].push({
        discont_price: { [Op.ne]: null },
        ...(priceFrom || priceTo) && {
          discont_price: {
            ...(priceFrom && { [Op.gte]: priceFrom }),
            ...(priceTo && { [Op.lte]: priceTo })
          }
        }
      });

      where[Op.or].push({
        discont_price: null,
        ...(priceFrom || priceTo) && {
          price: {
            ...(priceFrom && { [Op.gte]: priceFrom }),
            ...(priceTo && { [Op.lte]: priceTo })
          }
        }
      });
    }
  }
  return where;
}

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
