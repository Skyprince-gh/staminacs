import { Navigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { getDocumentByID } from "../../util/firebase-store";
import {
  HomeOutlined,
  Inventory2Outlined,
  ContentPasteOutlined,
  AccessTime,
  NotificationsOutlined,
  ReceiptOutlined,
  ChatBubbleOutline,
  Settings,
  CreditCard,
} from "@mui/icons-material";
import styled from "styled-components";
import QuickUserSettings from "./QuickUserSettings";
import { actions as authActions } from "../../store/auth";
import { storage } from "../../util/firebase-store";
import { getDownloadURL,ref } from "firebase/storage";

const RightSidebar = () => {
  const UserName = useSelector((state) => state.auth.userData.firstName);
  const [quickUserSettingsIsActive, setQuickUserSettingsIsActive] =
    useState(false);
  const dispatch = useDispatch();

  const userImageURL = useSelector((state) => state.auth.userImageURL);
  const userID = useSelector((state) => state.auth.userAuthCred.uid);
  const userImages_StorageReference = ref(
    storage,
    `${userID}/images/userImage`
  );

  const toggleSignOut = () => {
    setQuickUserSettingsIsActive(!quickUserSettingsIsActive);
  };

  useEffect(() => {
    getDownloadURL(userImages_StorageReference).then((url) => {
      dispatch(authActions.setUserImageURL(url));
    });
  }, []);

  return (
    <Fragment>
      {quickUserSettingsIsActive && (
        <QuickUserSettings toggle={toggleSignOut} />
      )}
      {!quickUserSettingsIsActive && (
        <RSideBar toggled={quickUserSettingsIsActive}>
          <div className="user-info">
            {!quickUserSettingsIsActive && (
              <UserImg src={userImageURL} onClick={toggleSignOut} />
            )}
            {!quickUserSettingsIsActive && (
              <Fragment>
                <h4 className="userName">
                  {" "}
                  <span>{UserName}</span>
                </h4>
                <p>Store Manager</p>
              </Fragment>
            )}
          </div>

          {!quickUserSettingsIsActive && (
            <Fragment>
              <div className="menu">
                <ul>
                  <li>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "isActiveLink" : ""
                      }
                      to="/dashboard/home"
                    >
                      <HomeOutlined />
                      <span>Home</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "isActiveLink" : ""
                      }
                      to="/dashboard/inventory"
                    >
                      <Inventory2Outlined />
                      <span>Inventory</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "isActiveLink" : ""
                      }
                      to="/dashboard/tasks"
                    >
                      <ContentPasteOutlined />
                      <span>Tasks</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "isActiveLink" : ""
                      }
                      to="/dashboard/history"
                    >
                      <AccessTime />
                      <span>History</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "isActiveLink" : ""
                      }
                      to="/dashboard/updates"
                    >
                      <NotificationsOutlined />
                      <span>Updates</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "isActiveLink" : ""
                      }
                      to="/dashboard/invoice"
                    >
                      <ReceiptOutlined />
                      <span>Invoice</span>
                    </NavLink>
                  </li>
                </ul>
              </div>

              <div className="extraMenu">
                <ul>
                  <li>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "isActiveLink" : ""
                      }
                      to="/dashboard/chat"
                    >
                      <ChatBubbleOutline />
                      <span>Chat</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "isActiveLink" : ""
                      }
                      to="/dashboard/billing"
                    >
                      <CreditCard />
                      <span>Billing</span>
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "isActiveLink" : ""
                      }
                      to="/dashboard/settings"
                    >
                      <Settings />
                      <span>Settings</span>
                    </NavLink>
                  </li>
                </ul>
              </div>
            </Fragment>
          )}
        </RSideBar>
      )}
    </Fragment>
  );
};

export default RightSidebar;

const RSideBar = styled.nav`
  width: ${(props) => (props.toggled ? "400px" : "200px")};
  position: absolute;
  right: 0px;
  top: 0px;
  height: 100%;
  background: ${(props) =>
    props.toggled ? "transparent" : "var(--primary-black)"};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  z-index: 3;
  transition: 0.5s;

  div.user-info {
    position: static;
    height: 150px;
  }

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-top: 30px;
    /* position: relative; */

    ul {
      list-style: none;
      width: 100%;

      li a {
        height: 30px;
        display: flex;
        margin: 20px auto;
        align-items: center;
        padding-left: 20px;
      }

      span {
        display: inline-block;
        padding-left: 10px;
      }
    }
  }

  .extraMenu {
    position: absolute;
    bottom: 20px;
  }
`;

const UserImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  margin-bottom: 10px;
  transition: 0.3s ease-in;

  position: relative;

  &:hover {
    box-shadow: 5px 10px 15px var(--shadow-color3);
  }
  &:active {
    border: 1px solid var(--primary-black);
  }
`;

{
  /* <a target="_blank" href="https://icons8.com/icon/98957/user">User</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> */
}
