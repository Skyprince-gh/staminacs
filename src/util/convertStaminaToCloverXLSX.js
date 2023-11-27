import FormDataObject from "./Data-Objects/formDataObject";
import { v4 as uuid } from "uuid";
import * as XLSX from "xlsx";
import capitalizeString from "capitalize-string";

export const CloverConversion = (items) => {
  var workbook = XLSX.utils.book_new();
  const sheetArray = items.map((item) => {
    return {
      "Clover ID": "",
      Name: item.name,
      "Alternate Name": item.altnName,
      Price: item.price === 0 ? "" : item.price,
      "Price Type": item.pricingType,
      "Price Unit": "",
      "Tax Rates": "DEFAULT",
      Cost: item.cost === 0 ? "" : item.cost,
      "Product Code": item.productCode === 0 ? "" : item.productCode,
      SKU: item.sku,
      "Modifier Groups": "",
      Quantity: item.quantity,
      Labels: item.category.toUpperCase(),
      Hidden: "No",
      "Non-revenue item": "No",
    };
  });

  const itemsSheet = XLSX.utils.json_to_sheet(sheetArray, {
    header: [
      "Clover ID",
      "Name",
      "Alternate Name",
      "Price",
      "Price Type",
      "Price Unit",
      "Tax Rates",
      "Cost",
      "Product Code",
      "SKU",
      "Modifier Groups",
      "Quantity",
      "Labels",
      "Hidden",
      "Non-revenue item",
    ],
  });

  const [rows, headers] = organizeCategories(items);
  const modifierGroupsSheet = XLSX.utils.json_to_sheet(
    [
      {
        "Modifier Group Name": "",
        "Pop-up Automatically": "",
        Modifier: "",
        Price: "",
      },
    ],
    {
      header: [
        "Modifier Group Name",
        "Pop-up Automatically",
        "Modifier",
        "Price",
      ],
    }
  );
  const categoriesSheet = XLSX.utils.json_to_sheet(rows, { header: headers });
  const taxRatesSheet = XLSX.utils.json_to_sheet(
    [
      { Name: "Sales Tax", "Tax Rate": "0%", Default: "Yes" },
      { Name: "Tax 2", "Tax Rate": "0%", Default: "No" },
      { Name: "Tax 3", "Tax Rate": "0%", Default: "No" },
    ],
    { header: ["Name", "Tax Rate", "Default"] }
  );

  const [title, instRows] = getInstructions();
  const instructionsSheets = XLSX.utils.json_to_sheet(instRows, {
    header: [title],
  });

  XLSX.utils.book_append_sheet(workbook, itemsSheet, "Items");
  XLSX.utils.book_append_sheet(
    workbook,
    modifierGroupsSheet,
    "Modifier Groups"
  );

  XLSX.utils.book_append_sheet(workbook, categoriesSheet, "Categories");
  XLSX.utils.book_append_sheet(workbook, taxRatesSheet, "Tax Rates");
  XLSX.utils.book_append_sheet(workbook, instructionsSheets, "Instructions");

  return workbook;
};

export default CloverConversion;

const organizeCategories = (items) => {
  //Build the header array.
  const headerObj = { "Category Name": "" };
  items.forEach((item) => {
    headerObj[`${capitalizeString(item.category)}`] = "";
  });

  const headerArr = Object.keys(headerObj);
  // console.log(">>>:", headerObj);

  //create an object and place each item inside the array with each item
  const obj = {};
  //category as a key and the value store in the array.
  items.forEach((item) => {
    obj[`${capitalizeString(item.category)}`] = {
      category: capitalizeString(item.category),
      itemsArr: [],
    };
  });

  items.forEach((item) => {
    obj[`${capitalizeString(item.category)}`].itemsArr.push(item.name);
  });

  const valuesArr = Object.values(obj);

  // //get the array that has the highest number of items in the object
  // //sort to the lowest item in the object.
  valuesArr.sort((a, b) => {
    if (a.itemsArr.length > b.itemsArr.length) {
      return -1;
    }
    if (a.itemsArr.length < b.itemsArr.length) {
      return 1;
    } else return 0;
  });

  const final = [];
  const l = valuesArr[0].itemsArr.length;

  valuesArr.forEach((object, index) => {
    if (index === 0) {
      for (let index = 0; index < l; index++) {
        const o = {};
        o[`${object.category}`] = object.itemsArr[index];
        final.push(o);
      }
    } else {
      for (let index = 0; index < l; index++) {
        final[index][`${object.category}`] = object.itemsArr[index] || "";
      }
    }
  });

  // console.log("valuesArr sorted:", valuesArr);
  final[0]["Category Name"] = "Items in Category";
  // console.log("final:", final);

  //build a new array of object for the sheet array using the one with the
  //highest number of item categories.
  //Build with the second highest.
  //THen a third.

  return [final, Object.keys(headerObj)];
};

