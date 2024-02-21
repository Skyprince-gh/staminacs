import styled from "styled-components";
import ReactDOM from "react-dom";
import "animate.css";
import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../Inputs/Input";
import InputB from "../Inputs/InputB";
import BtnPrimary, { BtnDanger, BtnDisabled } from "../Buttons/Buttons";
import { Close, FileDownload } from "@mui/icons-material";
import * as XLSX from "xlsx";
import organizer from "../../util/xlsxOrganizer";
import { useSelector } from "react-redux";
import { setDocument } from "../../util/firebase-store";
import extractSelectedItems from "../../Pages/Dashboard/extractSelectedItems";
import {
  CloverConversion,
  DynamicConversion,
} from "../../util/convertStaminaToCloverXLSX";
import { v4 as uuid } from "uuid";

const ExportModal = (props) => {
  const [dynamicConfig, setDynamicConfig] = useState({ Name: "Name" });

  const selectedItemsIndexes = useSelector(
    (state) => state.inventory.itemsSelectedList
  );

  const [currentTemplate, setCurrentTemplate] = useState("clover");
  const [exportFormat, setExportFormat] = useState("xlsx");
  const items = useSelector((state) => state.inventory.items);
  const itemsSelectedList = useSelector(
    (state) => state.inventory.itemsSelectedList
  );
  const [fileSaveIsToggled, setFileSaveIsToggled] = useState(false);
  const [fileSaveTypeIsToggled, setFileSaveTypeIsToggled] = useState(false);
  const [fileName, setFileName] = useState("");
  const [
    errorDynamicConfigPromptIsToggled,
    setErrorDynamicConfigPromptIsToggled,
  ] = useState(false);

  const [userIsWarned, setUserIsWarned] = useState(false);

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
    "Category",
  ];

  const templateOptions = [
    { name: "Clover", value: "clover" },
    { name: "Dynamic", value: "dynamic" },
  ];

  const saveOptions = [
    { name: "XLSX", value: "xlsx" },
    { name: "CSV", value: "csv" },
  ];

  const handleDynamicConfig = (event) => {
    console.log("current config:", event.target.value);
    const name = event.target.name;
    const value = event.target.value;
    // console.log("optgroup:", value);
    const obj = { ...dynamicConfig };
    obj[name] = value;
    setDynamicConfig(obj);
    console.log("object", obj);
  };

  const toggleFileSave = (event) => {
    event.preventDefault();
    setFileSaveIsToggled(!fileSaveIsToggled);
  };

  const toggleSaveTypePrompt = (event) => {
    event.preventDefault();
    if (
      JSON.stringify(dynamicConfig) === JSON.stringify({}) &&
      userIsWarned === false
    ) {
      setErrorDynamicConfigPromptIsToggled(!errorDynamicConfigPromptIsToggled);
      setUserIsWarned(true);
      return;
    }
    if (
      JSON.stringify(dynamicConfig) === JSON.stringify({}) &&
      userIsWarned === true
    ) {
      setErrorDynamicConfigPromptIsToggled(!errorDynamicConfigPromptIsToggled);
      setUserIsWarned(true);
      return;
    }
    setFileSaveTypeIsToggled(!fileSaveTypeIsToggled);
  };

  const handleTemplateChange = (event) => {
    console.log("export template: ", event.target.value);
    setCurrentTemplate(event.target.value);
  };

  const handleFileSaveName = (event) => {
    setFileName(event.target.value);
  };

  const changeExportFormat = (event) => {
    setExportFormat(event.target.value);
  };

  const handleExport = (event) => {
    event.preventDefault();
    console.log("Items:", items);
    const selectedItems = extractSelectedItems(selectedItemsIndexes, [
      ...items,
    ]);
    console.log("selected items:", selectedItems);
    let workbook = null;

    if (currentTemplate === "clover") {
      workbook = CloverConversion(selectedItems);
    } else if (currentTemplate === "dynamic") {
      workbook = DynamicConversion(selectedItems, dynamicConfig);
    }

    console.log("export format:", exportFormat);
    XLSX.writeFile(
      workbook,
      fileName.length === 0
        ? `${uuid()}.${exportFormat}`
        : `${fileName}.${exportFormat}`
    );

    if (currentTemplate === "clover") {
      toggleFileSave(event);
    } else if (currentTemplate === "dynamic") {
      toggleSaveTypePrompt(event);
    }

    props.toggle(event);
  };

  const continueWithoutFields = (event) => {
    event.preventDefault();
    const selectedItems = extractSelectedItems(selectedItemsIndexes, [
      ...items,
    ]);

    setErrorDynamicConfigPromptIsToggled(false);
    setFileSaveTypeIsToggled(true);
  };

  return (
    <div className="container">
      <div className="close-div" onClick={props.toggle}></div>
      <Grid className="animate__animated animate__fadeInDown">
        <span id="close" onClick={props.toggle}>
          <Close />
        </span>
        <h3>Export Inventory</h3>

        <div className="main">
          <div className="bar">
            {itemsSelectedList.length > 0 && (
              <b>
                You want to export {itemsSelectedList.length}{" "}
                {itemsSelectedList.length > 1 ? "items" : "item"}
              </b>
            )}
            {itemsSelectedList.length === 0 && <b>No items Selected</b>}
            <Input
              label="Template Type"
              type="select"
              onChange={handleTemplateChange}
              width={300}
              options={templateOptions}
            />
          </div>

          {currentTemplate === "clover" && (
            <div className="list">
              <ul>
                {itemsSelectedList.map((selected) => {
                  let i = "";
                  items.forEach((item, index) => {
                    if (item.id === selected) {
                      i = (
                        <li key={item.id + index}>
                          {item.id} {item.name}
                        </li>
                      );
                    }
                  });
                  return i;
                })}
              </ul>
            </div>
          )}

          {currentTemplate === "dynamic" && (
            <div className="dynamic">
              <div className="list">
                <ul>
                  {itemsSelectedList.map((selected) => {
                    let i = "";
                    items.forEach((item, index) => {
                      if (item.id === selected) {
                        i = (
                          <li key={item.id + index}>
                            {item.id} {item.name}
                          </li>
                        );
                      }
                    });
                    return i;
                  })}
                </ul>
              </div>

              <div className="right list">
                {properties.map((property, index) => {
                  return (
                    <div className="rel">
                      <InputB
                        label={property}
                        type="text"
                        width="90%"
                        name={property}
                        onChange={handleDynamicConfig}
                        value={dynamicConfig[property] || ""}
                        key={index}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="export">
            {itemsSelectedList.length > 0 && currentTemplate === "clover" && (
              <BtnPrimary width="8rem" onClick={toggleFileSave}>
                <span>Export</span> <FileDownload />
              </BtnPrimary>
            )}
            {itemsSelectedList.length > 0 && currentTemplate === "dynamic" && (
              <BtnPrimary width="8rem" onClick={toggleSaveTypePrompt}>
                <span>Export</span> <FileDownload />
              </BtnPrimary>
            )}
            {itemsSelectedList.length === 0 && (
              <BtnDisabled width="8rem" disabled={true}>
                <span>{"Export  "}</span> <FileDownload />
              </BtnDisabled>
            )}
          </div>
        </div>

        {fileSaveIsToggled && (
          <FileSavePrompt>
            <div className="animate__animated animate__fadeInDown">
              <h5>Save as *.xlsx</h5>
              <div className="inputs">
                <input
                  type="text"
                  value={fileName}
                  onChange={handleFileSaveName}
                />
                <BtnPrimary width="5rem" onClick={handleExport}>
                  Save
                </BtnPrimary>
                <BtnDanger width="7rem" onClick={toggleFileSave}>
                  Cancel
                </BtnDanger>
              </div>
            </div>
          </FileSavePrompt>
        )}
      </Grid>
      {fileSaveTypeIsToggled && (
        <div className="container">
          <SaveTypePrompt>
            <p>Choose File Save Type:</p>
            <InputB
              type="text"
              onChange={handleFileSaveName}
              options={saveOptions}
              label="File Name"
              value={fileName}
              width={300}
            />
            <Input
              type="select"
              onChange={changeExportFormat}
              options={saveOptions}
              label="format"
              width={150}
            />

            <div className="buttons">
              <BtnDanger
                width="5rem"
                onClick={(e) => setFileSaveTypeIsToggled(false)}
              >
                Cancel
              </BtnDanger>
              <BtnPrimary width="5rem" onClick={handleExport}>
                Save
              </BtnPrimary>
            </div>
          </SaveTypePrompt>
        </div>
      )}

      {errorDynamicConfigPromptIsToggled && (
        <div className="container">
          <ErrorDynamicConfigPrompt>
            <p>
              You have not named any of the fields in the Configuration Section
            </p>
            <p>
              This will result in the default template being used. Do you want
              to proceed?
            </p>

            <div className="buttons">
              <BtnDanger
                width="5rem"
                onClick={(e) => setErrorDynamicConfigPromptIsToggled(false)}
              >
                Cancel
              </BtnDanger>
              <BtnPrimary width="6rem" onClick={continueWithoutFields}>
                Continue
              </BtnPrimary>
            </div>
          </ErrorDynamicConfigPrompt>
        </div>
      )}
    </div>
  );
};

const Export = (props) => {
  const navigate = useNavigate();

  const handleMoreInfo = (event) => {
    event.preventDefault();
    props.toggle(event);
    navigate("/dashboard/inventory/add-item");
  };

  return (
    <Fragment>
      {ReactDOM.createPortal(
        <ExportModal handleMoreInfo={handleMoreInfo} toggle={props.toggle} />,
        document.getElementById("backdrop-root")
      )}
    </Fragment>
  );
};

export default Export;

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
    width: 100%;
    height: 100%;
    overflow-y: scroll;
  }

  h3 {
    margin: 20px 0px;
    width: fit-content;
    padding: 0 20px;
    border-radius: 0 25px 25px 0;
    height: 50px;
    font-size: 1.6rem;
    color: white;
    background: var(--primary-black);
    position: relative;
    left: -20px;
    font-weight: bold;

    @media (max-width: 350px) {
      font-size: 14px;
      height: 30px;
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

  .main {
    /* * {
      border: solid 1px green;
    } */
    width: 100%;
    height: 60%;
    margin: 0 auto;

    .bar {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      flex-wrap: wrap;

      @media (max-width: 1200px) {
        b {
          font-size: 14px;
        }
      }
      @media (max-width: 600px) {
        height: 100px;
      }
    }

    p {
      margin-bottom: 20px;
    }

    .dynamic {
      height: 90%;
      display: flex;
      justify-content: space-between;

      .list {
        height: 100%;
        width: 65%;
        min-width: 500px;
      }

      .right {
        width: 30%;
        min-width: 300px;
        display: flex;
        align-items: center;
        flex-direction: column;
        .rel {
          margin: 10px 0px;
          width: 100%;
        }
      }
    }
    .list {
      width: 100%;
      border: solid 1px var(--primary-black);
      height: 90%;
      box-shadow: inset 5px 5px 10px var(--shadow-color);
      overflow-y: scroll;
      padding: 5px;
      font-weight: bold;

      ul {
        li {
          display: flex;
          margin: 0px 0px 20px 0px;
        }
        list-style-type: none;
        margin-top: 20px;
      }
    }

    div.export {
      margin-top: 50px;
      margin-left: calc(100% - 8rem);
      /* border: 1px green solid; */
    }
  }
`;

const FileSavePrompt = styled.div`
  width: 100%;
  height: 100%;
  background: var(--primary-bkg-fade);

  position: absolute;
  top: 0px;
  left: 0px;

  display: flex;
  justify-content: center;
  align-items: center;

  div {
    width: 50%;
    height: 6rem;
    background: var(--primary-grey);
    padding: 10px;
    border-radius: 0.8rem;

    h5 {
      font-size: 1rem;
      height: 20%;
      margin-bottom: 5px;
      padding-left: 10px;
    }
    div {
      display: flex;
      gap: 20px;
      width: 100%;
      justify-content: flex-start;
      align-items: center;
      max-height: 80%;
      input {
        width: 20rem;
        display: block;
        height: 3rem;
        border: solid var(--primary-black) 1px;
        border-radius: 5px;
        padding-left: 20px;
        font-size: 1rem;
      }
    }
  }
`;

const SaveTypePrompt = styled.div`
  position: absolute;
  width: 350px;
  /* height: 20%; */
  height: 280px;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.6);
  z-index: 10;
  align-self: center;
  justify-self: center;
  background: var(--primary-grey);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  .buttons {
    display: flex;
    justify-content: flex-end;
    gap: 30px;
  }
`;

// const ErrorDynamicConfigPrompt = styled(SaveTypePrompt)``;
const ErrorDynamicConfigPrompt = styled(SaveTypePrompt)`
  height: 210px;
`;
