import styled from "styled-components";
import { Fragment, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "animate.css";
import { getAllDocuments, updateDocument } from "../../util/firebase-store";
import { useSelector, useDispatch } from "react-redux";
import { ArrowDropDown, ArrowDropUp, SettingsOverscanTwoTone } from "@mui/icons-material";
import BulkEditInput from "../Inputs/BulkEditInput";
import BtnPrimary from "../Buttons/Buttons";
import { writeBatch, doc } from "firebase/firestore";
import { db } from "../../util/firebase-store";
import { actions as inventoryActions } from "../../store/inventory";

const BulkEditModal = (props) => {
  const [items, setItems] = useState([]);
  const inventoryItems = useSelector((state) => [...state.inventory.items]);
  const userID = useSelector((state) => state.auth.userAuthCred.uid);
  const [filterDropDownIsActive, setFilterDropdownIsActive] = useState(false);
  const itemsSelectedList = useSelector(
    (state) => state.inventory.itemsSelectedList
  );
  const [searchString, setSearchString] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [backup, setBackup] = useState([]);
  //this variable is responsible for tracking the visibility of all columns on the bulk edit view.
  const [columns, setColumns] = useState({
    all: false,
    id: true,
    name: true,
    alternateName: false,
    price: true,
    pricingType: false,
    cost: false,
    discount: false,
    tax: false,
    sku: false,
    productCode: false,
    location: false,
    isActive: false,
    track: false,
    brand: false,
    country: true,
    importID: false,
    imported: false,
    description: false,
  });

  const [wasActivated, setWasActivated] = useState(false);
  const [updateList, setUpdateList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    let allSelected = [];
    itemsSelectedList.forEach((itemSelected) => {
      // console.log("item selected:", itemSelected, inventoryItems);

      const selected = inventoryItems.filter(
        (item) => item.id.trim() === itemSelected.trim()
      );

      allSelected.push(selected[0]);
    });

    console.log("all selected:", allSelected);
    setItems(allSelected);
  }, []);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  useEffect(() => {
    const filtered = items.filter((item) => {
      const name = item.name;
      const altName = item.altName;
      const id = item.id;
      const sku = item.sku;
      const productCode = item.productCode;

      const combo = name + altName + id + sku + productCode;

      if (combo.toLowerCase().includes(searchString.toLowerCase())) {
        return true;
      } else {
        return false;
      }
    });

    setFilteredItems(filtered);
  }, [searchString]);

  const toggleFilterDropdown = (event) => {
    setFilterDropdownIsActive(!filterDropDownIsActive);
  };

  const updateSearchString = (event) => {
    setSearchString(event.target.value);
  };

  const updateItem = (property, itemID, event) => {
    if (property === "isActive") {
    }
    const obj = {};
    const value = event.target.value;
    obj[property] = value;
    obj["id"] = itemID;

    console.log([...updateList, obj]);
    setUpdateList([...updateList, obj]);
  };

  const updateColumnVisibilty = (event) => {
    const checked = event.target.checked;
    const value = event.target.value;
    let cols = { ...columns };

    if (value === "all" && checked === true) {
      cols = {
        all: true,
        id: true,
        name: true,
        alternateName: true,
        price: true,
        pricingType: true,
        cost: true,
        discount: true,
        tax: true,
        sku: true,
        productCode: true,
        location: true,
        isActive: true,
        track: true,
        brand: true,
        country: true,
        importID: true,
        imported: true,
        description: true,
      };
    }
    if (value === "all" && checked === false) {
      cols = {
        all: false,
        id: true,
        name: true,
        alternateName: false,
        price: true,
        pricingType: false,
        cost: false,
        discount: false,
        tax: false,
        sku: false,
        productCode: false,
        location: false,
        isActive: false,
        track: false,
        brand: false,
        country: true,
        importID: false,
        imported: false,
        description: false,
      };
    }
    cols[value] = checked;
    setColumns(cols);
    console.log("columns:", cols);
  };

  // const handleModeChange = (event) => {
  //   const value = event.target.value;
  //   // setCurrentMode(value);
  //   // console.log("mode:", value);
  //   if (value === "all") {
  //     getAllDocuments("Users", userID, "Inventory").then((data) => {
  //       setItems(data);
  //       setFilteredItems(data);
  //       console.log("data", data)
  //     });
  //   }
  //   if (value === "selected") {
  //     let allSelected = [];
  //     itemsSelectedList.forEach((itemSelected) => {
  //       const selected = inventoryItems.filter(
  //         (item) => item.id.trim() === itemSelected.trim()
  //       );

  //       allSelected.push(selected[0]);
  //     });

  //     setItems(allSelected);
  //     // setFilteredItems(allSelected);
  //   }
  // };

  const handleModeChange = (event) => {
    const value = event.target.value;

    if (value === "all" && wasActivated) {
      setItems(backup);
      setFilteredItems(backup)
    } else {
      getAllDocuments("Users", userID, "Inventory").then((data) => {
        setItems(data);
        setFilteredItems(data);
        setBackup(data);
      });

      setWasActivated(true);
    }

    if (value === "selected") {
      let allSelected = [];
      itemsSelectedList.forEach((itemSelected) => {
        const selected = inventoryItems.find(
          (item) => item.id.trim() === itemSelected.trim()
        );

        if (selected) {
          allSelected.push(selected);
        }
      });

      setItems(allSelected);
      setFilteredItems(allSelected);
    }
  };

  const updateEdited = () => {
    //take the list of arrays and then create an object that by adding the different items in the array based on the id.
    //the addition process is a bit complicated so we will try to break it down while we code.

    let obj = {};

    updateList.forEach((item) => {
      const id = item.id;
      if (id in obj) {
        obj[id] = { ...obj[id], ...item };
      } else {
        obj[id] = item;
      }
    });

    if (updateList.length > 0) {
      //Take the object and then turn it into an array. Map all the items inside the array to different inventory items
      //and then update the inventory.
      const objArray = Object.keys(obj);

      const allEntries = objArray.map((key) => obj[key]);

      // updateDocument(obj, "Users", userID, "Inventory", itemID);

      //do a batch update
      const batch = writeBatch(db);
      
      allEntries.forEach((data) => {
        const path = ["Users", userID, "Inventory"];
        const pathRef = doc(db, ...path, data.id);
        batch.update(pathRef, data);
      });

      batch.commit();

      //update the items locally too

      const newItems = inventoryItems.map((itm) => {
        let match = null;
        allEntries.forEach((entry) => {
          if (itm.id === entry.id) {
            console.log(
              "ids",
              itm.id,
              entry.id,
              "data:1",
              itm,
              "data2:",
              entry
            );
            match = { ...itm, ...entry };
          } else {
            match = itm;
          }
        });

        return match;
      });

      dispatch(inventoryActions.updateItems(newItems));
      dispatch(inventoryActions.seBulkEditUpdateCounter());
      console.log("new Items after bulk edit", newItems);
      //toggle modal loading icon

      //toggle the modal
      props.toggle();
    }
  };

  return (
    <div className="container">
      <div className="close-div" onClick={props.toggle}></div>
      <Modal>
        <div className="header">
          <h1>Bulk Edit</h1>
          <div className="mid">
            <div className="search-filter">
              <input
                type="text"
                onChange={updateSearchString}
                placeholder="search filter"
                name="search"
                value={searchString}
              />
            </div>
            <div className="mode-selector">
              <select name="mode" id="" onChange={handleModeChange}>
                <option value="selected">Only Selected Items</option>
                <option value="all">All Items</option>
              </select>
            </div>
            <div className="filter">
              <p onClick={toggleFilterDropdown}>
                <span>Filter</span>
                {!filterDropDownIsActive && <ArrowDropDown />}{" "}
                {filterDropDownIsActive && <ArrowDropUp />}{" "}
              </p>

              {filterDropDownIsActive && (
                <ul className="filter-list">
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.all}
                      value="all"
                      onChange={updateColumnVisibilty}
                    />
                    <span>All</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.id}
                      value="id"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#74D4EB" }}>ID</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.name}
                      value="name"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#AB8D71" }}>Name</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.alternateName}
                      value="alternateName"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#EBA360" }}>Alternate Name</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.price}
                      value="price"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#6F8E96" }}>Price</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.pricingType}
                      value="pricingType"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#6B655F" }}>Pricing Type</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.cost}
                      value="cost"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#9EEB32" }}>Cost</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.discount}
                      value="discount"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#A071AB" }}>Discount</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.tax}
                      value="tax"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#D160EB" }}>Tax</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.sku}
                      value="sku"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#86966F" }}>SKU</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.productCode}
                      value="productCode"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#695F6B" }}>Product Code</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.location}
                      value="location"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#EA7C04" }}>Location</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.isActive}
                      value="isActive"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#719BAB" }}>Is Active</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.track}
                      value="track"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#60C6EB" }}>Track</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.brand}
                      value="brand"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#96836F" }}>Brand</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.country}
                      value="country"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#5F686B" }}>Country</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.importID}
                      value="importID"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#655EEB" }}>Import iD</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.imported}
                      value="imported"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#ABA171" }}>Imported</span>
                  </li>
                  <li>
                    <input
                      type="checkbox"
                      checked={columns.description}
                      value="description"
                      onChange={updateColumnVisibilty}
                    />
                    <span style={{ color: "#EBD460" }}>Description</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
          <span onClick={props.toggle} className="close">
            X
          </span>
        </div>
        <div className="table">
          <table>
            <tbody>
              <tr>
                {columns.id && <th style={{ color: "#74D4EB" }}>ID</th>}
                {columns.name && <th style={{ color: "#AB8D71" }}>Name</th>}
                {columns.alternateName && (
                  <th style={{ color: "#EBA360" }}>Alternate Name</th>
                )}
                {columns.price && <th style={{ color: "#6F8E96" }}>Price</th>}
                {columns.pricingType && (
                  <th style={{ color: "#6B655F" }}>Pricing Type</th>
                )}
                {columns.cost && <th style={{ color: "#9EEB32" }}>Cost</th>}
                {columns.discount && (
                  <th style={{ color: "#A071AB" }}>Discount</th>
                )}
                {columns.tax && <th style={{ color: "#D160EB" }}>Tax</th>}
                {columns.sku && <th style={{ color: "#86966F" }}>SKU</th>}
                {columns.productCode && (
                  <th style={{ color: "#695F6B" }}>Product Code</th>
                )}
                {columns.location && (
                  <th style={{ color: "#EA7C04" }}>Location</th>
                )}
                {columns.isActive && (
                  <th style={{ color: "#719BAB" }}>Is Active</th>
                )}
                {columns.track && <th style={{ color: "#60C6EB" }}>Track</th>}
                {columns.brand && <th style={{ color: "#96836F" }}>Brand</th>}
                {/* <th>Year</th> */}
                {columns.country && (
                  <th style={{ color: "#5F686B" }}>Country</th>
                )}
                {columns.importID && (
                  <th style={{ color: "#655EEB" }}>Import ID</th>
                )}
                {columns.imported && (
                  <th style={{ color: "#ABA171" }}>Imported</th>
                )}
                {/* <th>Created</th>
              <th>Last Modified</th> */}
                {columns.description && (
                  <th style={{ color: "#EBD460" }}>Description</th>
                )}
              </tr>

              {filteredItems.map((item, index) => (
                <tr key={index}>
                  {columns.id && (
                    <td>
                      {" "}
                      <BulkEditInput
                        type="text"
                        value={item.id}
                        style={{ color: "#74D4EB" }}
                      />
                    </td>
                  )}
                  {columns.name && (
                    <td>
                      {" "}
                      <BulkEditInput
                        type="text"
                        onBlur={(e) => updateItem("name", item.id, e)}
                        value={item.name}
                        style={{ color: "#AB8D71" }}
                      />
                    </td>
                  )}
                  {columns.alternateName && (
                    <td>
                      {" "}
                      <BulkEditInput
                        type="text"
                        onChange={
                          (e) => e.preventDefault() // updateItemValueLocally(e, index, "altName")
                        }
                        onBlur={(e) => updateItem("altName", item.id, e)}
                        value={item.altName}
                        style={{ color: "#EBA360" }}
                      />{" "}
                    </td>
                  )}
                  {columns.price && (
                    <td>
                      <BulkEditInput
                        type="text"
                        onBlur={(e) => updateItem("price", item.id, e)}
                        value={item.price}
                        style={{ color: "#6F8E96" }}
                      />
                    </td>
                  )}
                  {columns.pricingType && (
                    <td>
                      <BulkEditInput
                        type="text"
                        onBlur={(e) => updateItem("pricingType", item.id, e)}
                        value={item.pricingType}
                        style={{ color: "#6B655F" }}
                      />
                    </td>
                  )}
                  {columns.cost && (
                    <td>
                      <BulkEditInput
                        type="text"
                        onBlur={(e) => updateItem("cost", item.id, e)}
                        value={item.cost}
                        style={{ color: "#9EEB32" }}
                      />
                    </td>
                  )}
                  {columns.discount && (
                    <td>
                      <BulkEditInput
                        type="text"
                        onBlur={(e) => updateItem("discount", item.id, e)}
                        value={item.discount}
                        style={{ color: "#A071AB" }}
                      />
                    </td>
                  )}
                  {columns.tax && (
                    <td>
                      <BulkEditInput
                        type="text"
                        onBlur={(e) => updateItem("tax", item.id, e)}
                        value={item.tax}
                        style={{ color: "#D160EB" }}
                      />
                    </td>
                  )}
                  {columns.sku && (
                    <td>
                      <BulkEditInput
                        type="text"
                        onBlur={(e) => updateItem("sku", item.id, e)}
                        value={item.sku}
                        style={{ color: "#86966F" }}
                      />
                    </td>
                  )}
                  {columns.productCode && (
                    <td>
                      <BulkEditInput
                        type="text"
                        onBlur={(e) => updateItem("productCode", item.id, e)}
                        value={item.productCode}
                        style={{ color: "#695F6B" }}
                      />
                    </td>
                  )}
                  {columns.location && (
                    <td>
                      <BulkEditInput
                        type="text"
                        onBlur={(e) => updateItem("location", item.id, e)}
                        value={item.location}
                        style={{ color: "#EA7C04" }}
                      />
                    </td>
                  )}
                  {columns.isActive && (
                    <td>
                      <BulkEditInput
                        type="text"
                        onBlur={(e) => updateItem("isActive", item.id, e)}
                        value={item.isActive ? "true" : "false"}
                        style={{ color: "#719BAB" }}
                      />
                    </td>
                  )}
                  {columns.track && (
                    <td>
                      <BulkEditInput
                        type="text"
                        onBlur={(e) => updateItem("track", item.id, e)}
                        value={item.track}
                        style={{ color: "#60C6EB" }}
                      />
                    </td>
                  )}
                  {columns.brand && (
                    <td>
                      <BulkEditInput
                        type="text"
                        onBlur={(e) => updateItem("brand", item.id, e)}
                        value={item.brand}
                        style={{ color: "#96836F" }}
                      />
                    </td>
                  )}
                  {/* <td>{item.year}</td> */}
                  {columns.country && (
                    <td>
                      <BulkEditInput
                        type="text"
                        onBlur={(e) => updateItem("country", item.id, e)}
                        value={item.country}
                        style={{ color: "#5F686B" }}
                      />
                    </td>
                  )}
                  {columns.importID && (
                    <td>
                      <BulkEditInput
                        type="text"
                        onBlur={(e) => updateItem("importID", item.id, e)}
                        value={item.importID}
                        style={{ color: "#655EEB" }}
                      />
                    </td>
                  )}
                  {columns.imported && (
                    <td>
                      <BulkEditInput
                        type="text"
                        onBlur={(e) => updateItem("imported", item.id, e)}
                        value={item.imported}
                        style={{ color: "#ABA171" }}
                      />
                    </td>
                  )}

                  {columns.description && (
                    <td>
                      <BulkEditInput
                        type="text"
                        onBlur={(e) => updateItem("description", item.id, e)}
                        value={item.description}
                        style={{ color: "#EBD460" }}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="buttons">
          <BtnPrimary onClick={updateEdited}>Update</BtnPrimary>
        </div>
      </Modal>
    </div>
  );
};

const Import = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <BulkEditModal toggle={props.toggle} />,
        document.getElementById("backdrop-root")
      )}
    </Fragment>
  );
};

export default Import;

const Modal = styled.div`
  width: 70%;
  min-width: 400px;
  min-height: 100px;
  height: 60%;
  background: white;
  box-shadow: 5px 5px 10px var(--shadow-color);
  border-radius: 10px;
  display: flex;
  position: relative;
  flex-direction: column;
  padding: 20px 0px;
  z-index: 2;
  position: relative;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1px var(--primary-black);
    padding: 0px 20px 20px 20px;

    h1 {
      padding: 0 20px;
      border-radius: 0 25px 25px 0;
      position: relative;
      left: -20px;
      background: var(--primary-black);
      color: white;
    }

    span.close {
      font-size: 30px;

      &:hover {
        color: var(--primary-yellow);
      }
      &:active {
        color: var(--primary-black);
      }
    }

    .mid {
      display: flex;
      padding: 5px 20px;
      gap: 20px;

      .search-filter,
      .mode-selector {
        input,
        select {
          height: 30px;
          padding-left: 30px;
          border-radius: 5px;
          outline: none;
          padding-left: 10px;
          color: black;
          ::-webkit-input-placeholder {
            color: var(--primary-grey-2);
          }
        }
      }

      .filter {
        width: 150px;
        height: 30px;
        /* overflow: hidden; */
        border: solid 1px var(--primary-black);
        border-radius: 5px;
        position: relative;

        p {
          span {
            font-size: 20px;
            padding-left: 10px;
          }
          display: flex;
          width: 100%;
          justify-content: space-between;
        }

        .filter-list {
          position: absolute;
          top: 35px;
          left: 0px;
          background: white;
          width: 150%;
          box-shadow: 5px 5px 10px var(--shadow-color);
          border-radius: 5px;
          padding: 10px;
          list-style-type: none;
          height: 250px;
          overflow-y: scroll;

          li {
            margin-bottom: 10px;
            display: flex;
            justify-content: flex-start;
            gap: 10px;
            /* font-size: 18px; */

            input {
              width: 20px;
            }
          }
        }
      }
    }
  }

  .table {
    overflow: scroll;

    table {
      border-collapse: collapse;
    }

    th {
      text-align: left;
      min-width: 200px;
    }

    tr {
      column-gap: 0px;
      td {
        border: var(--primary-black) solid 1px;
        padding-left: 5px;
        /* margin: -5px; */

        input {
          width: 100%;
          display: block;
          border: none;
          outline: none;
        }
      }
    }
  }

  .buttons {
    position: absolute;
    bottom: 10px;
    right: 20px;
  }
`;