const getInstructions = () => {
  const instHeaderTitle = `Use this template for fast, efficient setup of your inventory or menu. Enter your Items and their respective Categories, Modifier Groups (and modifiers),\nand applicable Taxes & Flat Fees. Included in each tab are examples—please clear those before you enter your information.\n\nBelow are terms used throughout the Clover system, with descriptions and additional details to help you fill out this template.`;
  const rowsArr = [
    "IMPORTANT:",
    "Do not enter spaces at the end of each entry (items, categories, etc).",
    "Be sure to close this spreadsheet on your computer before uploading to Clover; otherwise it will not upload properly.",
    "*Terms are listed in alphabetical order.",
    `Alternate Item Name: Alternate item names are useful for internal shorthand, or for employees who speak a different language. To display alternate instead\nof item names on your devices, go to: Setup app > Order Receipts and select "Use alternate inventory names."`,
    `Category Name: Add a category to group similar types of items; each category may contain multiple items. Categories display in the Register app for easy\nordering. To change the order of categories in Register, adjust the list in the Inventory app.`,
    `Clover ID: The ID number that Clover assigns to each new item. Leave this blank for new items that have not yet been uploaded to your inventory.`,
    `Cost: The wholesale cost of an item.`,
    `Labels: Labels serve two purposes: revenue reporting and order receipt printing. To set up order receipt printing, please see\nhttps://www.clover.com/us/en/help/set-up-a-kitchen-printer/`,
    `Modifiers: Something that modifies, enhances, or adds to your item. For example, a modifier for\n steak can be rare/medium/well done, while a modifier for ice cream can be sprinkles/nuts/bananas.`,
    `Name: A unique name for an item; every item must have a name. Enter up to 127 characters including letters, numbers, and spaces.`,
    `Non-revenue item: An item that is "sold" to a customer but does not generate revenue. Examples include giveaway items and passthrough sales on behalf of\n other vendors.`,
    `Price: The price you charge for the relevant item. If you plan to use variable pricing, you can leave this blank.`,
    `Price Type: Pricing structure for an item. Enter one of these options:"Fixed" (default), "Variable" (employees enter the price when they take the order), or\n"Per Unit" (typically used for items sold by weight). If you select "Per Unit," you will also need to specify the pricing unit.`,
    `Product Code: The universal product code (UPC) for this item. On merchandise, this code is a string of numbers and letters that appears in a line of text below\nthe barcode image.`,
    `Show in Register: This controls whether the item is displayed in the Register app. For example, you might hide seasonal items that are not available all year.`,
    `SKU: The stock keeping unit (SKU) code for an item.`,
    `Stock Quantity: The number of a given item currently in stock. By default, Clover tracks stock quantities for you. You can however adjust this setting if you're\nusing a third-party app to track your stock.`,
    `Taxes: The applicable tax rate/fee for an item.`,
  ];

  const rowsObj = rowsArr.map((row) => {
    const o = {};
    o[`${instHeaderTitle}`] = row;

    return o;
  });

  return [instHeaderTitle, rowsObj];
};

