//this function is responsible for reading property names that have been altered due to the apps 
//processes and then return the correct property name that corresponds to that of the form object.

export const RETURN_PROPERTY_NAMES_FROM_STRING = (string) => {
  if (string === "Name") {
    return "name";
  }
  if (string === "Alternate Name") {
    return "altName";
  }
  if (string === "Quantity") {
    return "quantity";
  }
  if (string === "Price") {
    return "price";
  }
  if (string === "Pricing Type") {
    return "pricingType";
  }
  if (string === "Cost") {
    return "cost";
  }
  if (string === "Tax") {
    return "tax";
  }
  if (string === "SKU") {
    return "sku";
  }
  if (string === "Product Code") {
    return "productCode";
  }
  if (string === "Location") {
    return "location";
  }
  if (string === "Product is Active") {
    return "isActive";
  }
  if (string === "Track") {
    return "track";
  }
  if (string === "Description") {
    return "description";
  }
  if (string === "Brand") {
    return "brand";
  }
  if (string === "Year") {
    return "year";
  }
  if (string === "Country") {
    return "country";
  }
  if (string === "Import ID") {
    return "importID";
  }
  if (string === "Discount") {
    return "discount";
  }
  if (string === "Tags") {
    return "tags";
  }
  if (string === "Category") {
    return "category";
  }
};

export default RETURN_PROPERTY_NAMES_FROM_STRING;
