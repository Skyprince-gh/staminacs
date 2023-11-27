import { v4 as uuid } from "uuid";
import { Timestamp } from "firebase/firestore";

class FormDataObject {
  constructor() {}

  image = "";
  id = "ST" + uuid().slice(0, 8);
  name = "";
  altName = "";
  quantity = 0;
  price = 0;
  pricingType = "Variable";
  cost = 0;
  tax = 0;
  sku = "";
  productCode = "";
  location = "Online";
  isActive = false;
  track = false;
  description = "";
  brand = "";
  year = new Date().getFullYear();
  country = "Ghana";
  importID = "";
  discount = 0;
  tags = [];
  category = "General";
  imported = false;
  created = Timestamp.fromDate(new Date());
  lastModified = Timestamp.fromDate(new Date());
}

export default FormDataObject;
