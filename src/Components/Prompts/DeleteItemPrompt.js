import { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import "animate.css";
import ReactDOM from "react-dom";
import { deleteDocument, getDocumentByID, setDocument } from "../../util/firebase-store";
import { actions as inventoryActions } from "../../store/inventory";
import BtnPrimary, { BtnDanger } from "../Buttons/Buttons";
import { db } from "../../util/firebase-store";

const Prompt = (props) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const userID = useSelector((state) => state.auth.userAuthCred.uid);
  const items = useSelector((state) => state.inventory.items);
  const itemsSelectedList = useSelector(
    (state) => state.inventory.itemsSelectedList
  );
  const dispatch = useDispatch();

  const deleteSelected = (event) => {
    event.preventDefault();
    setIsDeleting(true)

    itemsSelectedList.forEach((itemID) => {
      deleteDocument("Users", userID, "Inventory", itemID);
    });

    //GET DOCUMENT ONCE FROM FIREBASE
    getDocumentByID("Users", userID, "SearchIndexes", "Init").then((docSnap) => {
      const filterString = itemsSelectedList.join(", ");
      if (docSnap.exists()) {
        const indexes = docSnap.data();

        const indexesArr = Object.values(indexes);

        //SEARCH THROUGHT THE DOCUMENT AND MAKE IT INTO AN ARRAY.
        //DELETE THE INDEX ITEMS THAT YOU WANT FROM THE ARRAY.
        const filtered = indexesArr.filter((index) => {
          if (filterString.includes(index.id)) {
            return false;
          } else return true;
        });

        //UPDATE SESSION STORAGE WITH THE NEW INDEX ARRAY.
        sessionStorage.setItem("search Indexes", JSON.stringify(filtered));
        console.log("search Indexes:", filtered)

        //SET THE DOCUMENT IN FIRESTORE USING UPDATED DATA.
        const obj = { "000": "" };
        filtered.forEach((item) => {
          obj[`${item.id}`] = item;
        });

        console.log("obj filtered:", obj);
        setDocument(obj, "Users", userID, "SearchIndexes", "Init");
      }
      //DELETE ITEMS FROM THE INVENTORY ITEMS LIST
      const newItemsList = [...items].filter((item) => {
        // console.log(item.id);
        if (filterString.includes(item.id)) {
          return false;
        } else return true;
      });

      // itemsSelectedList.forEach((itemID))
      console.log("new items list:",newItemsList);
      dispatch(inventoryActions.updateItems(newItemsList));
      dispatch(inventoryActions.setDeleteCounter())
      itemsSelectedList.forEach((itemID) => {
        dispatch(inventoryActions.removeItemFromSelectedList(itemID));
      });

      //delete their names from the search index file as well.

      props.toggleDeletePrompt(event);
    });
  };

  return (
    <div className="container">
      <div className="close-div" onClick={props.toggleDeletePrompt}></div>
      <Grid className="animate__animated animate__fadeInDown">
        {!isDeleting && <p>
          You have requested to delete {itemsSelectedList.length} items from
          your inventory. Are you sure?
        </p>}
        {isDeleting && <p className="animate__animated animate__flash animate__infinite">Deleting items</p>}
        <div className="buttons">
          <BtnDanger width="100px" onClick={deleteSelected}>
            Yes
          </BtnDanger>
          <BtnPrimary width="100px" onClick={props.toggleDeletePrompt}>
            No
          </BtnPrimary>
        </div>
      </Grid>
    </div>
  );
};

const DeleteItemPrompt = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Prompt toggleDeletePrompt={props.toggleDeletePrompt} />,
        document.getElementById("backdrop-root")
      )}
    </Fragment>
  );
};

export default DeleteItemPrompt;

const Grid = styled.div`
  width: 50%;
  max-width: 700px;
  background: white;
  padding: 2rem;
  border-radius: 10px;
  z-index: 2;

  .buttons {
    display: flex;
    width: 100%;
    gap: 20px;
    justify-content: center;
    padding: 2em 0px;
    padding-bottom: 0px;
  }
`;
