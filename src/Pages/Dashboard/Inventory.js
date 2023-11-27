import styled from "styled-components";
import { useEffect, useState } from "react";
import {
  Add,
  Delete,
  Edit,
  List,
  Search,
  AppRegistration,
} from "@mui/icons-material";
import Input from "../../Components/Inputs/Input";
import QuickAdd from "../../Components/Forms/QuickAdd";
import { Fragment } from "react";
import PaginatedList from "../../Components/Containers/PaginatedList";
// import ItemsListContainer from "../../Components/Containers/ItemsListContainer";
import { useDispatch, useSelector } from "react-redux";
import { actions as inventoryActions } from "../../store/inventory";
import DeleteItemPrompt from "../../Components/Prompts/DeleteItemPrompt";
import {
  getDocumentByID,
  queryByProperty,
  db,
} from "../../util/firebase-store";
import OptionsMenu from "../../Components/Menus/OptionsMenu";
import UploadProgressUI from "../../Components/Prompts/UploadProgressUI";
import Import from "../../Components/Forms/Import";
import Export from "../../Components/Forms/Export";
import IndexerList from "./IndexerList";
import BulkEditModal from "../../Components/Forms/BulkEdit";
import { collection, getDocs, query } from "firebase/firestore";
import { Dashboard_Header as Header } from "../../Components/Header";
import EditItem from "./EditItem";

