const parseNumber = (value) => {
  if (typeof value !== "string") return;

  const parsedNumber = parseFloat(value);
  if (Number.isNaN(parsedNumber)) return;

  return parsedNumber;
};

const parseProductsFilterParams = ({ priceFrom, priceTo, discont }) => {
  const parsedPriceFrom = parseNumber(priceFrom);
  const parsedPriceTo = parseNumber(priceTo);
  const parsedDiscont = discont === "true";

  return {
    priceFrom: parsedPriceFrom,
    priceTo: parsedPriceTo,
    discont: parsedDiscont,
  };
};

module.exports = parseProductsFilterParams;
