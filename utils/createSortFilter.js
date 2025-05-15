const {Op} = require("sequelize");

const createSortFilter = ({priceFrom, priceTo, discont}) => {
    const where = {};
    if(!priceFrom && !priceTo && !discont) return where;
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

module.exports = createSortFilter;
