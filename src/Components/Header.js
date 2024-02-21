import React from "react";
import styled from "styled-components";

// Define your Dashboard_Header component
export const Dashboard_Header = (props) => {
  return (
    <HeaderContainer>
      {/* Title Section */}
      <LogoContainer>
        <LogoImage src="/images/svg/logo.svg" alt="logo" />
      </LogoContainer>
      <TitleContainer>
        <h1>{props.storeTitle}</h1>
      </TitleContainer>
      <PageTitleContainer>
        <h2>{props.pageTitle}</h2>
      </PageTitleContainer>
    </HeaderContainer>
  );
};

export default Dashboard_Header;

// Define the styled components
const HeaderContainer = styled.div`
  position: fixed;
  height: 4rem; /* Adjust the height as needed */
  width: calc(100% - 200px);
  z-index: 1;
  top: 0;
  left: 0;
  background-color: white;
  display: flex;
  align-items: center;
  font-size: 14px;

  @media (max-width: 1600px) {
      width: calc(100% - 100px);
  }

  @media (max-width: 600px) {
      width: 100%;
  }
`;

const LogoContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 1rem; /* Adjust the padding as needed */
  margin-right: 5rem;

  @media (max-width: 750px) {
    margin-right: 2rem;
  }
  @media (max-width: 300px) {
      width:100%;
      /* border: solid 1px red; */
      margin-right: 0px;
      padding-left: 0px;
      justify-content: center;
  }
`;

const LogoImage = styled.img`
  width: 100px; /* Adjust the width as needed */
  height: 100px; /* Adjust the height as needed */ 
  
`; 

const TitleContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding-left: 1rem; /* Adjust the padding as needed */
  font-weight: bold;
  /* border: solid red 1px; */

  @media (max-width: 750px) {
    /* height: 40px; */
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow:hidden;
    width: 200px;
    margin-right: 1.5rem;
  }
  @media (max-width: 450px) {
      display:flex;
      justify-content: flex-start;
      margin-right: 1rem;
      /* padding-right: 10px */
  }

  @media (max-width: 300px) {
      display:none;
  }
  
`;

const PageTitleContainer = styled.div`
  width: auto;
  /* border: solid green 1px; */
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 1rem; /* Adjust the padding as needed */
  font-weight: bold;

  h2 {
    border-bottom: var(--primary-yellow) solid 5px;
  }

  @media (max-width: 450px) {
      display:none;
  }
`;
