import styled from "styled-components";
import InputB from "../../Components/Inputs/InputB";
import Input from "../../Components/Inputs/Input";
import { AddAPhoto, ArrowForwardIos, Add, Edit } from "@mui/icons-material";
import BtnPrimary, {
  BtnDanger,
  BtnTertiary,
} from "../../Components/Buttons/Buttons";
import { Fragment, useEffect, useState } from "react";
import Bar from "../../Components/Bars/Dashed-Progress-Bar/dashedProgressBar";
import { useNavigate, useParams } from "react-router-dom";
import { countries } from "../../util/countries";
import generateArrayOfYears from "../../util/years";
import { updateDocument } from "../../util/firebase-store";
import { useSelector } from "react-redux";
import { Timestamp } from "firebase/firestore";
import blobToBase64 from "../../util/blobToBase64";
import { useDispatch } from "react-redux";
import { actions as inventoryActions } from "../../store/inventory";
import ReactDOM from "react-dom";
import { Close } from "@mui/icons-material";

// import { Ref } from "react";
const EditItemModal = (props) => {
  const [currentStep, setCurrentStep] = useState(1);
  const user = useSelector((state) => state.auth.userAuthCred);
  const items = useSelector((state) => state.inventory.items);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const categories = useSelector((state) => state.inventory.categories);
  const selectedItem = useSelector((state) => state.inventory.currentEdit);

  useEffect(() => {
    const item = [...items].filter((itm) => itm.id === selectedItem);
    setFormData({ ...item[0] });
  }, []);

  const goToNext = () => {
    //takes you to the next form
    setCurrentStep(currentStep + 1);
  };

  //takes you to the previous form
  const goToPrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const backToInventory = (event) => {
    event.preventDefault();
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

    console.log("form data:", formData);
    const data = {
      ...formData,
      lastModified: Timestamp.fromDate(new Date()),
    };
    //get the user id from redux auth slice  .
    updateDocument(data, "Users", user.uid, "Inventory", formData.id);

    const obj = {};
    obj[`${formData.id}`] = {
      name: formData.name,
      altName: formData.altName,
      id: formData.id,
      productCode: formData.productCode,
      description: formData.description,
    };

    updateDocument(obj, "Users", user.uid, "SearchIndexes", "Init");

    const idxs = JSON.parse(sessionStorage.getItem("search Indexes"));

    const newIndexList = idxs.map((index) => {
      // console.log("index:", index);
      if (index.id === formData.id) {
        return {
          name: formData.name,
          altName: formData.altName,
          id: formData.id,
          productCode: formData.productCode,
          description: formData.description,
        };
      } else return index;
    });

    sessionStorage.setItem("search Indexes", JSON.stringify(newIndexList));

    const newItems = [...items].map((itm) => {
      if (itm.id === formData.id) {
        return formData;
      } else {
        return itm;
      }
    });

    dispatch(inventoryActions.updateItems(newItems));
    dispatch(inventoryActions.setCurrentEdit(data));
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
    <div className="container">
      <Grid>
        <Bar step={currentStep} repeat={2} color="yellow" />
        <div className="close">
          <Close onClick={props.toggle} />
        </div>
        <h3>Edit Item</h3>
        <form>
          {currentStep === 1 && (
            <div>
              <Hgrp>
                <div>
                  <InputB
                    label="Item Name *"
                    name="name"
                    type="text"
                    width="100%"
                    onChange={handleData}
                    value={formData.name}
                  />
                </div>
                <div>
                  <InputB
                    label="Other Name *"
                    name="altName"
                    type="text"
                    width="100%"
                    onChange={handleData}
                    value={formData.altName}
                  />
                </div>
                <div>
                  <InputB
                    label="ID *"
                    name="id"
                    type="text"
                    width="100%"
                    onChange={handleData}
                    value={formData.id}
                  />
                </div>
                <div>
                  <InputB
                    label="Price *"
                    name="price"
                    type="number"
                    width="100%"
                    onChange={handleData}
                    value={formData.price}
                    prefix="$"
                  />
                </div>
                <div>
                  <InputB
                    label="Cost *"
                    name="cost"
                    type="number"
                    width="100%"
                    onChange={handleData}
                    value={formData.cost}
                    prefix="$"
                  />
                </div>
              </Hgrp>

              <Hgrp>
                <InputB
                  label="Pricing Type*"
                  name="pricingType"
                  type="select"
                  options={["Variable", "Fixed", "Per Unit"]}
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
                <div className="description-field">
                  <InputB
                    label="Description"
                    name="description"
                    type="textArea"
                    width="100%"
                    height="200px"
                    onChange={handleData}
                    value={formData.description}
                  />
                </div>
              </Hgrp>
            </div>
          )}

          {currentStep === 2 && (
            <Hgrp width="100%">
              <ImgField
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
                  <div>
                    <InputB
                      label="Quantity *"
                      name="quantity"
                      type="number"
                      width="100%"
                      onChange={handleData}
                      value={formData.quantity}
                    />
                  </div>
                  <div>
                    <InputB
                      label="Brand Name *"
                      name="brand"
                      type="text"
                      width="100%"
                      onChange={handleData}
                      value={formData.brand}
                    />
                  </div>
                  <div>
                    <InputB
                      label="Category *"
                      name="category"
                      type="select"
                      width="100%"
                      options={categories}
                      onChange={handleData}
                      value={formData.category}
                    />
                  </div>
                </Hgrp>
                <Hgrp>
                  <div>
                    <InputB
                      label="Country *"
                      name="country"
                      type="select"
                      width="100%"
                      options={countries.map((country) => country.name)}
                      onChange={handleData}
                      // defaultValue="Ghana"
                      value={formData.country}
                    />
                  </div>
                  <div>
                    <InputB
                      label="Product Year *"
                      name="year"
                      type="select"
                      width="100%"
                      options={generateArrayOfYears(3)} //subject to settings
                      onChange={handleData}
                      // defaultValue={new Date().getFullYear()}
                      value={formData.year}
                    />
                  </div>

                  <div>
                    <InputB
                      label="Tags *"
                      width="100%"
                      name="tags"
                      type="list"
                      onUpdate={handleTags}
                      value={formData.tags}
                    />
                  </div>
                </Hgrp>
              </Vgrp>
            </Hgrp>
          )}
        </form>

        <Footer>
          {currentStep < 2 && (
            <BtnPrimary type="submit" onClick={goToNext}>
              Next
            </BtnPrimary>
          )}
          {currentStep > 1 && (
            <BtnPrimary type="submit" onClick={handleFormSubmit}>
              Apply
            </BtnPrimary>
          )}
          {currentStep === 2 && (
            <BtnTertiary onClick={goToPrev}>Back</BtnTertiary>
          )}
          {currentStep === 1 && (
            <BtnDanger onClick={backToInventory}>Cancel</BtnDanger>
          )}
        </Footer>
      </Grid>
    </div>
  );
};

