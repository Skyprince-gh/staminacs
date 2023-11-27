import styled from "styled-components";
import "animate.css";
import ProgressBar from "./Bars/loadingProgressBar";

//remember to portal the loading screen to the very top.
const MainLoading = () => {
  return (
    <Grid>
      <div className="animate__animated animate__fadeInDown">
        <LogoImage src="/images/svg/logo.svg" alt="logo" />
        <h2>Akwaaaba</h2>
        <p>Welcome to Stamina</p>
      </div>
    </Grid>
  );
};

export default MainLoading;

const Grid = styled.div`
  background: white;
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    /* border: solid green 1px; */
    width: 300px;
  }

  h2 {
    font-size: 50px;
  }
`;

const LogoImage = styled.img`
  width: 200px; /* Adjust the width as needed */
  height: 200px; /* Adjust the height as needed */
`;
