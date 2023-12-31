import styled from "styled-components";
import Item from "./Item";
import { db } from "../../util/firebase-store";
import { useSelector, useDispatch } from "react-redux";
import { actions as inventoryActions } from "../../store/inventory";
import { useState, useEffect, Fragment } from "react";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import "animate.css";
import sort from "deep-sort";
import { Refresh, RefreshOutlined } from "@mui/icons-material";

const PaginatedList = () => {
  const items = useSelector((state) => [...state.inventory.items]);
  const userID = useSelector((state) => state.auth.userAuthCred.uid);
  const sortBy = useSelector((state) => state.inventory.sortingPref);
  const orderPref = useSelector((state) => state.inventory.orderPref);
  const searchParams = useSelector((state) => state.inventory.searchParams);
  const categoryFilter = useSelector((state) => state.inventory.categoryFilter);

  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [buttonIndex, setButtonIndex] = useState(1);
  const totalInventoryItems = useSelector(
    (state) => state.inventory.totalItems
  );
  const [itemsShowing, setItemsShowing] = useState([]);
  const [isInitial, setIsInitial] = useState(true); //this shows whether the component is an initial load or not
  const deleteCounter = useSelector((state) => state.inventory.deleteCounter);
  const bulkEditCounter = useSelector(
    (state) => state.inventory.bulkEditCounter
  );
  const itemsSelectedList = useSelector(
    (state) => state.inventory.itemsSelectedList
  );

  const [isInitialChange, setIsInitialChange] = useState(true);
  const [nextIsActive, setNextIsActive] = useState(true);

  useEffect(() => {
    fetchIventoryItems(100).then((value) => {
      const loaded = value.slice(0, 10);
      setItemsShowing(loaded);
    });
  }, []);

  // useEffect(() => {}, [currentPage]);

  useEffect(() => {
    changePage(currentPage);
  }, [orderPref, sortBy, searchParams]);

  useEffect(() => {
    changePage(currentPage);
    console.log("deleteCounter set");
  }, [bulkEditCounter, deleteCounter]);

  const toggleNextButton = (value) => {
    setNextIsActive(value);
  };

  const changePage = (pageNumber) => {
    console.log("items selected:", itemsSelectedList);
    const startPage = (pageNumber - 1) * 10; // 10 is the number of items to show
    const endPage = startPage + 10;
    // const showing = items.slice(startPage, endPage);

    const showing = sort(
      cleanUp(filterBySearch(items)),
      sortBy,
      orderPref
    ).slice(startPage, endPage);

    setItemsShowing(showing);
    setCurrentPage(pageNumber);
    setIsInitialChange(false);
  };

  const goToNext = () => {
    changePage(currentPage + 1);

    if (isInitial) {
      fetchIventoryItems(110).then((value) => {});
      setIsInitial(false);
    }

    if (currentPage > 8) {
      increaseButtonIndex();
    }

    const surplus = items.length - currentPage * 10;

    if (surplus < 50) {
      toggleNextButton(false);
      const loadAmount = 50;
      const allAmount = items.length + loadAmount;
      fetchIventoryItems(allAmount).then((value) => {
        toggleNextButton(true);
      });
    }
  };

  const goToPrevious = () => {
    if (currentPage === 1) {
      changePage(1);
    } else {
      changePage(currentPage - 1);
    }

    if (buttonIndex - currentPage <= 7) {
      decreaseButtonIndex();
    }
  };

  const increaseButtonIndex = () => {
    if (buttonIndex <= numberOfPages) {
      setButtonIndex(buttonIndex + 1);
    }
  };

  const decreaseButtonIndex = () => {
    if (buttonIndex > 1) {
      setButtonIndex(buttonIndex - 1);
    }
  };

  const fetchIventoryItems = async (loadAmount = 100) => {
    let q = "";
    try {
      q = query(
        collection(db, "Users", userID, "Inventory"),
        orderBy("created"),
        limit(loadAmount)
      );
    } catch (err) {
      if (err) {
        return;
      }
    }

    console.log("this is the query object:", q);
    const querySnapshot = await getDocs(q);
    const ITEMS = new Set();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.created = data.created.seconds;

      ITEMS.add(data);
    });

    // setLoadMoreIsVisible(true);

    dispatch(inventoryActions.updateItems(ITEMS));
    const nOfPages = Math.floor(totalInventoryItems / 10) + 1;
    console.log("number of Pages", nOfPages, "/", totalInventoryItems);
    setNumberOfPages(nOfPages);
    return [...ITEMS];
  };

  const filterBySearch = (items) => {
    const indexes = items.map((item) => {
      return {
        object: item,
        stringified: JSON.stringify({
          name: item.name,
          altName: item.altName,
          id: item.id,
          productCode: item.productCode,
          description: item.description,
        }),
      };
    });

    const filteredIndexes = indexes
      .filter((idx) => {
        if (
          idx.stringified.toLowerCase().includes(searchParams.toLowerCase())
        ) {
          return true;
        } else return false;
      })
      .map((idx) => idx.object);

    return filteredIndexes;
  };

  const cleanUp = (items) => {
    const obj = {};

    items.forEach((item) => {
      obj[`${item.id}`] = item;
    });

    const values = Object.values(obj);
    return values;
  };

  return (
    <Container>
      {items.length !== 0 &&
        sort(cleanUp(filterBySearch(itemsShowing)), sortBy, orderPref)
          .filter((item) => {
            if (categoryFilter === "all") {
              return true;
            } else {
              return item.category === categoryFilter ? true : false;
            }
          })
          .map((item, index) => <Item data={item} key={item.id + index} />)}

      {items.length > 0 && (
        <Controls>
          <button className="index" onClick={goToPrevious}>
            previous
          </button>
          <div className="mid">
            {new Array(10).fill(0).map((page, index) => {
              return (
                <button
                  className={
                    currentPage === index + buttonIndex ? "current" : ""
                  }
                  onClick={(e) => changePage(index + buttonIndex)}
                  key={index + buttonIndex}
                >
                  {index + buttonIndex}
                </button>
              );
            })}
          </div>
          {nextIsActive && (
            <button className="index" onClick={goToNext}>
              Next
            </button>
          )}
          {!nextIsActive && (
            <div className="">
              <RefreshOutlined />
            </div>
          )}
        </Controls>
      )}
    </Container>
  );
};

