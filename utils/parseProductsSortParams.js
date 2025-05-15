const sortList = ["newest", "high-low", "low-high"];

const parseProductsSortParams = ({ priceFrom, priceTo }) => {
    const parsedPriceFrom = parseNumber(priceFrom);
    const parsedPriceTo = parseNumber(priceTo);
  
    return {
      priceFrom: parsedPriceFrom,
      priceTo: parsedPriceTo,
    };
  };
  
  module.exports = parseProductsSortParams;
  