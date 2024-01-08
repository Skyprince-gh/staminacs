import styled from "styled-components";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import "animate.css";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions as inventoryActions } from "../../store/inventory";
import Input from "../Inputs/Input";

const Item = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [isSelect, setIsSelect] = useState(false);
  const selectAll = useSelector((state) => state.inventory.selectAll);
  const inventoryItems = useSelector((state) => state.inventory.items);
  const itemsSelectedList = useSelector(
    (state) => state.inventory.itemsSelectedList
  );
  const currentEdit = useSelector((state) => state.inventory.currentEdit);
  const currentExpansion = useSelector(
    (state) => state.inventory.currentExpansion
  );
  const editIsToggled = useSelector((state) => state.inventory.editIsToggled);
  const [itemData, setItemData] = useState(props.data);
  const dispatch = useDispatch();

  useEffect(() => {
    generateColorImageUrl();
  }, []);

  useEffect(() => {
    // handleCheckbox(selectAll);
    if (itemData.id === currentExpansion) {
      setIsExpanded(true);
    } else if (itemData.id !== currentExpansion) {
      setIsExpanded(false);
    }
  }, [selectAll, currentExpansion, itemData]);

  useEffect(() => {
    if (currentEdit.id === itemData.id) {
      setItemData(currentEdit);
    }
  }, [inventoryItems]);

  useEffect(() => {
    if (selectAll === false) {
      setIsSelect(false);
    }
  }, [selectAll]);

  useEffect(() => {
    itemsSelectedList.forEach((item) => {
      if (itemData.id === item) {
        setIsSelect(true);
        console.log("match");
      }
    });
  }, [selectAll]);

  const toggleExpand = (event) => {
    setIsExpanded(!isExpanded);
    //send this to expansion list and make sure that it is the current expansion
    dispatch(inventoryActions.setCurrentExpansion(itemData.id));
    if (showExtra === false) {
      setTimeout(() => {
        setShowExtra(!showExtra);
      }, 500);
    } else {
      setShowExtra(false);
      dispatch(inventoryActions.setCurrentExpansion(""));
    }
  };

  const generateColorImageUrl = () => {
    // List of visible light to dark hues of various colors
    const colors = ["27BD79", "FBFF5E", "333333", "7EB3EB", "FB9CCE"];

    // Select a random color from the list
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    // Generate a URL for a 100x100 solid color image
    const imageUrl = `https://placehold.co/400x400/${randomColor}/${randomColor}`;

    // console.log("imageURL: ", itemData.image);
    if (itemData.image === "") {
      setItemData({ ...itemData, image: imageUrl });
    }

    // setDefaultImageSource(imageUrl);
  };

  // const handleCheckbox = (value) => {
  //   setIsSelect(value);

  //   if (value) {
  //     //add to the menu
  //     dispatch(inventoryActions.addItemToSelectedList(itemData.id));
  //     dispatch(inventoryActions.addItemToCurrentEdit(itemData.id));
  //   } else if (value === false) {
  //     //remove from the list.
  //     dispatch(inventoryActions.removeItemFromSelectedList(itemData.id));
  //     dispatch(inventoryActions.removeItemFromCurrentEdit());
  //   }
  // };

  const toggleCheckbox = () => {
    setIsSelect(!isSelect);

    const value = !isSelect;

    if (value === true) {
      //add to the menu
      dispatch(inventoryActions.addItemToSelectedList(itemData.id));
      dispatch(inventoryActions.addItemToCurrentEdit(itemData.id));
    } else if (value === false) {
      //remove from the list.
      dispatch(inventoryActions.removeItemFromSelectedList(itemData.id));
      dispatch(inventoryActions.removeItemFromCurrentEdit());
    }
  };

  const handleMoreInfo = (event) => {
    event.preventDefault();
    dispatch(inventoryActions.addItemToCurrentEdit(itemData.id));
    dispatch(inventoryActions.toggleEdit());
  };

  return (
    <Grid
      expanded={isExpanded}
      // delay={props.animateDelay}
      className={`animate__animated animate__fadeInDown animate__faster`}
    >
      <div className="select-cover" onClick={toggleCheckbox}></div>
      {!isExpanded && <div className="trigger" onClick={toggleExpand}></div>}
      {!isExpanded && (
        <div className="main-info">
          <span className="select">
            {/* <Input
              type="checkbox"
              name="isSelected"
              onChecked={(e) => handleCheckbox(e.target.checked)}
              value={isSelect}
            /> */}
            <SelectCircle
              expanded={isExpanded}
              className="circle"
              onClick={toggleCheckbox}
            >
              {isSelect && <div className="inner"></div>}
            </SelectCircle>
          </span>
          <span className="image">
            {!isExpanded && (
              <ProductImage
                src={itemData.image}
                alt={itemData.name + " " + "image"}
              />
            )}
          </span>
          <span className="id">{itemData.id}</span>
          <span className="name">{itemData.name}</span>
          <span className="quantity">{itemData.quantity}</span>
          <span className="price">${itemData.price}</span>
          <span className="sku">{itemData.sku}</span>
          <span className="description">{itemData.description}</span>
          <button>
            {!isExpanded && <KeyboardArrowDown />}
            {/* {isExpanded && <KeyboardArrowUp />} */}
          </button>
        </div>
      )}

      {isExpanded && (
        <MoreInfo editMode={editIsToggled}>
          <div className="controls">
            <span className="select">
              {/* <Input
                type="checkbox"
                name="isSelected"
                onChecked={(e) => handleCheckbox(e.target.checked)}
                value={isSelect}
              /> */}
              <SelectCircle
                expanded={isExpanded}
                className="circle"
                onClick={toggleCheckbox}
              >
                {isSelect && <div className="inner"></div>}
              </SelectCircle>
            </span>
            <div className="buttons">
              {isExpanded && (
                <button onClick={handleMoreInfo}>Edit Item</button>
              )}

              <button onClick={toggleExpand}>
                {!isExpanded && <KeyboardArrowDown />}
                {isExpanded && <KeyboardArrowUp />}
              </button>
            </div>
          </div>
          {showExtra && (
            <div className="animate__animated animate__fadeIn show-exta">
              <div className="image">
                <img src={itemData.image} alt={itemData.name} />
              </div>
              <div className="info">
                <span className="info-name">
                  <h5>Product Name</h5>
                  <p>{itemData.name}</p>
                </span>

                <span>
                  <h5>ID Number</h5>
                  <p>{itemData.id}</p>
                </span>

                <span>
                  <h5>Brand</h5>
                  <p>{itemData.brand}</p>
                </span>

                <span>
                  <h5>Price</h5>
                  <p>{itemData.price}</p>
                </span>

                <span>
                  <h5>Product Year</h5>
                  <p>{itemData.year}</p>
                </span>

                <span>
                  <h5>Made In</h5>
                  <p>{itemData.country}</p>
                </span>

                <span>
                  <h5>Discount</h5>
                  <p>{itemData.discount}%</p>
                </span>

                <span>
                  <h5>SKU | Barcode</h5>
                  <p>{itemData.sku | " "}</p>
                </span>

                <span>
                  <h5>Quantity</h5>
                  <p>{itemData.quantity}</p>
                </span>

                <span className="tags">
                  <h5>Tags</h5>
                  {!editIsToggled &&
                    itemData.tags.map((tag) => <p key={tag}>{tag}</p>)}
                </span>
                <span>
                  <h5>Description</h5>
                  <p>{itemData.description}</p>
                </span>
              </div>
            </div>
          )}
        </MoreInfo>
      )}
    </Grid>
  );
};

