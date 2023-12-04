import styled from "styled-components";
import { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactDOM from "react-dom";
// import {
//   getDocumentByID,
//   setDocument,
//   updateDocument,
// } from "../../util/firebase-store";
import { CameraAlt, Edit, ExitToApp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import auth from "../../util/firebase-auth";
import blobToBase64 from "../../util/blobToBase64";
import { storage } from "../../util/firebase-store";
import { ref, uploadBytes } from "firebase/storage";
import { actions as authActions } from "../../store/auth";

const Modal = (props) => {
  const userID = useSelector((state) => state.auth.userAuthCred.uid);
  const userName = useSelector((state) => state.auth.userData.firstName);
  const lastName = useSelector((state) => state.auth.userData.lastName);
  const businessName = useSelector((state) => state.auth.userData.businessName);
  const userData = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const [closeIsActivated, setCloseIsActivated] = useState(false);
  const [userNameIsActive, setUserNameIsActive] = useState(false);
  const [storeNameIsActive, setStoreNameIsActive] = useState(false);

  const userImages_StorageReference = ref(
    storage,
    `${userID}/images/userImage`
  );
  const userImageURL = useSelector((state) => state.auth.userImageURL);
  const dispatch = useDispatch();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];

    uploadBytes(userImages_StorageReference, file).then((snapshot) => {});
    blobToBase64(file).then((url) => {
      dispatch(authActions.setUserImageURL(url));
    });
  };

  const handleSignout = (event) => {
    props.toggle();
    signOut(auth).then(() => {
      navigate("/signin");
    });
  };

  const handleClose = (event) => {
    setCloseIsActivated(!closeIsActivated);
    setTimeout(() => {
      props.toggle();
    }, 700);
  };

  // const ChangeUserNameOnBlur = (event) => {
  //   const data = event.target.value;
  //   dispatch(authActions.setUserData({ ...userData, businessName: data }));
  // };
  // const ChangeUserNameOnKeyDown = (event) => {
  //   const data = event.target.value;
  //   dispatch(authActions.setUserData({ ...userData, businessName: data }));
  // };

  // const ChangeStoreNameOnBlur = (event) => {
  //   const data = event.target.value;
  //   dispatch(authActions.setUserData({ ...userData, businessName: data }));
  // };
  // const ChangeStoreNameOnKeyDown = (event) => {
  //   const data = event.target.value;
  //   dispatch(authActions.setUserData({ ...userData, businessName: data }));
  // };

  const toggleUserNameChange = () => {
    setUserNameIsActive(!userNameIsActive);
  };

  const toggleStoreNameChange = () => {
    setStoreNameIsActive(!storeNameIsActive);
  };

  return (
    <div className="container">
      <div className="close-div" onClick={handleClose}></div>
      <QuickModal
        className={`${closeIsActivated ? "outro-animate" : "intro-animate"}`}
      >
        <div className="close ">
          <span className="title">
            <h3>User Menu</h3>
          </span>
          <span className="hover-effects" onClick={handleClose}>
            X
          </span>
        </div>
        <div className="user-profile">
          <label htmlFor="user-image">
            <img src={userImageURL} alt="staminacsuser image" />
            <input
              type="file"
              id="user-image"
              multiple={false}
              onChange={handleFileSelect}
            />
            <CameraAlt />
          </label>
        </div>
        <div className="user-name">
          <h3>User Name</h3>
          <div className="content">
            <span className="title">
              {userName} {lastName}
            </span>
          </div>
        </div>

        <div className="store-name">
          <h3>Store Name</h3>
          <div className="content">
            <span className="title">{businessName}</span>
          </div>
        </div>

        <div className="extra">
          <div className="sign-out hover-effects" onClick={handleSignout}>
            Signout <ExitToApp />
          </div>
        </div>
      </QuickModal>
    </div>
  );
};

const QuickUserSettings = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <Modal toggle={props.toggle} />,
        document.getElementById("backdrop-root")
      )}
    </Fragment>
  );
};

export default QuickUserSettings;

const QuickModal = styled.div`
  position: absolute;
  right: 0px;
  bottom: 0px;
  height: 100vh;
  color: white;
  box-shadow: 5px 5px 15px var(--shadow-color3);
  border-radius: 5px;
  background-color: var(--primary-black);
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 200;

  div.close {
    text-align: left;
    padding: 0 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 24px;
    width: 100%;
    margin-bottom: 20px;
    margin: 5px 0;
    margin-bottom: 20px;

    .title {
      position: relative;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  div.user-profile {
    width: 100%;
    max-width: 150px;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    /* border: yellow solid 1px; */

    label {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      /* border: red solid 1px; */

      input {
        display: none;
      }
      img {
        width: 150px;
        height: 150px;
        position: relative;
        right: -20px;
        transition: 0.5s;
        border-radius: 90px;
        display: flex;
        /* border: green solid 1px; */

        &:hover {
          box-shadow: var(--primary-bkg-fade) 0px 5px 15px;
        }

        &:active {
          box-shadow: var(--primary-bkg-fade) 0px 5px 15px;
          width: 140px;
          height: 140px;
        }
      }
    }
  }
  div.user-name,
  div.store-name {
    width: 100%;
    max-width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
    /* border: solid green 1px; */
    position: relative;

    /* span.title {
      width: fit-content;
      padding: 0 20px;
      border-radius: 10px;

      &:hover {
        border: solid 1px white;
      }
    }

    span {
      input {
        outline: none;
        padding-left: 20px;
      }
    }

    .icon {
      position: absolute;
      right: 150px;
    } */
  }

  .content {
    display: flex;
    /* border: solid red 1px; */
    gap: 20px;
    width: 50%;
    align-items: center;
    justify-content: center;
    /* width: 30%; */
  }

  div.extra {
    margin-top: 50px;
    /* border: solid 1px blue; */

    div {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 10px;
    }
  }

  .hover-effects {
    transition: 0.3s;
    &:hover {
      color: var(--primary-yellow);
      letter-spacing: 3px;
      position: relative;
    }
    &:active {
      color: var(--primary-grey);
    }
  }
`;

const RoundButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  outline: none;
  border: none;
  background: var(--primary-grey-2);
  display: flex;
  justify-content: center;
  align-items: center;
`;
