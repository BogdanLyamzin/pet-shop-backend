const parseNumber = (value) => {
  if (typeof value !== "string") return;

  const parsedNumber = parseInt(value);
  if (Number.isNaN(parsedNumber)) return;

  return parsedNumber;
};

const parseProductsFilterParams = ({ priceFrom, priceTo }) => {
  const parsedPriceFrom = parseNumber(priceFrom);
  const parsedPriceTo = parseNumber(priceTo);

  return {
    priceFrom: parsedPriceFrom,
    priceTo: parsedPriceTo,
  };
};

module.exports = parseProductsFilterParams;