export default Item;

const Grid = styled.div`
  width: 90%;
  height: ${(props) => (props.expanded ? "300px" : "60px")};
  background: ${(props) => (props.expanded ? "var(--primary-black)" : "")};
  color: ${(props) => (props.expanded ? "white" : "black")};
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: ${(props) => (props.expanded ? "flex-start" : "center")};
  transition: 0.3s ease-in-out;
  position: relative;
  bottom: ${(props) => (props.expanded ? "1px" : "")};
  border: ${(props) =>
    props.expanded ? "solid 1px var(--primary-black)" : ""};
  border-radius: ${(props) => (props.expanded ? "10px" : "")};
  margin: 0 auto;
  border-top: solid black 1px;
  transform: ${(props) => (props.expanded ? "scaleX(1.05)" : "scaleX(1)")};
  animation-delay: ${(props) => props.delay + "ms"};

  @media (max-width: 1400px) {
    height: ${(props) => (props.expanded ? "400px" : "")};
  }
  @media (max-width: 800px) {
    height: ${(props) => (props.expanded ? "800px" : "")};
  }

  .select-cover {
    position: absolute;
    height: 100%;
    width: 60px;
    z-index: 2;
    top: 0px;
    left: 0px;
    background: transparent;
  }

  .trigger {
    position: absolute;
    z-index: 2;
    width: 97%;
    right: 0px;
    height: 100%;
    background: transparent;

    cursor: ns-resize;
  }

  button,
  input {
    margin: 0px;
    color: ${(props) => (props.expanded ? "" : "black")};
  }

  button {
    background: none;
    border: none;
    justify-self: end;
  }

  &:hover {
    background: var(--primary-black);
    border-radius: 15px;
    border-top: none;
    color: white;
    width: 95%;

    button {
      color: white;
    }

    .circle {
      border-color: white;
    }
  }

  .circle {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    .inner {
      width: 10px;
      height: 10px;
    }
  }

  &:hover + & {
    border-top: none;
  }

  /* background: red; */
  div.main-info {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: ${(props) => (props.expanded ? "130px" : "100%")};
    position: relative;

    span {
      font-weight: bold;
      display: inline-block;
    }

    span.select {
      width: 50px;
    }

    span.image {
      width: 100px;
      height: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }

    span.id,
    span.quantity,
    span.price,
    span.sku {
      width: 10%;
      /* text-align: left; */
    }

    span.id {
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
    }

    span.tags {
      width: 100%;
    }

    span.name {
      width: 15%;
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
    }

    span.description {
      width: calc(30%);
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
      padding-right: 40px;
    }

    button {
      height: 100%;
      display: flex;
      align-items: ${(props) => (props.expanded ? "flex-start" : "center")};
      width: auto;
      margin-left: auto;
      background: none;
      border: none;
      outline: none;
      position: absolute;
      right: 10px;
    }

    @media (max-width: 1400px) {
      span.sku {
        display: none;
      }
    }

    @media (max-width: 1200px) {
      font-size: 16px;
    }

    @media (max-width: 900px) {
      justify-content: space-between;
      span.description {
        display: none;
      }
      span.image {
        width: 50px;
        height: 50px;
      }

      button {
        left: 0px;
        top: 0px;
        background: green;
        width: 85%;
        height: 100%;
        right: 0px;
        display: none;
      }
    }

    @media (max-width: 600px) {
    }

    @media (max-width: 500px) {
      span.quantity {
        display: none;
      }
      span.id {
        display: none;
      }
      span.name {
        flex-grow: 1;
      }
      span.image{
        margin-right: 10px;
      }
    }
    @media (max-width: 350px) {
      justify-content: start;
      gap: 2rem;

      span.id {
        display: none;
      }
      span.image {
        width: 30px;
        height: 30px;
        margin: 0px;
      }
      span.price {
        flex-grow: 1;
      }
    }
  }

  @media (max-width: 1600px) {
    width: 90%;
  }

  @media (max-width: 600px) {
    width: 95%;
  }
`;

