import { useEffect, useState } from "react";
import styled from "styled-components";
import "animate.css";
import { getDocumentByID } from "../../util/firebase-store";
import { useDispatch, useSelector } from "react-redux";
import { actions as inventoryActions } from "../../store/inventory";

const IndexerList = (props) => {
  const [matches, setMatches] = useState([]);
  const userID = useSelector((state) => state.auth.userAuthCred.uid);
  const dispatch = useDispatch();
  // const items =
  useEffect(() => {
    const m = props.indexes.filter((index) => {
      //props.items is a special object passed into the array with the id of the  obejct in mind
      if (
        index.stringified
          .toLowerCase()
          .includes(props.searchParam.toLowerCase())
      ) {
        return true;
      } else {
        return false;
      }
    });
    setMatches(m);
  }, [props.searchParam]);

  useEffect(() => {
    
  }, []) 

  const returnValue = (length) => {
    if (length > 0) {
      return matches;
    } else if (length <= 0) {
      return [{ object: { name: "No Matches Found" }, stringified: "" }];
    }
  };

  const fetchAndAddToItems = (obj) => {
    //fetches a single Item at a time
    dispatch(inventoryActions.switchLoadingIcon(true))
    console.log("user:", userID)
    getDocumentByID("Users", userID, "Inventory", obj.id).then((docSnap) => {
      const docData = docSnap.data();
      console.log("document feteched from search:", docData);
      dispatch(inventoryActions.addItem(docData));
      dispatch(inventoryActions.seBulkEditUpdateCounter());
      dispatch(inventoryActions.switchLoadingIcon(false))
    });

    props.turnOff()
  };

  return (
    <Indexer className="animate__animated animate__fadeIn">
      {returnValue(props.searchParam.length).map((match, index) => (
        <ListItem
          onClick={(e) => fetchAndAddToItems(match.object)}
          key={match.stringified + index}
        >
          {match.object.name}
        </ListItem>
      ))}{" "}
    </Indexer>
  );
};

export default IndexerList;

const Indexer = styled.ul`
  width: 20rem;
  height: 15rem;
  background: var(--primary-black);
  border-radius: 10px;
  position: absolute;
  top: 110%;
  left: 0%;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    background-color: transparent;
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--primary-grey-2);
    height: 30px;
    width: 5px !important;
    border-radius: 2.5px;
  }
`;

const ListItem = styled.li`
  width: 100%;
  height: 30px;
  border-bottom: 1px solid var(--primary-grey);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: white;
  padding-left: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  /* z-index:20; */

  &:hover {
    color: var(--primary-yellow);
    background: var(--primary-grey-2);
  }
`;
