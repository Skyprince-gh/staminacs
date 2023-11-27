import FormDataObject from "./Data-Objects/formDataObject";
import { v4 as uuid } from "uuid";

const convertCloverToStamina = (organized_Clover_Data, sheets) => {
  const itemsArr = [];
  //insert image
  const batchID = uuid();

  organized_Clover_Data.Name.forEach((name) => {
    const item = new FormDataObject();
    item.name = name;
    itemsArr.push({ ...item, importID: batchID, imported: true });
  });

  //alternate name
  organized_Clover_Data["Alternate Name"].forEach((altName, index) => {
    itemsArr[index].altName = altName;
  });

  //quantity
  organized_Clover_Data["Quantity"].forEach((quantity, index) => {
    itemsArr[index].quantity = quantity;
  });

  //cloverID
  organized_Clover_Data["Clover ID"].forEach((cloverID, index) => {
    itemsArr[index].extras = { cloverID };
  });

  //Price
  organized_Clover_Data["Price"].forEach((price, index) => {
    itemsArr[index].price = price;
  });

  //Price Type
  organized_Clover_Data["Price Type"].forEach((priceType, index) => {
    itemsArr[index].pricingType = priceType;
  });

  //Price Unit
  organized_Clover_Data["Price Unit"].forEach((priceUnit, index) => {
    const extras = { ...itemsArr[index].extras };
    itemsArr[index].extras = { ...extras, priceUnit };
  });

  //Cost
  organized_Clover_Data["Cost"].forEach((cost, index) => {
    itemsArr[index].cost = cost;
  });

  //SKU
  organized_Clover_Data["SKU"].forEach((sku, index) => {
    itemsArr[index].sku = sku;
  });

  //Product Code
  organized_Clover_Data["Product Code"].forEach((productCode, index) => {
    itemsArr[index].productCode = +productCode;
  });

  //Labels
  organized_Clover_Data["Labels"].forEach((label, index) => {
    itemsArr[index].category = label.toLowerCase();
  });

  //Hidden
  organized_Clover_Data["Hidden"].forEach((hidden, index) => {
    const extras = { ...itemsArr[index].extras };
    itemsArr[index].extras = { ...extras, hidden: hidden };
  });

  //Modifier Groups
  organized_Clover_Data["Modifier Groups"].forEach((modifierGroup, index) => {
    const extras = { ...itemsArr[index].extras };
    itemsArr[index].extras = { ...extras, modifierGroup: modifierGroup };
  });

  //Non Revenue Item
  organized_Clover_Data["Non-revenue item"].forEach((nri, index) => {
    const extras = { ...itemsArr[index].extras };
    itemsArr[index].extras = { ...extras, nonRevenueItem: nri };
  });

  // console.log("items array:",itemsArr);
  return itemsArr;
};

export default convertCloverToStamina;