export const DynamicConversion = (items, dynamicConfig) => {
  //this function takes all the selected items in stamina and uses the dynamic configuration
  //object to create a xlsx or csv spreadsheet for the user
  var workbook = XLSX.utils.book_new();
  //check by for each property by order and priority if it exists for each object.
  const header = new Set();

  //this function fires if the dynamic configuration fille is empty
  if (JSON.stringify(dynamicConfig) === JSON.stringify({})) {
    const sheetArray = items.map((item) => {
      return {
        Name: item.name,
        "Alternate Name": item.altName,
        Price: item.price === 0 ? "" : item.price,
        "Price Type": item.pricingType,
        Cost: item.cost === 0 ? "" : item.cost,
        "Product Code": item.productCode === 0 ? "" : item.productCode,
        SKU: item.sku,
        Quantity: item.quantity,
        Labels: item.category.toUpperCase(),
      };
    });

    const itemsSheet = XLSX.utils.json_to_sheet(sheetArray, {
      header: [
        "Name",
        "Alternate Name",
        "Price",
        "Price Type",
        "Cost",
        "Product Code",
        "SKU",
        "Quantity",
        "Category",
      ],
    });

    XLSX.utils.book_append_sheet(workbook, itemsSheet, "Items");
    return workbook;
  }

  const sheetArr = items.map((item) => {
    const obj = {};
    if (dynamicConfig.hasOwnProperty("Name")) {
      obj[dynamicConfig["Name"]] = item.name;
      header.add(dynamicConfig["Name"]);
    }
    if (dynamicConfig.hasOwnProperty("Alternate Name")) {
      obj[dynamicConfig["Alternate Name"]] = item.altName;
      header.add(dynamicConfig["Alternate Name"]);
    }
    if (dynamicConfig.hasOwnProperty("Quantity")) {
      obj[dynamicConfig["Quantity"]] = item.quantity;
      header.add(dynamicConfig["Quantity"]);
    }
    if (dynamicConfig.hasOwnProperty("Price")) {
      obj[dynamicConfig["Price"]] = item.price;
      header.add(dynamicConfig["Price"]);
    }
    if (dynamicConfig.hasOwnProperty("Pricing Type")) {
      obj[dynamicConfig["Pricing Type"]] = item.pricingType;
      header.add(dynamicConfig["Pricing Type"]);
    }
    if (dynamicConfig.hasOwnProperty("Cost")) {
      obj[dynamicConfig["Cost"]] = item.cost;
      header.add(dynamicConfig["Cost"]);
    }
    if (dynamicConfig.hasOwnProperty("Tax")) {
      obj[dynamicConfig["Tax"]] = item.tax;
      header.add(dynamicConfig["Tax"]);
    }
    if (dynamicConfig.hasOwnProperty("SKU")) {
      obj[dynamicConfig["SKU"]] = item.sku;
      header.add(dynamicConfig["SKU"]);
    }
    if (dynamicConfig.hasOwnProperty("Product Code")) {
      obj[dynamicConfig["Product Code"]] = item.productCode;
      header.add(dynamicConfig["Product Code"]);
    }
    if (dynamicConfig.hasOwnProperty("Location")) {
      obj[dynamicConfig["Location"]] = item.location;
      header.add(dynamicConfig["Location"]);
    }
    if (dynamicConfig.hasOwnProperty("Description")) {
      obj[dynamicConfig["Description"]] = item.description;
      header.add(dynamicConfig["Description"]);
    }
    if (dynamicConfig.hasOwnProperty("Brand")) {
      obj[dynamicConfig["Brand"]] = item.brand;
      header.add(dynamicConfig["Brand"]);
    }
    if (dynamicConfig.hasOwnProperty("Year")) {
      obj[dynamicConfig["Year"]] = item.year;
      header.add(dynamicConfig["Year"]);
    }
    if (dynamicConfig.hasOwnProperty("Country")) {
      obj[dynamicConfig["Country"]] = item.country;
      header.add(dynamicConfig["Country"]);
    }
    if (dynamicConfig.hasOwnProperty("Import ID")) {
      obj[dynamicConfig["Import ID"]] = item.importID;
      header.add(dynamicConfig["Import ID"]);
    }
    if (dynamicConfig.hasOwnProperty("Discount")) {
      obj[dynamicConfig["Discount"]] = item.discount;
      header.add(dynamicConfig["Discount"]);
    }
    if (dynamicConfig.hasOwnProperty("Category")) {
      obj[dynamicConfig["Category"]] = item.category;
      header.add(dynamicConfig["Category"]);
    }

    return obj;
  });

  const itemsSheet = XLSX.utils.json_to_sheet(sheetArr, {
    header: [...header],
  });
  XLSX.utils.book_append_sheet(workbook, itemsSheet, "Items");
  return workbook;
};
