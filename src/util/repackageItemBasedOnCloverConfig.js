const repackageCloverToStaminOnConfig = (item, config) => {
  return {
    ...item,
    altName: config.alternateName ? item.altName : "",
    name: config.name ? item.name : "",
    price: config.price ? item.price : "",
    pricingType: config.priceType ? item.pricingType : "",
    tax: config.taxRates ? item.tax : 0,
    cost: config.cost ? item.cost : "",
    productCode: config.productCode ? item.productCode : "",
    sku: config.sku ? item.sku : "",
    quantity: config.quantity ? item.quantity : "",
    tags: config.labels ? item.tags : [],
    imported:true,
    extras: {
      ...item.extras,
      cloverID: config.cloverID ? item.extras.cloverID : "",
      modifierGroup: config.tabs.modifierGroups
        ? item.extras.modifierGroup
        : "",
      hidden: config.hidden ? item.extras.hidden : "",
      nonRevenueItem: config.nonRevenueItem ? item.extras.nonRevenueItem : "",
    },
  };
};

export default repackageCloverToStaminOnConfig;
