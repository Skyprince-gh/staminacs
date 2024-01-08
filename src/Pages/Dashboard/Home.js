import styled from "styled-components";
import { Dashboard_Header as Header } from "../../Components/Header";
import { useSelector } from "react-redux";

const Home = () => {
  const storeName = useSelector((state) => state.auth.userData.businessName);

  return (
    <Grid>
      <Header storeTitle={storeName} pageTitle="Home" />
      <Section1>
        <SubSection1>
          <div className="sub-section1"></div>
          <div className="sub-section2">
            <div className="sub-section3"></div>
            <div className="sub-section4"></div>
          </div>
          <div className="sub-section5"></div>
        </SubSection1>
        <SubSection2></SubSection2>
        <SubSection3></SubSection3>
      </Section1>
      <Section2></Section2>
      <Section3></Section3>
    </Grid>
  );
};

export default Home;

const Grid = styled.div`
  width: calc(100% - 50px);
  height: 100vh;
  margin: 0 auto;
  margin-top: 5rem;
  /* display: flex; */
  /* border: solid red 2px; */
  flex-direction: column;
  align-items: center;
  color: black;
  h1 {
    user-select: text !important;
  }
  overflow-y: scroll;

  /* Hide the default scrollbar */
  ::-webkit-scrollbar {
    width: 0.5em;
  }

  ::-webkit-scrollbar-track {
    background: transparent; /* You can change this to any desired color */
  }

  ::-webkit-scrollbar-thumb {
    background-color: transparent; /* You can change this to any desired color */
    border-radius: 0.25em;
  }

  @media (max-width: 1600px) {
    width: calc(100vw - 100px);
    margin-left: 20px;
  }

  @media (max-width: 600px) {
    width: 90vw;
    margin-left: 30px;
  }

  @media (max-width: 400px) {
    width: 90vw;
    margin-left: 20px;
  }

  @media (max-width: 300px) {
    width: 90vw;
    margin-left: 10px;
  }
`;

// Styled components
const Section1 = styled.div`
  display: flex;

  height: 500px;
  margin-bottom: 24px;
  gap: 8px;
  flex-grow: 1;

  @media (max-width: 1600px) {
    /* border: solid 2px red; */
    flex-wrap: wrap;
    height: 1200px;
  }
`;

const SubSection1 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 25%;
  height: 100%;
  flex-grow: 1;
  
  
  .sub-section1 {
    width: 100%;
    height: 50%;
    background-color: var(
      --primary-black
      ); /* Use your preferred color or variable */
      border-radius: 20px;
      min-width: 200px;
  }

  .sub-section2 {
    display: flex;
    gap: 6px;
    width: 100%;
    height: 50%;

    .sub-section3 {
      width: 50%;
      height: 100%;
      background-color: var(
        --primary-black
      ); /* Use your preferred color or variable */
      border-radius: 20px;
    }

    .sub-section4 {
      width: 50%;
      height: 100%;
      background-color: var(
        --primary-black
      ); /* Use your preferred color or variable */
      border-radius: 20px;
    }
  }

  .sub-section5 {
    width: 100%;
    height: 25%;
    background-color: var(
      --primary-black
    ); /* Use your preferred color or variable */
    border-radius: 20px;
  }

  @media (max-width: 1600px) {
    height: 50%;
    width: 45%;
  }

  @media (max-width: 1400px) {
    /* width: 50%; */
    margin-left: 0px;
  }
`;

const SubSection2 = styled.div`
  width: 25%;
  height: 100%;
  background-color: var(
    --primary-black
  ); /* Use your preferred color or variable */
  border-radius: 20px;
  min-width: 400px;
  flex-grow: 1;

  @media (max-width: 1400px) {
    /* width: 30%; */
    margin-left: 0 px;
  }

  @media (max-width: 1600px) {
    height: 50%;
    width: 45%;
  }
  @media (max-width: 822px) {
    height: 25%;
    min-width: 100%;
  }
  `;

const SubSection3 = styled.div`
  width: 50%;
  height: 100%;
  background-color: var(
    --primary-black
  ); /* Use your preferred color or variable */
  border-radius: 20px;
  flex-grow: 1;
  
  @media (max-width: 1400px) {
    width: 40%;
    margin-left: 0px;
  }

  @media (max-width: 1600px) {
    height: 50%;
  }

  @media (max-width: 822px) {
    height: 25%;
    min-width: 100%;
  }
`;

const Section2 = styled.div`
  height: 500px;
  width: 100%;
  margin-bottom: 24px;
  background-color: var(
    --primary-black
  ); /* Use your preferred color or variable */
  border-radius: 20px;
`;

const Section3 = styled.div`
  height: 500px;
  width: 100%;
  margin-bottom: 24px;
  background-color: var(
    --primary-black
  ); /* Use your preferred color or variable */
  border-radius: 20px;
`;
