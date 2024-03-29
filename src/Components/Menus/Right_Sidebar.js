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
  ArrowUpward,
  ArrowUpwardOutlined,
  ExpandLess,
} from "@mui/icons-material";
import styled from "styled-components";
import QuickUserSettings from "./QuickUserSettings";
import { actions as authActions } from "../../store/auth";
import { storage } from "../../util/firebase-store";
import { getDownloadURL, ref } from "firebase/storage";

const RightSidebar = () => {
  const UserName = useSelector((state) => state.auth.userData.firstName);
  const [quickUserSettingsIsActive, setQuickUserSettingsIsActive] =
    useState(false);
  const [bottomMenuIsActive, setBottomMenuIsActive] = useState(false);
  const [defaultMenuIsActivated, setDefaultMenuIsActivated] = useState(true);
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

  const triggerBottomMenu = () => {
    setBottomMenuIsActive(!bottomMenuIsActive);
  };
  const toggleBottomMenu = () => {
    if (bottomMenuIsActive) {
      setBottomMenuIsActive(!bottomMenuIsActive);
    }
  };

  const activateDefaultMenu = () => {
    setDefaultMenuIsActivated(true);
  };

  const deactivateDefaultMenu = () => {
    setDefaultMenuIsActivated(false);
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
              </Fragment >
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

      {!quickUserSettingsIsActive && (
        <BottomMenu
          toggled={bottomMenuIsActive}
          defaultIsActivated={defaultMenuIsActivated}
        >
          <Fragment>
            <div className="pullMenu" onClick={triggerBottomMenu}>
              <ExpandLess />
            </div>
              <div className="user-info">
                {bottomMenuIsActive && (
                  <UserImg src={userImageURL} onClick={toggleSignOut} />
                )}
                {bottomMenuIsActive && (
                  <div className="cred">
                    <h4 className="userName">
                      {" "}
                      <span>{UserName}</span>
                    </h4>
                    <p>Store Manager</p>
                  </div>
                )}
              </div>
            <div className="menu">
              <ul>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "isActiveLinkB default"
                        : "isNotActiveLinkB default"
                    }
                    to="/dashboard/home"
                    onClick={(e) => {
                      toggleBottomMenu();
                      activateDefaultMenu();
                    }}
                  >
                    <HomeOutlined />
                    <span>Home</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "isActiveLinkB  mid currentActive"
                        : "isNotActiveLinkB special "
                    }
                    to="/dashboard/inventory"
                    onClick={(e) => {
                      toggleBottomMenu();
                      deactivateDefaultMenu();
                    }}
                  >
                    <Inventory2Outlined />
                    <span>Inventory</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "isActiveLinkB  mid currentActive"
                        : "isNotActiveLinkB"
                    }
                    to="/dashboard/tasks"
                    onClick={(e) => {
                      toggleBottomMenu();
                      deactivateDefaultMenu();
                    }}
                  >
                    <ContentPasteOutlined />
                    <span>Tasks</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "isActiveLinkB  mid currentActive"
                        : "isNotActiveLinkB"
                    }
                    to="/dashboard/history"
                    onClick={(e) => {
                      toggleBottomMenu();
                      deactivateDefaultMenu();
                    }}
                  >
                    <AccessTime />
                    <span>History</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "isActiveLinkB  mid currentActive"
                        : "isNotActiveLinkB"
                    }
                    to="/dashboard/updates"
                    onClick={(e) => {
                      toggleBottomMenu();
                      deactivateDefaultMenu();
                    }}
                  >
                    <NotificationsOutlined />
                    <span>Updates</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "isActiveLinkB  mid currentActive"
                        : "isNotActiveLinkB"
                    }
                    to="/dashboard/invoice"
                    onClick={(e) => {
                      toggleBottomMenu();
                      deactivateDefaultMenu();
                    }}
                  >
                    <ReceiptOutlined />
                    <span>Invoice</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "isActiveLinkB  mid currentActive"
                        : "isNotActiveLinkB"
                    }
                    to="/dashboard/chat"
                    onClick={(e) => {
                      toggleBottomMenu();
                      deactivateDefaultMenu();
                    }}
                  >
                    <ChatBubbleOutline />
                    <span>Chat</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "isActiveLinkB  mid currentActive"
                        : "isNotActiveLinkB"
                    }
                    to="/dashboard/billing"
                    onClick={(e) => {
                      toggleBottomMenu();
                      deactivateDefaultMenu();
                    }}
                  >
                    <CreditCard />
                    <span>Billing</span>
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive
                        ? "isActiveLinkB default"
                        : "isNotActiveLinkB default"
                    }
                    to="/dashboard/settings"
                    onClick={(e) => {
                      toggleBottomMenu();
                      activateDefaultMenu();
                    }}
                  >
                    <Settings />
                    <span>Settings</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </Fragment>
        </BottomMenu>
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
  justify-content: space-between;
  z-index: 3;
  transition: 0.2s;

  /* **************************************************************** */
  /* normal styles */
  /* ************************************************************** */

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
    position: relative;

    ul {
      list-style: none;
      width: 100%;

      li a {
        height: 30px;
        display: flex;
        margin: 2vh auto;
        align-items: center;
        padding-left: 20px;
        /* border: solid green 2px; */
      }

      span {
        display: inline-block;
        padding-left: 10px;
      }
    }
  }

  .extraMenu {
    /* position: absolute; */
    bottom: 2%;
  }

  /* ************************************************* */
  /* Media queries */
  /* ************************************************* */

  @media (max-width: 1600px) {
    width: 70px;
    justify-content: space-between;

    div.user-info {
      height: 60px;
      h4,
      p {
        display: none;
      }

      img {
        width: 50px;
        height: 50px;
      }
    }

    div {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      margin-top: 3rem;
      position: relative;

      ul {
        list-style: none;
        width: 100%;

        li a {
          height: 3rem;
          display: flex;
          align-items: center;
          /* border: solid green 1px; */
          justify-items: center;

          span {
            display: none;
            border: solid yellow 2px;
          }

          svg {
            width: 25px;
            height: 25px;
          }
        }
      }
    }

    .extraMenu {
      /* position: absolute; */
      bottom: 2%;
    }
  }

  @media (max-width: 600px) {
    display: none;
  }
