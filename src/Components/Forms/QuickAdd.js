import styled from "styled-components";
import ReactDOM from "react-dom";
import "animate.css";
import { Fragment, useState } from "react";
import InputB from "../Inputs/InputB";
import BtnPrimary, {
  BtnDanger,
  BtnDisabled,
  BtnSecondary,
  BtnTertiary,
} from "../Buttons/Buttons";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import FormDataObject from "../../util/Data-Objects/formDataObject";
import { useDispatch, useSelector } from "react-redux";
import { actions as inventoryActions } from "../../store/inventory";
import { setDocument } from "../../util/firebase-store";
import { Timestamp } from "firebase/firestore";
import AddItem from "../../Pages/Dashboard/AddItem";

const QuickAddModal = (props) => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState(0);
  const [itemQuantity, setItemQuantity] = useState(0);
  const user = useSelector((state) => state.auth.userAuthCred);
  const dispatch = useDispatch();
  const [quickAddIsExpanded, setQuickAddIsExpanded] = useState(false);

  const dispatchTempFormData = (event) => {
    const formData = new FormDataObject();

    formData.name = itemName;
    formData.price = itemPrice;
    formData.quantity = itemQuantity;

    dispatch(inventoryActions.changeFormData({ ...formData }));
    setQuickAddIsExpanded(!quickAddIsExpanded);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const formData = new FormDataObject();

    formData.name = itemName;
    formData.price = itemPrice;
    formData.quantity = itemQuantity;

    const data = {
      ...formData,
      created: Timestamp.fromDate(new Date()),
      lastModified: Timestamp.fromDate(new Date()),
    };
    setDocument(data, "Users", user.uid, "Inventory", formData.id);

    dispatch(inventoryActions.addItem(data));
    props.toggle(event);
  };

  return (
    <div className="container">
      {!quickAddIsExpanded && (
        <Grid className="animate__animated animate__fadeInDown">
          <Close onClick={props.toggle}>X</Close>
          <h3>Add Item</h3>
          <Fields>
            <InputB
              name="name"
              label="Item Name*"
              width="50%"
              type="text"
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            />
            <InputB
              name="price"
              label="Price"
              width="20%"
              type="number"
              value={itemPrice}
              onChange={(e) => {
                setItemPrice(e.target.value);
              }}
            />
            <InputB
              name="quantity"
              label="Quantity"
              width="20%"
              type="number"
              value={itemQuantity}
              onChange={(e) => {
                setItemQuantity(e.target.value);
              }}
            />
          </Fields>
          <ButtonsGrp>
            {itemName.length > 0 && itemPrice > 0 && (
              <BtnPrimary onClick={handleFormSubmit}>
                Add Item <Add />
              </BtnPrimary>
            )}
            {itemName.length === 0 && itemPrice === 0 && (
              <BtnDisabled
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Add Item <Add />
              </BtnDisabled>
            )}

            {(itemName.length > 0 && itemPrice === 0) ||
              (itemPrice === "" && (
                <BtnDisabled
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  Add Item <Add />
                </BtnDisabled>
              ))}
            <BtnSecondary onClick={dispatchTempFormData}>
              More Info
            </BtnSecondary>
            <BtnDanger onClick={props.toggle}>Cancel</BtnDanger>
          </ButtonsGrp>
        </Grid>
      )}
      {quickAddIsExpanded && <AddItem toggle={props.toggle} />}
    </div>
  );
};

const QuickAdd = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <QuickAddModal toggle={props.toggle} />,
        document.getElementById("backdrop-root")
      )}
    </Fragment>
  );
};

export default QuickAdd;

const Grid = styled.form`
  width: 60%;
  min-height: 100px;
  max-width: 700px;
  background: white;
  box-shadow: 5px 5px 10px var(--shadow-color);
  border-radius: 10px;
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 20px;

  h3 {
    margin-bottom: 20px;
    width: 100%;
    padding-left: 5%;
  }
`;

const Close = styled.button`
  position: absolute;
  right: 10px;
  top: 10px;
  width: 30px;
  height: 30px;
  font-size: 20px;
  font-weight: bold;
  background: none;
  border: none;
  color: var(--primary-black);

  &:hover {
    color: var(--primary-yellow);
  }

  &:active {
    color: var(--red);
  }
`;

const Fields = styled.div`
  display: flex;
  width: 90%;
  justify-content: space-around;
  gap: 20px;
  margin: 0 auto;
`;
const ButtonsGrp = styled.div`
  display: flex;
  width: 90%;
  /* border: green solid 2px; */
  justify-content: flex-end;
  padding: 10px auto;
  margin: 50px auto 20px auto;
  gap: 20px;
  flex-wrap: wrap;
`;