const Inventory = () => {
  const [quickAddIsActivated, setQuickAddIsActivated] = useState(false);
  const [deletePromptIsToggled, setDeletePromptIsToggled] = useState(false);
  const [importIsToggled, setImportIsToggled] = useState(false);
  const [exportIsToggled, setExportIsToggled] = useState(false);
  const [optionsIsToggled, setOptionsIsToggled] = useState(false);
  const [searchParams, setSearchParams] = useState("");
  const [total_Items, setTotalItems] = useState(0);
  const selectedItemsList = useSelector(
    (state) => state.inventory.itemsSelectedList
  );

  const selectAll = useSelector((state) => state.inventory.selectAll);
  const dispatch = useDispatch();
  const [indexes, setIndexes] = useState([]);
  const [indexerIsActive, setIndexerIsActive] = useState(false);
  const [bulkEditIsActive, setBulkEditIsActive] = useState(false);

  const itemsSelectedList = useSelector(
    (state) => state.inventory.itemsSelectedList
  );

  const editIsToggled = useSelector((state) => state.inventory.editIsToggled);
  const inventoryItems = useSelector((state) => state.inventory.items);
  // const changesOccuredInInventory = useSelector(
  //   (state) => state.inventory.changesOccured
  // );

  const storeName = useSelector((state) => state.auth.userData.businessName);
  const userID = useSelector((state) => state.auth.userAuthCred.uid);

  useEffect(() => {
    getDocumentByID("Users", userID, "SearchIndexes", "Init").then(
      (docSnap) => {
        console.log("hello fetching indexes: ");
        const indexes = Object.values(docSnap.data());
        sessionStorage.setItem("search Indexes", JSON.stringify(indexes));
      }
    );

    dispatch(inventoryActions.setSearchParams(""));
  }, []);

  useEffect(() => {
    const inventoryCollection = collection(db, "Users", userID, "Inventory");
    const q = query(inventoryCollection);

    getDocs(q).then((snapshot) => {
      // console.log("docs size:",snapshot.size)
      setTotalItems(snapshot.size);
      dispatch(inventoryActions.setTotalItems(snapshot.size))
    });

  }, [inventoryItems]);

  const categories = [
    { value: "all", name: "All" },
    { value: "food", name: "Food" },
    { value: "groceries", name: "Groceries" },
    { value: "restaurant", name: "Restaurant" },
    { value: "clothing", name: "Clothing" },
    { value: "diy", name: "DIY" },
  ];

  const sortBy = [
    { value: "price", name: "Price" },
    { value: "name", name: "Name" },
    { value: "id", name: "ID" },
    { value: "quantity", name: "Quantity" },
    { value: "country", name: "Country" },
    { value: "created", name: "Time Created" },
  ];

  const orderBy = [
    { value: "asc", name: "Ascending" },
    { value: "desc", name: "Descending" },
  ];

  

  const toggleQuickAdd = (event) => {
    event.preventDefault();
    setQuickAddIsActivated(!quickAddIsActivated);
  };

  const toggleEdit = (event) => {
    event.preventDefault();
    dispatch(inventoryActions.toggleEdit())
  };

  const toggleImport = (event) => {
    event.preventDefault();
    setImportIsToggled(!importIsToggled);
  };

  const toggleExport = (event) => {
    event.preventDefault();
    setExportIsToggled(!exportIsToggled);
  };

  const toggleDeletePrompt = (event) => {
    event.preventDefault();
    setDeletePromptIsToggled(!deletePromptIsToggled);
  };

  const handleSelectAll = (event) => {
    console.log(event.target.value);
    dispatch(inventoryActions.toggleSelectAll());
  };

  // const applyChanges = (event) => {
  //   event.preventDefault();
  //   toggleEdit(event);
  //   inventoryItems.forEach(async (item) => {
  //     if (item.updated) {
  //       console.log(item.id, item.name, item.updated);
  //       updateDocument(
  //         { ...item, updated: "" },
  //         "Users",
  //         userID,
  //         "Inventory",
  //         item.id
  //       );
  //     }
  //   });

  //   dispatch(inventoryActions.setChangesOccuredState(false));
  // };

  const toggleOptions = (event) => {
    event.preventDefault();

    setOptionsIsToggled(!optionsIsToggled);
  };

  const handleSorting = (event) => {
    const sortingPrefs = event.target.value;
    dispatch(inventoryActions.setSortingPreference(sortingPrefs));
  };

  const handleOrder = (event) => {
    const orderPrefs = event.target.value;
    dispatch(inventoryActions.setOrderPreference(orderPrefs));
  };

  const handleCategory = (event) => {
    const categoryPref = event.target.value;
    dispatch(inventoryActions.setCategoryFilter(categoryPref));
  };

  const getSearchParams = (event) => {
    setSearchParams(event.target.value);
    dispatch(inventoryActions.setSearchParams(event.target.value));
  };

  const fetchIndexes = (event) => {
    setIndexerIsActive(true);
    // console.log("focused");
    const idxs = JSON.parse(sessionStorage.getItem("search Indexes"));
    const modifiedIdx = idxs.map((idx) => {
      const str = Object.values(idx).join(", ");
      return { object: idx, stringified: str };
    });
    // console.log("string idx: ", modifiedIdx[0]);
    setIndexes(modifiedIdx);
  };

  const turnIndexerOff = (event) => {
    setIndexerIsActive(false);
  };

  const fetchMultipleItems = () => {
    const matches = indexes.filter((index) => {
      //props.items is a special object passed into the array with the id of the  obejct in mind
      if (
        index.stringified.toLowerCase().includes(searchParams.toLowerCase())
      ) {
        return true;
      } else {
        return false;
      }
    });

    const ids = matches.map((match) => match.object.id);

    queryByProperty("id", ids, "Users", userID, "Inventory").then(
      (bulkData) => {
        console.log("bulk data:", bulkData);
        dispatch(inventoryActions.importItems(bulkData));
      }
    );
  };

  const handleKeyPress = (event) => {
    console.log("key", event.key);
    if (event.key === "Enter") {
      fetchMultipleItems();
    }
  };

  const toggleBulkEdit = () => {
    setBulkEditIsActive(!bulkEditIsActive);
    // event.preventDefault();
  };

  const handleItemEdit = (event) => {
    event.preventDefault();
    const selected = selectedItemsList[0];
    console.log("selected List", selectedItemsList);
    // navigate(`/dashboard/inventory/edit-item/${selected}`);
    //make sure that you remove the current selected item from the list
    dispatch(inventoryActions.setCurrentExpansion(""));
  };

  return (
    <Fragment>
      <Grid>
        <Header storeTitle={storeName} pageTitle="Inventory" />

        <Menu>
          <Input
            label={"Category"}
            width="200"
            type="select"
            options={categories}
            onChange={handleCategory}
          />
          {/* <Input label={"Type"} width="200" type="select" options={types} /> */}
          <Input
            label={"Sort by"}
            width="200"
            type="select"
            onChange={handleSorting}
            options={sortBy}
          />
          <Input
            label={"Order by"}
            width="200"
            type="select"
            onChange={handleOrder}
            options={orderBy}
          />
          {itemsSelectedList.length === 0 && (
            <BtnExt onClick={toggleQuickAdd}>
              <span>Add Item </span>{" "}
              <span>
                <Add />
              </span>
            </BtnExt>
          )}
          {itemsSelectedList.length > 0 && (
            <BtnExt onClick={toggleDeletePrompt}>
              <span>Delete </span>{" "}
              <span>
                <Delete />
              </span>
            </BtnExt>
          )}
          {itemsSelectedList.length === 1 && (
            <BtnExt onClick={toggleEdit} width="140px">
              <span> Edit Item </span>{" "}
              <span>
                <Edit />
              </span>
            </BtnExt>
          )}
         
          {itemsSelectedList.length > 1 && (
            <BtnExt onClick={toggleBulkEdit} width="140px">
              <span>Bulk Edit</span>{" "}
              <span>
                <AppRegistration />
              </span>
            </BtnExt>
          )}
          <BtnExt onClick={toggleOptions}>
            <span>Options</span>
            <span>
              <List />
            </span>
            {optionsIsToggled && (
              <OptionsMenu
                toggleOptions={toggleOptions}
                toggleExport={toggleExport}
                toggleImport={toggleImport}
              />
            )}
          </BtnExt>

          {indexerIsActive && <SearchBoxBackground onClick={turnIndexerOff} />}
          <SearchBox>
            <input
              value={searchParams}
              type="text"
              placeholder={"Search..."}
              onFocus={fetchIndexes}
              onChange={getSearchParams}
              onKeyPress={handleKeyPress}
            />
            <Search onClick={fetchMultipleItems} />
            {indexerIsActive && (
              <IndexerList
                turnOff={turnIndexerOff}
                indexes={indexes}
                searchParam={searchParams}
              />
            )}
          </SearchBox>

          <div className="total_Items">
            <span>Total Items: {total_Items}</span>
          </div>
        </Menu>

        <ColumnHeader>
          <span className="circle-select">
            <Input
              type="checkbox"
              name="selectAll"
              value={selectAll}
              onChecked={handleSelectAll}
            />
          </span>
          <span className="image"></span>
          <span className="id">ID</span>
          <span className="name">Name</span>
          <span className="quantity">Quantity</span>
          <span className="price">Price</span>
          <span className="sku">SKU/Barcode</span>
          <span className="description">Description</span>
        </ColumnHeader>
        <PaginatedList/>

        <AddItemBtn>?</AddItemBtn>
      </Grid>

      {quickAddIsActivated && <QuickAdd toggle={toggleQuickAdd} />}
      {deletePromptIsToggled && (
        <DeleteItemPrompt toggleDeletePrompt={toggleDeletePrompt} />
      )}

      {importIsToggled && (
        <Import
          toggle={toggleImport}
        />
      )}
      {bulkEditIsActive && <BulkEditModal toggle={toggleBulkEdit} />}
      {exportIsToggled && <Export toggle={toggleExport} />}
      {editIsToggled && <EditItem toggle={toggleEdit} />}
    </Fragment>
  );
};