`;

const BottomMenu = styled.nav`
  width: 100vw;
  position: absolute;
  left: 0px;
  bottom: 0px;
  height: ${(props) => (props.toggled ? "100vh" : "70px")};
  background: var(--primary-black);
  display: flex;
  flex-direction: ${(props) => (props.toggled ? "column" : "row")};
  z-index: 3;
  transition: 0.2s;

  .user-info{
    /* border: solid red 2px; */
    display: flex;
    justify-content: flex-start;
    padding-left: 20px;
    margin-top: 50px;
    gap: 20px;

    .cred{
      /* border: solid yellow 2px; */
      flex-grow: 1;
    }
  }

  .isActiveLinkB {
    color: var(--primary-yellow);
    text-decoration: underline;

    svg {
      width: 40px;
      height: 40px;
    }
  }

  .isNotActiveLinkB {
    display: ${(props) => (props.toggled ? "flex" : "none")};
  }

  .currentActive {
    display: flex !important;
  }

  .mid {
    position: ${(props) => (props.toggled ? "static" : "absolute")};
    left: 50%;
    transform: ${(props) => (props.toggled ? "" : "translateX(-50%)")};
    bottom: 10px;
  }

  .default {
    display: flex;
  }

  .special {
    position: ${(props) => (props.toggled ? "static" : "absolute")};
    display: ${(props) => (props.defaultIsActivated ? "flex" : "none")};
    left: 50%;
    transform: ${(props) => (props.toggled ? "" : "translateX(-50%)")};
    bottom: 20px;
  }

  div.menu {
    width: 100%;
  }

  ul {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0px 20px;
    list-style-type: none;

    span {
      display: none;
    }

    svg {
      width: 25px;
      height: 25px;
    }
  }

  @media (min-width: 601px) {
    display: none;
  }

  @media (max-width: 601px) {
    ul {
      display: flex;
      flex-direction: ${(props) => (props.toggled ? "column" : "")};
      justify-content: ${(props) => (props.toggled ? "flex-start" : "")};
      height: ${(props) => (props.toggled ? "100vh" : "100%")};
      margin-top: ${(props) => (props.toggled ? "5rem" : "")};

      li {
        justify-content: space-between;
        width: ${(props) => (props.toggled ? " 100%" : "")};

        a {
          display: ${(props) => (props.toggled ? "flex" : "")};
          gap: ${(props) => (props.toggled ? "30px" : "")};
          font-size: ${(props) => (props.toggled ? "24px" : "")};
        }
      }

      span {
        display: ${(props) => (props.toggled ? "block" : "")};
        justify-self: center;
      }

      svg {
        width: ${(props) => (props.toggled ? "40px" : "")};
        height: ${(props) => (props.toggled ? "40px" : "")};
      }
    }
  }

  @media (max-width: 500px) {
    /* li:nth-child(4),
    li:nth-child(5) {
      display: ${(props) => (props.toggled ? "block" : "none")};
    } */
  }

  @media (max-width: 400px) {
    /* li:nth-child(6),
    li:nth-child(7) {
      display: ${(props) => (props.toggled ? "block" : "none")};
    } */
  }

  @media (max-width: 300px) {
    /* li:nth-child(3),
    li:nth-child(8) {
      display: ${(props) => (props.toggled ? "block" : "none")};
    } */
  }

  .pullMenu {
    width: 100px;
    height: 30px;
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    background: var(--primary-black);
    bottom: ${(props) => (props.toggled ? "" : "60px")};
    top: ${(props) => (props.toggled ? "0px" : "")};
    border-top: solid var(--primary-yellow) 1px;
    left: 50%;
    transform: translateX(-50%) ${(props) => (props.toggled ? "scale(-1)" : "")};
    border-radius: 50px 50px 0 0;
    font-size: 25px;
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
