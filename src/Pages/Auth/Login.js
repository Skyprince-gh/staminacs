// import SignInForm from "../../Components/Forms/Auth/Signin/signin";
import SignInForm from "../../Components/Forms/Auth/Signin/signin";
import styled from "styled-components";
import "animate.css";
import Banner from "../../Components/Banner";
const Login = () => {
  return (
    <Grid>
      <LeftSection>
        <div className="banner">
          <Banner />
        </div>
        <SignInForm />
      </LeftSection>
      <LogoContainer>
        <LogoImage src="/images/svg/logo.svg" alt="logo" />
      </LogoContainer>

      <RightSection>
        <div className="loginOverlay"></div>
        <Banner />
      </RightSection>
      <Footer>
        <p>Terms of Use</p>
        <p>Privacy & Cookies</p>
      </Footer>
    </Grid>
  );
};

export default Login;

const Grid = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: white;

  @media (max-width: 1024px) {
    background: url("/images/login_background.jpeg");
  }
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0px;
  left: 0px;
  width: 50vw;
  display: flex;
  justify-content: center;
  gap: 5rem;
  z-index: 10;
  height: 10rem;
  align-items: center;

  @media (max-width: 1024px) {
    width: 100vw;
    background: var(--primary-black);
    color: var(--primary-yellow);
    font-size: 1.6rem;
  }
  @media (max-width: 1200px) {
    font-size: 1.6rem;
  }
`;

const LeftSection = styled.div`
  background: white;
  height: 100vh;
  width: 50vw;
  z-index: 5;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .banner {
    display: none;
  }

  @media (max-width: 1024px) {
    width: 100vw;
    background: var(--shadow-color3);

    .banner {
      display: flex;
    }
  }
`;

const RightSection = styled.div`
  width: 50vw;
  display: flex;
  background: url("/images/login_background.jpeg") center center no-repeat;
  background-size: cover;
  position: absolute;
  right: 0px;
  top: 0px;
  height: 100vh;
  z-index: 1;

  .loginOverlay {
    position: absolute;
    width: 50vw;
    height: calc(100vh + 5rem);
    right: 0px;
    top: 0px;
    background: rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 1024px) {
    display: none;
    visibility: hidden;
  }
`;

const LogoContainer = styled.div`
  height: 10rem;
  display: flex;
  padding-left: 1rem; /* Adjust the padding as needed */
  margin-right: 5rem;
  width: 50vw;
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 10;

  @media (max-width: 1024px) {
    width: 100vw;
    justify-content: center;
  }
`;

const LogoImage = styled.img`
  width: 10rem; /* Adjust the width as needed */
  height: 10rem; /* Adjust the height as needed */

  @media (max-width: 1024px) {
    width: 12rem;
    height: 12rem;
  }
`;
