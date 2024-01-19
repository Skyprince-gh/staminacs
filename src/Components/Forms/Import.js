//this document is responsible for importing files.

import styled from "styled-components";
import ReactDOM from "react-dom";
import "animate.css";
import { Fragment, useState } from "react";
import Input from "../Inputs/Input";
import BtnPrimary from "../Buttons/Buttons";
import { Close, UploadFile } from "@mui/icons-material";
import * as XLSX from "xlsx";
import organizer from "../../util/xlsxOrganizer";
import convertCloverToStamina from "../../util/convertCloverToStamina";
import { useSelector, useDispatch } from "react-redux";
// import repackageCloverToStaminOnConfig from "../../util/repackageItemBasedOnCloverConfig";
import { actions as inventoryActions } from "../../store/inventory";
import { Convert_Dynamic_Files_To_Stamina as convertDynamicToStamina } from "../../util/convertDynamicToStamina";
import { writeBatch, doc } from "firebase/firestore";
import { db } from "../../util/firebase-store";

//This components renders the UI for importing CSV and XLSX files into stamina.
const ImportModal = (props) => {
  const dispatch = useDispatch(); //redux dispatcher
  const user = useSelector((state) => state.auth.userAuthCred); //store user authentication creadentials
  const [filesAwaitingUpload, setFilesAwaitingUpload] = useState([]); //stores all the files awaiting upload before they are placed in local storage
  const [fileName, setFileName] = useState(""); //store the file name when it is uploaded.
  const [modifierGroups, setModifierGroups] = useState({}); //stores all the data for modifier groups in clover files
  const [categories, setCategories] = useState({}); //stores all the data for categories in clover files
  const [taxRates, setTaxRates] = useState({}); //stores all the data for tax rates in clover files
  const [instructions, setInstructions] = useState({}); //store the instructions for clover files.
  const [file, setFile] = useState(null);

  const downloadTemplate = () => {
    //download template via fetch protocol;
  };

  const templateOptions = [
    { name: "Clover", value: "clover" },
    { name: "Dynamic", value: "dynamic" },
  ]; //holds the values for the different template options. The template options are responsible for choosing whethere you want
  //to read files specific to clover or read them dynamically.

  const [currentTemplate, setCurrentTemplate] = useState("clover"); //holds the value for the current template.
  const [sheets, setSheets] = useState([]); //holds the name value of all the sheets that are contained in the xlsx file: for dynamic imports
  const [dynamicConfig, setDynamicConfig] = useState({}); // holds all the settings for reading data in dynamic file. How data from dynamic
  //file relates to stamina item data.

  //clover config object contains all the toggles that will decide wheather
  //a column or sheet should be included in the import process.
  const [cloverConfig, setCloverConfig] = useState({
    cloverID: true,
    name: true,
    alternateName: true,
    price: true,
    priceType: true,
    priceUnit: true,
    taxRates: true,
    cost: true,
    productCode: true,
    sku: true,
    quantity: true,
    labels: true,
    hidden: true,
    nonRevenueItem: true,
    tabs: {
      modifierGroups: true,
      categories: true,
      taxRates: true,
      instructions: true,
    },
  });

  //This variable contains all the properties that can be configured on the dynamic menu in an array.
  const properties = [
    "Name",
    "Alternate Name",
    "Quantity",
    "Price",
    "Pricing Type",
    "Cost",
    "Tax",
    "SKU",
    "Product Code",
    "Location",
    "Description",
    "Brand",
    "Year",
    "Country",
    "Import ID",
    "Discount",
    "Tags",
    "Category",
  ];

  //this function handles all the configurations for clover xlxs imports
  //It sets the config field and adds or removes columns and sheets based
  //on the config object.
  const handleCloverConfig = (event) => {
    const config = { ...cloverConfig };
    const name = event.target.name;
    config[name] = event.target.checked;
    console.log("config:", config);
    setCloverConfig(config);
  };

  //this function handles all the configurations for dynamic xlxs imports
  //It sets the config field and adds or removes columns and sheets based
  //on the config object.
  const handleDynamicConfig = (event) => {
    console.log("current config:", event.target.value);
    const name = event.target.name;
    const value = JSON.parse(event.target.value);
    // console.log("optgroup:", value);
    const obj = { ...dynamicConfig };
    obj[name] = value;
    setDynamicConfig(obj);
    console.log("object", obj);
  };

  //Handle template change simply sets which type of template the use
  //must use based on the options the user chooses.
  const handleTemplateChange = (event) => {
    const value = event.target.value;
    console.log("template: ", value);
    setCurrentTemplate(value);

    if (file) {
      ReadFiles(file, value);
    }
  };

  //This function is responsible for reading the file object
  const ReadFiles = (files, template) => {
    if (template === "clover") {
      //check clover validity
      Reader(files, 0, (result) => {
        const conv = convertCloverToStamina(result); /// converts the result of the binary file read into stamina data
        setFilesAwaitingUpload(conv); //stores the converted files so thiey can be uploaded one at a time
      });

      readOtherSheets(files); // passed the file which has been read so other sheets in the file can be read.
    } else if (template === "dynamic") {
      ReadWorkbook(files, (workbook) => {
        //reads the workbook and return the sheetnames in a callback
        console.log(workbook.SheetNames);
        //get the names of the sheets and then display them on the menu.
        const s_names = workbook.SheetNames; //sheet names stored in an array
        const org_sheets = s_names.map((name) => {
          const ws = workbook.Sheets[name];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          // console.log("data:", data);
          const org_data = organizer(data);
          // console.log(org_data);
          return { name, data: org_data };
        });
        //with their corresponding columns of each sheet and then display that too.
        setSheets(org_sheets); //store the sheet names in an organized
        console.log(org_sheets);
      });
    }
  };

  //This function handles the drag and drop feature of the import modal.
  const handleDrop = (event) => {
    event.preventDefault();
    setFileName(event.dataTransfer.files[0].name);
    ReadFiles(event.dataTransfer.files[0], currentTemplate);
    setFile(event.dataTransfer.files[0]);
  };

  //When a file is selected using the choose file button this function handles it
  const handleFileSelect = (event) => {
    event.preventDefault();
    setFileName(event.target.files[0].name); //get the name of the file and store it in the fileName variable
    setFile(event.target.files[0]);
    ReadFiles(event.target.files[0], currentTemplate);
  };

  const ReadWorkbook = (file, func) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const bstr = event.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });

      const wsnames = wb.SheetNames;
      // console.log("sheetNames:", wsnames);
      func(wb);
    };

    reader.readAsBinaryString(file);
  };

  const Reader = (file, number, func) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const bstr = event.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });

      const wsname = wb.SheetNames[number];
      if (wsname === "" || wsname === undefined || wsname === null) {
        // do nothing
        func("");
      } else {
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const org_data = organizer(data);
        // console.log("xlsx b4 clover:", data);
        func(org_data);
      }
    };

    reader.readAsBinaryString(file);
  };

  //The read other sheets function reads the data from other sheets and stores them.
  //This function is specific to clover files
  const readOtherSheets = (file) => {
    Reader(file, 1, (result) => {
      setModifierGroups(result);
    });

    Reader(file, 2, (result) => {
      setCategories(result);
    });

    Reader(file, 3, (result) => {
      setTaxRates(result);
    });

    Reader(file, 4, (result) => {
      if (result === "") {
        setInstructions(false); // sets the instrunction to false if it is not inclued in the sheets
      } else {
        setInstructions(result); //sets instructions to the data contained within the instructions sheet.
      }
    });
  };

  //handle upload for clover file function uploads data to firebase
  const handleUploadForCloverFile = (event) => {
    //this function handles file uploads for clover files only.
    event.preventDefault();
    console.log("hello");
    //store the data from extra clover sheets seperately.
    Uploader(filesAwaitingUpload, "Users", user.uid, "Inventory");
    //toggle uploader
    // props.toggleUploadProgress();
    console.log("toggle import menu");
    props.toggle(event);
  };

  const handleUploadForDynamicFile = (event) => {
    event.preventDefault();
    /* This gets all the data that has been stored and then use the dynamic config
     * file to search sheets and columns in the sheets variable to create stamina item objects for the
     * inventory.
     */
    //This utitlity function converts all the data read from the sheets and then converts them
    //to stamina item objects and returns the data in an array.
    const staminaItems = convertDynamicToStamina(
      sheets,
      dynamicConfig,
      properties
    );
    //iterates through the data returned and then uploads them in batches.
    Uploader(staminaItems, "Users", user.uid, "Inventory");

    //toggle uploader
    // props.toggleUploadProgress();
    console.log("toggle import menu");
    props.toggle(event);
  };

  const Uploader = async (data, ...path) => {
    console.log(...path);

    const obj = { "000": "" };

    data.forEach((document) => {
      obj[`${document.id}`] = {
        name: document.name,
        altName: document.altName,
        id: document.id,
        productCode: document.productCode,
        description: document.description,
      };
    });

    console.log("imported index list:", obj);
    sessionStorage.setItem("search Indexes", JSON.stringify(obj));

    const splitVal = ArraySplitter(data, 300); //value returned after splitting the array.
    console.log("splitVal", splitVal);

    splitVal.forEach((segArr) => {
      const batch = writeBatch(db);

      segArr.forEach((data) => {
        const pathRef = doc(db, ...path, data.id);
        batch.set(pathRef, data);
        // console.log("path Reference:", pathRef);
      });

      batch.commit();
    });

    const sliced = data.slice(0, 100);
    dispatch(inventoryActions.importItems(sliced));
    dispatch(inventoryActions.seBulkEditUpdateCounter());
  };

  const ArraySplitter = (arr, limit) => {
    const arrLength = arr.length;
    if (arr.length > limit) {
      const result = [];
      let currentChunk = [];

      arr.forEach((element, index) => {
        currentChunk.push(element);

        if (currentChunk.length === limit || index === arr.length - 1) {
          result.push(currentChunk);
          currentChunk = [];
        }
      });

      return result;
    } else {
      return [arr];
    }
  };

  return (
    <div className="container">
      <div className="close-div" onClick={props.toggle}></div>
      <Grid className="animate__animated animate__fadeInDown">
        <span id="close" onClick={props.toggle}>
         <Close/>
        </span>
        <h3>Import Inventory</h3>
        <div id="main">
          <div id="left">
            <label
              htmlFor="file"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {fileName.trim().length != 0 && (
                <p className="fileName">{fileName}</p>
              )}
              {!fileName.trim().length > 0 && (
                <Fragment>
                  <p>Drag & Drop or</p>
                  <p>Choose File</p>
                  {currentTemplate === "dynamic" && (
                    <p>import .xlsx or csv file</p>
                  )}
                  {currentTemplate === "clover" && (
                    <p>import .xlsx files only</p>
                  )}
                  <p>Maximum size: 10MB</p>
                </Fragment>
              )}
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileSelect}
              multiple={false}
            />
            {/* <p className="extra">
            Not sure how to import?{" "}
            <span className="blue" onClick={downloadTemplate}>
              Download Template
            </span>
          </p> */}
          </div>
          <div id="right">
            <div className="first">
              <Input
                label="Template Type"
                options={templateOptions}
                type="select"
                width={300}
                onChange={handleTemplateChange}
              />
            </div>
            <div className="second">
              <Input
                label="Template Type"
                options={templateOptions}
                type="select"
                width={200}
                onChange={handleTemplateChange}
              />
            </div>

            {currentTemplate === "clover" && (
              <div className="options">
                <ul>
                  <li>
                    <Input
                      type="checkbox"
                      name="cloverID"
                      value={cloverConfig.cloverID}
                      onChecked={handleCloverConfig}
                    />{" "}
                    <span>Clover ID</span>
                  </li>

                  <li>
                    <Input
                      type="checkbox"
                      name="name"
                      value={cloverConfig.name}
                      onChecked={handleCloverConfig}
                    />{" "}
                    <span>Name</span>
                  </li>

                  <li>
                    <Input
                      type="checkbox"
                      name="alternateName"
                      value={cloverConfig.alternateName}
                      onChecked={handleCloverConfig}
                    />{" "}
                    <span>Alternate Name</span>
                  </li>

                  <li>
                    <Input
                      type="checkbox"
                      name="price"
                      value={cloverConfig.price}
                      onChecked={handleCloverConfig}
                    />{" "}
                    <span>Price</span>
                  </li>

                  <li>
                    <Input
                      type="checkbox"
                      name="priceType"
                      value={cloverConfig.priceType}
                      onChecked={handleCloverConfig}
                    />{" "}
                    <span>Price Type</span>
                  </li>

                  <li>
                    <Input
                      type="checkbox"
                      name="priceUnit"
                      value={cloverConfig.priceUnit}
                      onChecked={handleCloverConfig}
                    />{" "}
                    <span>Price Unit</span>
                  </li>

                  <li>
                    <Input
                      type="checkbox"
                      name="taxRates"
                      value={cloverConfig.taxRates}
                      onChecked={handleCloverConfig}
                    />{" "}
                    <span>Tax Rates</span>
                  </li>

                  <li>
                    <Input
                      type="checkbox"
                      name="cost"
                      value={cloverConfig.cost}
                      onChecked={handleCloverConfig}
                    />{" "}
                    <span>Cost</span>
                  </li>

                  <li>
                    <Input
                      type="checkbox"
                      name="productCode"
                      value={cloverConfig.productCode}
                      onChecked={handleCloverConfig}
                    />{" "}
                    <span>Product Code</span>
                  </li>

                  <li>
                    <Input
                      type="checkbox"
                      name="sku"
                      value={cloverConfig.sku}
                      onChecked={handleCloverConfig}
                    />{" "}
                    <span>SKU</span>
                  </li>

                  <li>
                    <Input
                      type="checkbox"
                      name="modifierGroups"
                      value={cloverConfig.modifierGroups}
                      onChecked={handleCloverConfig}
                    />{" "}
                    <span>Modifier Groups</span>
                  </li>

                  <li>
                    <Input
                      type="checkbox"
                      name="quantity"
                      value={cloverConfig.quantity}
                      onChecked={handleCloverConfig}
                    />{" "}
                    <span>Quantity</span>
                  </li>

                  <li>
                    <Input
                      type="checkbox"
                      name="labels"
                      value={cloverConfig.labels}
                      onChecked={handleCloverConfig}
                    />{" "}
                    <span>Labels</span>
                  </li>

                  <li>
                    <Input
                      type="checkbox"
                      name="hidden"
                      value={cloverConfig.hidden}
                      onChecked={handleCloverConfig}
                    />{" "}
                    <span>Hidden</span>
                  </li>

                  <li>
                    <Input
                      type="checkbox"
                      name="nonRevenueItem"
                      value={cloverConfig.nonRevenueItem}
                      onChecked={handleCloverConfig}
                    />{" "}
                    <span>Non Revenue Item</span>
                  </li>
                  <div className="worksheets">
                    <h4>Worksheets</h4>
                    <li>
                      <Input
                        type="checkbox"
                        name="modifierGroups"
                        value={cloverConfig.tabs.modifierGroups}
                        onChecked={handleCloverConfig}
                      />{" "}
                      <span>Modifier Groups</span>
                    </li>
                    <li>
                      <Input
                        type="checkbox"
                        name="categories"
                        value={cloverConfig.tabs.categories}
                        onChecked={handleCloverConfig}
                      />{" "}
                      <span>Categories</span>
                    </li>
                    <li>
                      <Input
                        type="checkbox"
                        name="taxRates"
                        value={cloverConfig.tabs.taxRates}
                        onChecked={handleCloverConfig}
                      />{" "}
                      <span>Tax Rates</span>
                    </li>
                  </div>
                </ul>
              </div>
            )}

            {currentTemplate === "dynamic" && (
              <div className="options">
                <ul className="dynamic_opts">
                  {properties.map((property, index) => {
                    return (
                      <li key={index + property}>
                        <Input
                          type="select_group"
                          name={property}
                          onChange={handleDynamicConfig}
                          width={300}
                          label={property}
                        >
                          {sheets.map((sheet, index) => {
                            return (
                              <optgroup
                                // value={sheet}
                                key={sheet + index}
                                label={sheet.name}
                              >
                                {Object.keys(sheet.data).map((key, index) => (
                                  <option
                                    value={JSON.stringify({
                                      name: sheet.name,
                                      value: key,
                                    })}
                                    key={key + index}
                                  >
                                    {key}
                                  </option>
                                ))}
                              </optgroup>
                            );
                          })}
                        </Input>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {fileName.length === 0 && currentTemplate === "dynamic" && (
              <p>
                <b> Upload A file to Generate Dynamic Menu</b>
              </p>
            )}
            {fileName.length > 0 && (
              <div className="button">
                {currentTemplate === "clover" && (
                  <BtnPrimary width="7rem" onClick={handleUploadForCloverFile}>
                    Upload <UploadFile />{" "}
                  </BtnPrimary>
                )}

                {currentTemplate === "dynamic" && (
                  <BtnPrimary width="7rem" onClick={handleUploadForDynamicFile}>
                    Upload <UploadFile />{" "}
                  </BtnPrimary>
                )}
              </div>
            )}
          </div>
        </div>
      </Grid>
    </div>
  );
};

const Import = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <ImportModal
          toggleUploadProgress={props.toggleUploadProgress}
          toggle={props.toggle}
        />,
        document.getElementById("backdrop-root")
      )}
    </Fragment>
  );
};

