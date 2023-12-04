import { useState, useEffect } from "react";
import styled from "styled-components";
import MainLoading from "../../Components/MainLoading";
import Inventory from "./Inventory";
import Home from "./Home";
import { Route, Routes } from "react-router-dom";
import "animate.css";
import RightSidebar from "../../Components/Menus/Right_Sidebar";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../../util/firebase-store";
import { useSelector, useDispatch } from "react-redux";
import { actions as authActions } from "../../store/auth";

const Dashboard = () => {
  const userID = useSelector((state) => state.auth.userAuthCred.uid);
  const [isLoading, setIsLoading] = useState(true);
  const userImages_StorageReference = ref(storage, `${userID}/images/userImage`);
  const dispatch = useDispatch()

  useState(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  // useEffect(()=> {
  //   getDownloadURL(userImages_StorageReference).then(url => {
  //     dispatch(authActions.setUserImageURL(url))
  //   })
  // }, [])

  return (
    <Grid>
      {isLoading && <MainLoading />}
      <Console>
        <Workspace>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
          <Routes>
            <Route path="/home" element={<Home />} />
          </Routes>
          <Routes>
            <Route path="/inventory" element={<Inventory />} />
          </Routes>
          {/* <Routes>
            <Route path="/inventory/add-item" element={<AddItem />} />
          </Routes> */}
          <Routes>
            {/* <Route
              path="/inventory/edit-item/:productID"
              element={<EditItem />}
            /> */}
          </Routes>
        </Workspace>
        <RightSidebar />
      </Console>
    </Grid>
  );
};

export default Dashboard;

const Grid = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  height: 100vh;
  width: 100vw;
  flex-direction: row;
  background: var(--primary-yellow);
  overflow: hidden;
`;

const Console = styled.div`
  background: white;
  position: relative;
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow: hidden;
  box-shadow: 5px 5px 5px var(--shadow-color), -5px 5px 5px var(--shadow-color);
`;

const Workspace = styled.section`
  width: calc(100% - 200px);
  height: 100%;
`;
