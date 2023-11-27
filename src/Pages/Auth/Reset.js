
import Step1 from '../../Components/Forms/Auth/Reset/Step1';
import 'animate.css';
import styled from "styled-components";

const Reset = () => {
  return (
    <Grid> 
      <LeftSection>
        <Step1 />
      </LeftSection>

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
    </Grid>
  );
};

export default Reset;

const Grid = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
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
  }
`;

const LeftSection = styled.div`
  width: 50vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
