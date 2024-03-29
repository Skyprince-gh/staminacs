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
  const [buttonFillRate, setButtonFillRate] = useState(0);
  const [resizeCount, setResizeCount] = useState(0);
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
      handleResize();
    });
  }, []);

  useEffect(() => {
    // Initial count based on screen width
    handleResize();

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [buttonFillRate, resizeCount]);

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

  const handleResize = () => {
    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    const screenWidth = window.innerWidth;

    // You can adjust the threshold value as needed
    if (screenWidth > 1600) {
      setButtonFillRate(10);
    }
    if (screenWidth > 1400 && screenWidth < 1600) {
      setButtonFillRate(9);
    }
    if (screenWidth > 1200 && screenWidth < 1400) {
      setButtonFillRate(8);
    }
    if (screenWidth > 1000 && screenWidth < 1200) {
      setButtonFillRate(7);
    }
    if (screenWidth > 800 && screenWidth < 1000) {
      setButtonFillRate(6);
    }
    if (screenWidth > 600 && screenWidth < 800) {
      setButtonFillRate(4);
    }
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

    if (currentPage > buttonFillRate - 2) {
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

    if (buttonIndex - currentPage <= buttonFillRate - 3) {
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
    <Fragment>
      {items.length === 0 && (
        <RefreshButton
          onClick={(e) => {
            fetchIventoryItems(100).then((value) => {
              const loaded = value.slice(0, 10);
              setItemsShowing(loaded);
            });
          }}
        >
          Refresh <RefreshOutlined />
        </RefreshButton>
      )}

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
              {new Array(buttonFillRate).fill(0).map((page, index) => {
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
    </Fragment>
  );
};

export default PaginatedList;

const Container = styled.section`
  color: var(--primary-black);
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-start;
  margin-top: 0px;
  overflow-y: scroll;
  padding-top: 10px;
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
  align-items: center;
  padding: 0px 10px;

  @media (max-width: 800px) {
    width: 70%;
  }

  @media (max-width: 600px) {
    bottom: 100px;
    width: 90%;
    box-shadow: 2px 2px 5px var(--shadow-color);
  }

  @media (max-width: 420px) {
    justify-content: space-between;
    width: 200px;
    min-width: 100px;
  }

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

    @media (max-width: 1600px) {
      width: calc(100% - 70px);
    }
    @media (max-width: 420px) {
      display: none;
    }
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

const RefreshButton = styled.button`
  width: 150px;
  height: 30px;
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 20px;
  gap: 20px;
  margin: 0 auto;
  border-radius: 15px;
  background: var(--primary-black);
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  position: relative;
  top: 150px;

  &:hover {
    background-color: transparent;
    color: black;
    border: solid 2px var(--primary-black);
  }
  &:active {
    background-color: var(--primary-yellow);
  }
`;
