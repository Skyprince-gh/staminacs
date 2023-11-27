import styled from "styled-components";
import { useState } from "react";
import Tier from "../../../Cards/PricingTiers/PricingTiers";
import { ArrowBack } from "@mui/icons-material";
import style from "../formStyle.module.css";

const Finish = (props) => {
  const [isActiveTier, setIsActiveTier] = useState({
    tier1: true,
    tier2: false,
    tier3: false,
  });

  const Tiers = {
    tier1: {
      name: "Free",
      list: [
        "Basic Messages",
        "3 Tasks Per day",
        "Account Settings",
        "Business Updates",
      ],
    },
    tier2: {
      name: "Extra",
      list: [
        "Pro Support",
        "Inventory Management",
        "Cloud Storage",
        "15 Tasks Per day",
      ],
    },
    tier3: {
      name: "Max",
      list: [
        "Advanced Features",
        "Ecommerce Access",
        "Consultant Projects",
        "Financial Analysis",
      ],
    },
  };

  const changeSelection = (name) => {
    if (name === "Free") {
      setIsActiveTier({ tier1: true, tier2: false, tier3: false });
    } else if (name === "Extra") {
      setIsActiveTier({ tier1: false, tier2: true, tier3: false });
    } else if (name === "Max") {
      setIsActiveTier({ tier1: false, tier2: false, tier3: true });
    }
  };


  const previousForm = (event) => {
    //trigger the external functions to switch to the previous form and then push all the data to the auth object outside of this component
    props.goToPrev();
  };

  const finishSignup = (event) => {
    props.handleFormData({
      isActiveTier
    })

  };

  return (
    <Grid>
      <h2>Welcome to Stamina</h2>
      <h3>Select Your Business Plan</h3>
      <Plans>
        <Tier
          tier={Tiers.tier1}
          changeSelection={changeSelection}
          isActive={isActiveTier.tier1}
          // clicked={finishSignup}
        >
          <button className={style.submit}  onClick={finishSignup}>Free</button>
        </Tier>
        {/* <Tier
          tier={Tiers.tier2}
          changeSelection={changeSelection}
          isActive={isActiveTier.tier2}
          clicked={finishSignup}
        >
          $14.99/Month
        </Tier>
        <Tier
          tier={Tiers.tier3}
          changeSelection={changeSelection}
          isActive={isActiveTier.tier3}
          clicked={finishSignup}
        >
          $29.99/Month
        </Tier> */}
      </Plans>
      <Footer>
        <BackButton onClick={previousForm}>
          <span>
            <ArrowBack fontSize="extra-small" />
          </span>
          Back
        </BackButton>
        {/* <Signup className={style.submit} onClick={finishSignup}>
          Signup
        </Signup> */}
      </Footer>
    </Grid>
  );
};

export default Finish;

const Grid = styled.div`
  width: 60%;
  min-height: 500px;
  min-width: 400px;
  height: auto;
  background-color: transparent;
  border-radius: 10px;
  display: flex;
  flex-direction: column;

  h2 {
    height: 50px;
    text-align: center;
    width: 100%;
    color: white;
    padding-top: 20px;
  }

  h3 {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
`;

const Plans = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  height: 300px;
`;

const Footer = styled.div`
  width: 100%;
  height: 100px;
  /* background: red; */
  display: flex;
  align-items: center;
  padding: 0px 50px;
  justify-content: space-between;
`;

const BackButton = styled.div`
  width: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: white;
  font-size: small;
`;

const Signup = styled.button``;
