import styled from "styled-components";
import InputB from "../../Components/Inputs/InputB";
import Input from "../../Components/Inputs/Input";
import { AddAPhoto, ArrowForwardIos, Add } from "@mui/icons-material";
import BtnPrimary, {
  BtnTertiary,
  BtnDanger,
  BtnDisabled,
} from "../../Components/Buttons/Buttons";
import { Fragment, useState } from "react";
import Bar from "../../Components/Bars/Dashed-Progress-Bar/dashedProgressBar";
import { useNavigate } from "react-router-dom";
import { countries } from "../../util/countries";
import generateArrayOfYears from "../../util/years";
import { setDocument, updateDocument } from "../../util/firebase-store";
import { useSelector, useDispatch } from "react-redux";
import { Timestamp, disableNetwork } from "firebase/firestore";
import blobToBase64 from "../../util/blobToBase64";
import { actions as inventoryActions } from "../../store/inventory";
// import { Ref } from "react";
export const AddItem = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [currentStep, setCurrentStep] = useState(1);
  const user = useSelector((state) => state.auth.userAuthCred);
  const tempData = useSelector((state) => state.inventory.tempFormData);
  const categories = useSelector((state) => state.inventory.categories);

  const [formData, setFormData] = useState({ ...tempData });

  const goToNext = () => {
    //takes you to the next form
    setCurrentStep(currentStep + 1);
  };

  //takes you to the previous form
  const goToPrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const backToInventory = (event) => {
    props.toggle(event);
  };

  const handleFileSelect = (event) => {
    // console.log(event.target.files[0]);
    blobToBase64(event.target.files[0]).then((imgURL) => {
      setFormData({ ...formData, image: imgURL });
    });
  };

  //This function handles the drag and drop feature of the import modal.
  const handleDrop = (event) => {
    event.preventDefault();
    console.log("image has been dropped");
    blobToBase64(event.dataTransfer.files[0]).then((imgURL) => {
      setFormData({ ...formData, image: imgURL });
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    // Add styling or visual feedback to indicate valid drop target
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // console.log("form data:", formData);

    //get the user id from redux auth slice  .
    const data = {
      ...formData,
      created: Timestamp.fromDate(new Date()),
      lastModified: Timestamp.fromDate(new Date()),
    }
    setDocument(
      data,
      "Users",
      user.uid,
      "Inventory",
      formData.id
    );

    const obj = {};
    obj[`${formData.id}`] = {
      name: formData.name,
      altName: formData.altName,
      id: formData.id,
      productCode: formData.productCode,
      description: formData.description,
    };

    updateDocument(obj, "Users", user.uid, "SearchIndexes", "Init");

    //add item to indexes locally.
    const idxs = JSON.parse(sessionStorage.getItem("search Indexes"));
    const newIdxs = [...idxs, {
      name: formData.name,
      altName: formData.altName,
      id: formData.id,
      productCode: formData.productCode,
      description: formData.description,
    }]
    
    sessionStorage.setItem("search Indexes",JSON.stringify(newIdxs))
    
    //add item to inventory locally.
    dispatch(inventoryActions.addItem(data))
    dispatch(inventoryActions.seBulkEditUpdateCounter())
    backToInventory(event);
    return;
  };


  const handleData = (event) => {
    const data = formData;
    const name = event.target.name;
    const value = event.target.value;

    data[name] = value;

    setFormData({ ...data });
  };

  const handleTags = (strings) => {
    console.log("variation strings:", strings);
    setFormData({ ...formData, tags: strings });
  };

  const handleCheckbox = (event) => {
    // if(event.target.check)
    const obj = {};
    obj[event.target.name] = event.target.checked;
    setFormData({ ...formData, ...obj });
  };

  return (
    <Grid>
      <Bar step={currentStep} repeat={2} color="yellow" />
      <h3>Add Item</h3>
      <form>
        {currentStep < 2 && (
          <Fragment>
            <Hgrp>
              <InputB
                label="Item Name *"
                name="name"
                type="text"
                width="20%"
                onChange={handleData}
                value={formData.name}
              />
              <InputB
                label="Other Name *"
                name="altName"
                type="text"
                width="20%"
                onChange={handleData}
                value={formData.altName}
              />
              <InputB
                label="ID *"
                name="id"
                type="text"
                width="10%"
                onChange={handleData}
                value={formData.id}
              />
              <InputB
                label="Price *"
                name="price"
                type="number"
                width="15%"
                onChange={handleData}
                value={formData.price}
                prefix="$"
              />
              <InputB
                label="Cost *"
                name="cost"
                type="number"
                width="15%"
                onChange={handleData}
                value={formData.cost}
                prefix="$"
              />
            </Hgrp>

            <Hgrp>
              <InputB
                label="Pricing Type*"
                name="pricingType"
                type="select"
                options={["Variable", "Fixed", "Per Unit", "Per Pound"]}
                width="15%"
                onChange={handleData}
                // defaultValue="Variable"
                value={formData.pricingType}
              />
              <InputB
                label="Tax and Fees *"
                name="tax"
                type="number"
                width="15%"
                onChange={handleData}
                value={formData.tax}
                suffix="%"
              />

              <InputB
                label="Discount *"
                name="discount"
                type="number"
                width="10%"
                onChange={handleData}
                value={formData.discount}
                suffix="%"
              />

              <InputB
                label="Location*"
                type="select"
                name="location"
                options={["Online", "In Store", "Online and In Store"]}
                width="15%"
                // defaultValue="In Store"
                onChange={handleData}
                value={formData.location}
              />
              <InputB
                label="SKU*"
                name="sku"
                type="text"
                width="15%"
                onChange={handleData}
                value={formData.sku}
              />
            </Hgrp>

            <Hgrp gap="5px">
              <Input
                type="checkbox"
                name="isActive"
                onChecked={handleCheckbox}
                value={formData.isActive}
              />
              <span>Show as Active</span>
              <Input
                type="checkbox"
                onChecked={handleCheckbox}
                name="track"
                value={formData.track}
              />
              <span>Track Stock</span>
            </Hgrp>

            <Hgrp width="100%">
              <InputB
                label="Description"
                name="description"
                type="textArea"
                width="60%"
                height="200px"
                onChange={handleData}
                value={formData.description}
              />
            </Hgrp>
          </Fragment>
        )}

        {currentStep > 1 && (
          <Hgrp width="100%">
            <ImgField
              className="imgField"
              width="300px"
              height="300px"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Label
                htmlFor="photo"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                {formData.image === "" && <AddAPhoto />}
                {formData.image.length > 3 && <img src={formData.image} />}
                {true && (
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    id="photo"
                    name="photoUrl"
                    multiple={false}
                    // value={blob}
                  />
                )}
              </Label>
            </ImgField>
            <Vgrp width="60%">
              <Hgrp width="100%">
                <InputB
                  label="Quantity *"
                  name="quantity"
                  type="number"
                  width="15%"
                  onChange={handleData}
                  value={formData.quantity}
                />
                <InputB
                  label="Brand Name *"
                  name="brand"
                  type="text"
                  width="30%"
                  onChange={handleData}
                  value={formData.brand}
                />
                <InputB
                  label="Category *"
                  name="category"
                  type="select"
                  width="30%"
                  options={categories}
                  onChange={handleData}
                  value={formData.category}
                />
              </Hgrp>
              <Hgrp>
                <InputB
                  label="Country *"
                  name="country"
                  type="select"
                  width="30%"
                  options={countries.map((country) => country.name)}
                  onChange={handleData}
                  // defaultValue="Ghana"
                  value={formData.country}
                />
                <InputB
                  label="Product Year *"
                  name="year"
                  type="select"
                  width="25%"
                  options={generateArrayOfYears(3)} //subject to settings
                  onChange={handleData}
                  // defaultValue={new Date().getFullYear()}
                  value={formData.year}
                />

                <InputB
                  label="Tags *"
                  width="20%"
                  name="tags"
                  type="list"
                  onUpdate={handleTags}
                  value={formData.tags}
                />
              </Hgrp>
            </Vgrp>
          </Hgrp>
        )}
      </form>

      <Footer>
        {currentStep < 2 && formData.name.length > 0 && (
          <BtnPrimary type="submit" onClick={goToNext}>
            Next
          </BtnPrimary>
        )}
        {currentStep < 2 && formData.name.length === 0 && (
          <BtnDisabled type="submit" onClick={(e) => e.preventDefault()}>
            Next
          </BtnDisabled>
        )}
        {currentStep > 1 && (
          <BtnPrimary type="submit" onClick={handleFormSubmit}>
            Add <Add />
          </BtnPrimary>
        )}
        {currentStep === 2 && (
          <BtnTertiary onClick={goToPrev}>Back</BtnTertiary>
        )}
        {currentStep === 1 && (
          <BtnDanger onClick={props.toggle}>Cancel</BtnDanger>
        )}
      </Footer>
    </Grid>
  );
};

export default AddItem;

const Grid = styled.section`
  height: calc(90%-200px);
  margin-top: calc(100% - (100% - 100px));
  padding: 20px 0px 0px 80px;
  background: var(--primary-grey);
  border-radius: 10px;
  z-index: 2;

  h3 {
    color: black;
    font-size: 24px;
    width: 100%;
  }

  form {
    display: flex;
    /* background: blue; */
    flex-direction: column;
    width: 90%;
  }
`;

const Hgrp = styled.div`
  display: flex;
  width: ${(props) => props.width || "100%"};
  gap: ${(props) => props.gap || "20px"};
  flex-wrap: wrap;
  margin-top: 1.5rem;
  span {
    color: var(--primary-black);
    font-weight: bold;
  }
  #description {
    position: relative !important;
    bottom: 100px !important;
  }
`;

const Vgrp = styled.div`
  width: ${(props) => props.width || "40%"};
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
`;

const ImgField = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: red;
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "100%"};
  border-radius: 25px;
  font-size: 30px;
  color: var(--primary-grey-2);
  border: solid 1px var(--primary-black);
  margin-top: 1.5rem;
  overflow: hidden;
  /* margin-left: auto; */

  img {
    width: 100%;
    height: 100%;
  }
  svg {
    height: 100px;
    width: 100px;
  }

  input[type="file"] {
    display: none;
  }
`;
const Label = styled.label`
  cursor: pointer;
`;

const Footer = styled.section`
  width: 90%;
  margin: 0 auto;
  height: 100px;
  background-color: var(--primary-grey);
  z-index: 1;
  display: flex;
  justify-content: flex-end;

  align-items: center;
  gap: 30px;
`;
