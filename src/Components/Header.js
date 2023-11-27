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
`;

const LogoContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 1rem; /* Adjust the padding as needed */
  margin-right: 5rem;
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
`;
