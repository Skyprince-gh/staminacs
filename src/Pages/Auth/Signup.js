import { useState } from "react";
import BasicDetails from "../../Components/Forms/Auth/Signup/BasicDetails";
import BusinessInfo from "../../Components/Forms/Auth/Signup/BusinessInformation";
import UserCredentials from "../../Components/Forms/Auth/Signup/UserCredentials";
import DashedProgressBar from "../../Components/Bars/Dashed-Progress-Bar/dashedProgressBar";
import Finish from "../../Components/Forms/Auth/Signup/Finish";
import styled from "styled-components";
import "animate.css";
import { createUserEmailAndPassword } from "../../util/firebase-auth";
import { setDocument } from "../../util/firebase-store";
import { v4 as uuid } from "uuid";
import { Timestamp } from "firebase/firestore";

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const [userCredentials, setUserCredentials] = useState({});

  const goToNext = () => {
    //takes you to the next form
    setCurrentStep(currentStep + 1);
  };

  //takes you to the previous form
  const goToPrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFormData = (data) => {
    setUserCredentials({ ...userCredentials, ...data });
    console.log({ ...userCredentials, ...data });
    if (currentStep === 4) {
      console.log("hello you just completed the form.");
      console.log(currentStep);
      console.log("userCredentials:", { ...userCredentials, ...data });

      createUserEmailAndPassword(
        userCredentials.email.trim(),
        userCredentials.password.trim()
      ).then((response) => {
        localStorage.setItem(
          "accessToken",
          JSON.stringify(response.user.accessToken)
        );
        //send all the user data to firebase and get the and user data credentials
        console.log(response);
        setDocument(
          {
            address: userCredentials.address || "",
            address2: userCredentials.address2 || "",
            businessDescription: userCredentials.businessDescription || "",
            businessName: userCredentials.businessName || "",
            state: userCredentials.countryState || "",
            email: userCredentials.email || "",
            firstName: userCredentials.firstName || "",
            activeTier: userCredentials.isActiveTier || "",
            lastName: userCredentials.lastName || "",
            phoneNumber: userCredentials.phoneNumber || "",
            phoneNumber2: userCredentials.phoneNumber2 || "",
            userName: userCredentials.userName || "",
            zipCode: userCredentials.zipCode || "",
            storeID: uuid(),
            timeStamp: Timestamp.fromDate(new Date()),
          },
          "Users",
          response.user.uid
        ).catch((err) => {
          console.log(err);
        });

        setDocument(
          {
            "000": "",
          },
          "Users",
          response.user.uid,
          "SearchIndexes",
          "Init"
        );

        setDocument(
          {
            darkMode: false,
            sharedInventory: false,
            userImageURL: "",
          },
          "Users",
          response.user.uid,
          "Settings",
          "User Settings"
        );
      });

      //into redux and then load the next page.
      //move on to handling the password reset page
    }
  };

  return (
    <Grid currentStep={currentStep}>
      <LogoContainer>
        <LogoImage src="/images/svg/logo.svg" alt="logo" />
      </LogoContainer>

      {currentStep === 4 && (
        <Center>
          <DashedProgressBar repeat={4} step={currentStep} />
          <Finish goToPrev={goToPrev} handleFormData={handleFormData} />
        </Center>
      )}

      {currentStep != 4 && (
        <LeftSection>
          {currentStep != 4 && (
            <DashedProgressBar repeat={4} step={currentStep} />
          )}
          {currentStep === 1 && (
            <BasicDetails
              cred={userCredentials}
              goToNext={goToNext}
              handleFormData={handleFormData}
            />
          )}
          {currentStep === 2 && (
            <BusinessInfo
              cred={userCredentials}
              goToNext={goToNext}
              goToPrev={goToPrev}
              handleFormData={handleFormData}
            />
          )}
          {currentStep === 3 && (
            <UserCredentials
              cred={userCredentials}
              goToNext={goToNext}
              goToPrev={goToPrev}
              handleFormData={handleFormData}
            />
          )}
        </LeftSection>
      )}

      {currentStep != 4 && (
        <RightSection className="animate__animated">
          <div className="loginOverlay"></div>
          <Banner>
            <p className="animate__animated animate__fadeInRight">Grow</p>
            <p className="animate__animated animate__fadeInRight animate__delay-1s">
              Organize
            </p>
            <p className="animate__animated animate__fadeInRight animate__delay-2s">
              Get Things Done
            </p>
          </Banner>
        </RightSection>
      )}

      <Footer>
        <p>Terms of Use</p>
        <p>Privacy & Cookies</p>
      </Footer>
    </Grid>
  );
};

export default Signup;

const Grid = styled.div`
  ${(props) => `
  ${
    props.currentStep != 4
      ? `
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  `
      : `
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  overflow: hidden !important;
  overflow-y: hidden !important;
  flex-direction: column;`
  }
`}
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 50vw;
  display: flex;
  justify-content: center;
  gap: 50px;
  z-index: 10;
  height: 100px;
  align-items: center;
`;

const LogoContainer = styled.div`
  height: 100px;
  display: flex;
  /* border: solid green 1px; */
  padding-left: 1rem; /* Adjust the padding as needed */
  margin-right: 5rem;
  width: 50vw;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
`;

const LogoImage = styled.img`
  width: 100px; /* Adjust the width as needed */
  height: 100px; /* Adjust the height as needed */
`;

const RightSection = styled.div`
  width: 50vw;
  display: flex;
  background: url("/images/login_background.jpeg") center center no-repeat;
  background-size: cover;

  .loginOverlay {
    position: absolute;
    width: 50vw;
    height: 100vh;
    right: 0px;
    top: 0px;
    background: rgba(0, 0, 0, 0.3);
  }
`;

const Banner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  transform: translate(100px, 0px);
  z-index: 2;

  p {
    font-size: 6rem;
    font-weight: bold;
    color: white;

    &:hover {
      color: var(--primary-yellow);
    }

    &:nth-child(2) {
      color: yellow;

      &:hover {
        color: var(--primary-yellow);
      }
    }
  }
`;

const LeftSection = styled.div`
  width: 50vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;