export default Inventory;

const Grid = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  color: black;
  h1 {
    user-select: text !important;
  }
`;

const AddItemBtn = styled.button`
  width: 50px;
  height: 40px;
  border-radius: 20px;
  font-size: 24px;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 20px;
  bottom: 20px;
  background: var(--primary-black);
  color: white;
  padding: 0 10px;

  &:hover {
    span {
      color: var(--primary-yellow);
    }
  }

  &:active {
    background: var(--primary-yellow);
    span {
      color: var(--primary-black);
      transform: scale(1.1);
    }
  }
`;

const BtnExt = styled(AddItemBtn)`
  position: relative;
  background: ${(props) =>
    props.toggled ? "transparent" : "var(--primary-black)"};
  width: ${(props) => props.width || "120px"};
  border-radius: 20px;
  font-size: 16px;
  color: ${(props) => (props.toggled ? "var(--primary-black)" : "white")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  line-height: 12px;
  font-weight: bold;
  bottom: 0px;
  left: 0px;
  right: 0px;
  top: 0px;
  border: ${(props) =>
    props.toggled ? "var(--primary-yellow) solid 2px" : "none"};
  span {
    display: inline-block;
  }
`;

const Menu = styled.div`
  width: calc(100% - 80px);
  height: 80px;
  margin-left: auto;
  margin-top: 5rem;
  padding: 5px;
  display: flex;
  justify-content: flex-start;
  gap: 20px;

  div.total_Items {
    /* background: red; */
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
  }
`;

const ColumnHeader = styled.div`
  color: var(--primary-black);
  display: flex;
  width: 90%;
  justify-content: flex-start;
  align-items: center;
  margin: 0 auto;
  margin-bottom: 10px;
  z-index: -1;
  /* border: solid 1px green; */
  /* border: solid red 2px; */

  span {
    font-weight: bold;
    display: inline-block;
    width: auto;
  }

  span.circle-select {
    width: 50px;
  }

  span.image {
    width: 100px;
  }

  span.id,
  span.quantity,
  span.price,
  span.sku {
    width: 10%;
  }

  span.name {
    width: 15%;
  }

  span.description {
    width: 30%;
  }
`;

const SearchBox = styled.div`
  height: 40px;
  border-radius: 15px;
  min-width: 15rem;
  display: flex;
  border: solid 1px var(--primary-black);
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding-right: 5px;
  position: relative;
  z-index: 1;

  input {
    display: block;
    width: 90%;
    height: 30px;
    border: none;
    background-color: white;
    outline: none;
    padding-left: 10px;
    font-size: 1.2rem;
    color: var(--primary-black);
    border-radius: 10px;
  }

  svg {
    &:active {
      color: var(--primary-yellow);
    }
  }
`;

const SearchBoxBackground = styled.div`
  position: absolute;
  background: transparent;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  z-index: 1;
`;
