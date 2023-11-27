import styled from "styled-components";
import { CheckCircle } from "@mui/icons-material";

const PricingTiers = (props) => {
  const handleChangeSelection = () => {
    console.log(props.tier.name);
    props.changeSelection(props.tier.name);
  };
  // console.log(props.isActive, typeof props.isActive)
  return (
    <Grid onClick={handleChangeSelection} isActive={props.isActive}>
      {/* <Heading>{props.tier.name}</Heading> */}
      <ul>
        {props.tier.list.map((feature, index) => {
          return <li key={index}><CheckCircle/> <span>{feature}</span></li>;
        })}
      </ul>
      {/* {props.isActive && (
        <GoButton onClick={props.clicked}>
          <div>GO!</div>
        </GoButton>
      )} */}
      <p className="price">{props.children}</p>
    </Grid>
  );
};

export default PricingTiers;

const Grid = styled.div`
  /* ${(props) => `  
    ${props.isActive ? `border: solid var(--green1) 3px;` : ""}
  `} */
  width: 270px;
  /* height: 70%; */
  background: var(--primary-black);
  margin: 0 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  align-items: center;
  color: var(--primary-yellow);

  /* transition: 0.5s; */

  ul {
    width: 70%;
    text-transform: capitalize;
    display: flex;
    flex-direction:column;
    gap: 20px;
    font-size: 16px;
    list-style-type: none;
    align-items: start;
    margin: 0 auto;

    li{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      gap: 10px;
    }
  }

  .price {
    width: 100%;
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: large;
    font-weight: bolder;
    margin-top: 20px;
  }

  &:hover {
    box-shadow: var(--shadow-color2) 10px 10px 20px;
  }

  &:focus {
    border: solid var(--green1) 3px;
  }
`;

const Heading = styled.div`
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 30px;
  width: 50%;
  background: black;
  padding: 0px;
  position: relative;
  bottom: 15px;
  margin: 0 auto;
  border-radius: 15px;
  color: white;
  /* font-family: inherit; */
`;

const GoButton = styled.button`
  display: block;
  width: 100px;
  height: 100px;
  border: none;
  background-color: transparent;
  position: absolute;
  top: calc(50% - 50px);
  left: calc(270px - 50px);
  color: white;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: center;

  div {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--green1);
    width: 50px;
    height: 50px;
    border-radius: 25px;
    border: none;
    transition: 0.5s;

    &:hover {
      transform: scale(1.1, 1.1);
      transform-origin: center;
      border-radius: 30px;
      left: 80%;
      box-shadow: var(--shadow-color2) -5px -5px 10px;
    }
    &:active{
      transform: scale(0.9,0.9);
      transition: 0ms;
      color: var(--primary-yellow)
    }
  }
`;