export default Import;

const Grid = styled.form`
  width: 60%;
  min-height: 100px;
  height: 60%;
  background: white;
  box-shadow: 5px 5px 10px var(--shadow-color);
  border-radius: 10px;
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 20px;
  position: relative;
  z-index: 2;

  @media (max-width: 1600px) {
    width: 70%;
  }
  @media (max-width: 1200px) {
    width: 80%;
  }
  @media (max-width: 1000px) {
    width: 90%;
  }
  @media (max-width: 800px) {
    width: calc(100% - 20px);
    height: 80%;
  }

  h3 {
    margin: 20px 0 5px 0px;
    width: fit-content;
    height: 5vh;
    background: var(--primary-black);
    color: white;
    border-radius: 0 25px 25px 0;
    font-size: 1.7rem;
    font-weight: bold;
    position: relative;
    left: -20px;
    padding: 0 20px;
  }

  #main {
    display: flex;
    min-height: 10vh;
    justify-content: space-between;
    height: calc(100% - 15vh);

    @media (max-width: 800px) {
      flex-direction: column;
    }

    #right {
      width: 40%;
      display: flex;
      flex-direction: column;

      .second {
        display: none;
      }

      @media (max-width: 1200px) {
        width: 60%;
      }
      @media (max-width: 800px) {
        width: 90%;
        /* align-items: center; */

        .second {
          display: block;
        }

        .first {
          display: none;
        }
      }
      @media (max-width: 600px) {
        width: 100%;
      }

      .options {
        width: 70%;
        min-width: 15rem;
        max-height: 25rem;
        overflow-y: scroll;
        margin-top: 2rem;
        margin-bottom: 2rem;
        box-shadow: inset var(--shadow-color2) 1px 5px 15px;
        border: solid black 0.5px;
        border-radius: 5px;

        @media (max-width: 800px) {
          width: calc(100% - 20px);
        }

        .clover,
        .dynamic {
        }

        .dynamic_opts {
          li {
            margin-left: 1rem;
          }
        }

        ul > li,
        ul > div > li {
          display: flex;
          align-items: center;
          margin: 20px 0px;
          span {
            margin-left: 20px;
          }
        }
      }

      div.button {
        display: flex;
        justify-content: flex-end;
        width: 50%;
        min-width: 15rem;
      }
    }

    #left {
      width: 40%;
      display: flex;
      align-items: center;

      @media (max-width: 800px) {
        width: 90%;
      }

      p.extra {
        width: 100%;

        span {
          color: #03a4ff;
        }
      }

      label {
        width: 15rem;
        height: 15rem;
        border: dashed 3px var(--primary-black);
        text-align: center;
        background: white;
        border-radius: 15px;
        padding: 2rem;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        margin-bottom: 4rem;
        justify-content: center;

        @media (max-width: 1200px) {
          width: 200px;
          height: 200px;
        }

        @media (max-width: 800px) {
          width: 400px;
          height: 200px;
        }

        &:hover {
          background: var(--primary-bkg-fade);
          border: double 10px var(--primary-black);
        }

        p {
          margin-bottom: 2rem;
          width: 100%;
        }
        p:first-child {
          width: 7rem;
        }

        p:nth-child(2) {
          color: #03a4ff;
        }
      }

      input[type="file"] {
        display: none;
      }
    }
  }

  #close {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 1.3rem;
    border: solid 1px var(--primary-black);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      color: var(--primary-yellow);
    }
    &:active {
      color: var(--primary-black);
    }
  }
`;