export default PaginatedList;

const Container = styled.section`
  color: var(--primary-black);
  display: flex;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 4rem - 80px - 10px - 5rem);
  justify-content: flex-start;
  /* margin: 0 auto; */
  margin-top: 0px;
  overflow-y: scroll;
  padding-top: 10px;
  /* position: relative; */

  div.loadMore {
    width: 100%;
    height: 100px;
    margin-top: 50px;
    display: flex;
    justify-content: center;
  }
`;

const Controls = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-between;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  min-width: 300px;
  height: 50px;
  background: white;
  gap: 20px;
  border-radius: 25px;

  button {
    border-radius: 15px;
    height: 30px;
    width: 20px;
    background: var(--primary-black);
    border: none;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 20px;

    &:hover {
      color: var(--primary-yellow);
    }

    &:active {
      background: white;
      border: solid 1px var(--primary-black);
    }
  }

  button.current {
    color: var(--primary-black);
    border: solid var(--primary-black) 1px;
    background: transparent;
  }

  .index {
    padding: 5px 10px;
    min-width: 50px;
    width: auto;
  }

  .mid {
    width: calc(100% - 200px);
    display: flex;
    /* border: solid green 1px; */
    justify-content: space-between;
    overflow: hidden;
  }

  div.loading-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px auto 0 auto;

    animation: spin 0.5s infinite linear;
    transform-origin: center center;

    svg {
      width: 30px;
      height: 30px;
      color: var(--primary-grey-2);
    }

    @keyframes spin {
      100% {
        transform: rotate(360deg);
      }
    }
  }
`;