const EditItem = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <EditItemModal toggle={props.toggle} />,
        document.getElementById("backdrop-root")
      )}
    </Fragment>
  );
};

export default EditItem;

const Container = styled.section`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.16);
  z-index: 500;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Grid = styled.section`
  padding: 20px 0px 0px 80px;
  background: white;
  border-radius: 10px;
  position: relative;

  .close {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 30px;
    height: 30px;
    font-size: 20px;
    color: var(--primary-black);
    border: solid 1px var(--primary-black);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      color: var(--primary-yellow);
    }

    &:active {
      color: var(--red);
    }
  }

  @media (max-width: 1200px) {
    margin-top: 20px;
    width: calc(100% - 40px);
  }
  @media (max-width: 600px) {
    margin-top: 0px;
    padding-left: 20px;
    width: auto;
  }

  @media (max-width: 1000px) {
    overflow: scroll;
  }

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

  .description-field {
    width: 60%;

    @media (max-width: 800px) {
      width: 80%;
    }
    @media (max-width: 600px) {
      width: 100%;
    }
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
  /* background: red; */
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
  /* margin-top: 100px; */
  width: 90%;
  height: 100px;
  display: flex;
  margin: 0 auto;
  justify-content: flex-end;
  align-items: center;
  gap: 30px;
`;
