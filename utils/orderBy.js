const {literal} = require("sequelize");

const orderBy = {
    "newest": [['createdAt', 'DESC']],
    "low-high": [[literal('COALESCE(discont_price, price)'), 'ASC']],
    "high-low": [[literal('COALESCE(discont_price, price)'), 'DESC']],
    "default": [['createdAt', 'DESC']],
};

module.exports = orderBy;
