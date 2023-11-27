import styled from "styled-components";
import Item from "./Item";
import { db } from "../../util/firebase-store";
import { useSelector, useDispatch } from "react-redux";
import { actions as inventoryActions } from "../../store/inventory";
import { useState, useEffect, Fragment } from "react";
import { collection, query, orderBy, getDocs, limit } from "firebase/firestore";
import "animate.css";
import BtnPrimary from "../Buttons/Buttons";
import { Refresh} from "@mui/icons-material";
import sort from "deep-sort";

const ItemsListContainer = () => {
  const items = useSelector((state) => [...state.inventory.items]);
  const userID = useSelector((state) => state.auth.userAuthCred.uid);
  const sortBy = useSelector((state) => state.inventory.sortingPref);
  const orderPref = useSelector((state) => state.inventory.orderPref);
  const searchParams = useSelector((state) => state.inventory.searchParams);
  const categoryFilter = useSelector((state) => state.inventory.categoryFilter);
  const dispatch = useDispatch();
  const [loadAmount, setLoadAmount] = useState(10);
  const [currentLoadOffset, setCurrentLoadOffset] = useState(0); //offsets the load amount by increments of ten so animations could load faster
  const [loadMoreIsVisible, setLoadMoreIsVisible] = useState(false);
  const [loadingIconIsVisible, setLoadingIconIsVisible] = useState(false);


  useEffect(() => {
    console.log("changed Items:", items); 
  }, [items]);

  // const fetchIventoryItems = async () => {
  //   const q = query(
  //     collection(db, "Users", userID, "Inventory"),
  //     orderBy("created"),
  //     limit(loadAmount)
  //   );
  //   console.log("this is the query object:", q);
  //   const querySnapshot = await getDocs(q);
  //   const ITEMS = new Set();
  //   querySnapshot.forEach((doc) => {
  //     const data = doc.data();
  //     data.created = data.created.seconds;

  //     ITEMS.add(data);
  //   });

  //   setLoadMoreIsVisible(true);
    
  //   if ([...items].length !== [...ITEMS].length) {
  //           dispatch(inventoryActions.updateItems(ITEMS));
  //     setLoadingIconIsVisible(false);
  //   }
  //   if ([...ITEMS].length === 0) {
  //     setLoadMoreIsVisible(false);
  //   }
  // };
 

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
      <Fragment>
        {items.length !== 0 &&
          sort(cleanUp(filterBySearch(items)), sortBy, orderPref)
            .filter((item) => {
              if (categoryFilter === "all") {
                return true;
              } else {
                return item.category === categoryFilter ? true : false;
              }
              
            })
            .map((item, index) => (
              <Item
                data={item}
                animateDelay={(index - currentLoadOffset + 1) * 200}
                key={item.id}
              />
            ))}
        
        {loadingIconIsVisible && (
          <div className="loading-icon">
            <Refresh />
          </div>
        )}
        {items.length === 0 && (
          <div className="loadMore">
            <BtnPrimary onClick={LoadMore}>Refresh</BtnPrimary>
          </div>
        )}
        {loadMoreIsVisible && (
          <div className="loadMore">
            <BtnPrimary onClick={LoadMore}>Load More</BtnPrimary>
          </div>
        )}
      </Fragment>
    </Container>
  );
};

export default ItemsListContainer;

const Container = styled.section`
  color: var(--primary-black);
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70vh;
  justify-content: flex-start;
  margin: 0 auto;
  margin-top: 0px;
  overflow-y: scroll;
  padding-top: 10px;

  div.loadMore {
    width: 100%;
    height: 100px;
    margin-top: 50px;
    display: flex;
    justify-content: center;
  }

  div.loading-icon {
    width: 50px;
    height: 50px;
    display: flex; 
    justify-content: center;
    align-items: center;
    margin: 20px auto 0 auto;
    animation: spin 0.5s infinite linear;

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