const SelectCircle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: solid 1px
    ${(props) =>
      props.expanded ? "var(--primary-yellow)" : "var(--primary-black)"};
  margin-left: 10px;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  .inner {
    width: 10px;
    height: 10px;
    border-radius: 7.5px;
    background: var(--primary-yellow);
  }
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  display: block;
  border: solid 1px var(--primary-grey-2);
  border-radius: 10px;
`;

const MoreInfo = styled.section`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  align-items: flex-end;
  height: 300px;
  position: relative;
  color: white;

  @media (max-width: 1400px) {
    height: 400px;
  }
  @media (max-width: 800px) {
    height: 800px;
    flex-grow: 1;
  }

  .controls {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    margin: 0 auto;
    height: 40px;
    /* border: solid orange 1px; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px;

    button {
      color: white;
      margin-top: 10px;
      border-radius: 10px;
      font-weight: bold;

      &:hover {
        color: white;
      }
      &:active {
        color: black;
      }
    }

    button:nth-child(1) {
      z-index: 3;
    }

    button:nth-child(2) {
      position: absolute;
      left: 0px;
      top: 0px;
      height: 100px;
      opacity: 0;
      width: 100%;
      z-index: 0;
    }

    .buttons {
      display: flex;
      justify-content: space-around;
      width: 200px;
      align-items: center;
      height: 40px;

      button:nth-child(1) {
        color: black;
        background: var(--primary-yellow);
        height: 30px;
        padding: 5px 10px;

        &:hover {
          color: white;
        }
        &:active {
          color: black;
        }
      }
    }
  }

  div {
    display: flex;
    width: 100%;
    padding: 10px;
    height: 90%;
    justify-content: flex-start;

    div.image {
      height: 80%;
      width: 20%;
      display: flex;
      justify-content: center;
      overflow: hidden;
      /* border: solid red 1px; */

      @media (max-width: 1600px) {
        width: 150px;
        height: 150px;
      }
      @media (max-width: 1400px) {
        width: 120px;
        height: 120px;
      }

      @media (max-width: 400px) {
        width: 100px;
        height: 100px;
      }

      &:hover {
        border: ${(props) =>
          props.editMode ? "solid 1px var(--primary-black)" : "none"};
      }
      &:active {
        border: ${(props) =>
          props.editMode ? "solid 1px var(--primary-yellow)" : "none"};
      }

      img {
        height: 100%;
      }
    }

    div.info {
      width: 100%;
      height: 100%;
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      padding: 30px;
      margin-left: 2em;
      flex-wrap: wrap;
      row-gap: 10px;
      gap: 10px;

      input,
      select {
        width: 100%;
        padding: 5px;
        max-width: 150px;
        border: solid var(--primary-black) 2px;
        border-radius: 5px;
      }

      span.info-name {
        p {
          text-overflow: ellipsis;
          overflow-x: hidden;
          white-space: nowrap;
        }
      }

      span {
        display: block;
        min-width: 150px;
        /* flex-direction: column; */
        justify-content: flex-start;
        h5 {
          font-size: 1rem;
          color: var(--primary-yellow);
        }
        p {
          font-size: 1.2rem;
          font-weight: bold;
          color: white;
          /* background: red; */
        }

        @media (max-width: 1200px) {
          font-size: 16px;
          h5 {
            font-size: 1.2rem;
            color: var(--primary-yellow);
          }
          p {
            font-size: 1.6rem;
          }
        }
      }

      span.tags {
        display: block;

        p {
          min-width: 20px;
          font-size: 12px;
          line-height: 5px;
          display: inline-block;
          margin-right: 5px;
          padding: 5px;
          height: 16px;
          border-radius: 6px;
          background: var(--primary-grey-2);
          color: var(--primary-black);
          text-align: center;
          vertical-align: middle;
        }
      }
    }
  }
`;
