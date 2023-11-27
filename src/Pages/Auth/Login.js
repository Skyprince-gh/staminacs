// import SignInForm from "../../Components/Forms/Auth/Signin/signin";
import SignInForm from "../../Components/Forms/Auth/Signin/signin";
import styled from "styled-components";
import "animate.css";

const Login = () => {
  return (
    <Grid>
      <LeftSection>
        <SignInForm />
      </LeftSection>
      <LogoContainer>
        <LogoImage src="/images/svg/logo.svg" alt="logo" />
      </LogoContainer>

      <RightSection>
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
      <div className="extra-style">f</div>
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

  .extra-style {
    width: 50vw;
    height: 100vh;
    background: url("/images/login_background.jpeg") center center no-repeat;
    background-size: calc(100% + 5vw);
    position: absolute;
    right: 0px;
    bottom: 0px;
    z-index: 0;
    border-bottom-left-radius: 50px;
    background-position: 90% 51%;
  }
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
`

const RightSection = styled.div`
  width: 55vw;
  display: flex;
  background: url("/images/login_background.jpeg") center center no-repeat;
  background-size: cover;
  position: absolute;
  right: 0px;
  top: 0px;
  height: calc(100vh - 50px);
  z-index: 1;

  .loginOverlay {
    position: absolute;
    width: 55vw;
    height: calc(100vh + 50px);
    right: 0px;
    top: 0px;
    background: rgba(0, 0, 0, 0.3);
    border-bottom-left-radius: 300px;
  }
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

const Banner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  transform: translate(100px, 0px);
  z-index: 2;
  padding-left: 20px;

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
  border-top-right-radius: 50px;
  position: absolute;
  top: 0px;
  left: 0px;
  height: 100vh;
  z-index: 5;
`;
