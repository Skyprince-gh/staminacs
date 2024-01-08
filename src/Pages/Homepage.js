import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigateTo = useNavigate();

  const navigate = (url) => {
    navigateTo(url);
  };
  return (
    <Grid>
      <Bar>
        <Logo src="/images/svg/logo.svg"></Logo>
        <div className="links">
          <NavLink to="https://staminacs.com/">Stamina Services</NavLink>
          <Button onClick={(e) => navigate("/signup")}>Get Started</Button>
        </div>
      </Bar>
      <Main>
        <LSide>
          <h2>Stamina IM</h2>
          <span>Grow</span>
          <span>Organize</span>
          <span>Get Things Done</span>
          <p>
            with our fast and seamless inventory management system anywhere on
            every computer or smart device
          </p>
          <ActionBtn onClick={(e) => navigate("/signup")}>
            Get Started
          </ActionBtn>
        </LSide>
        <RSide>
          <div className="desktop">
            <img src="/images/desktop.png" alt="" />
          </div>
          <div className="tablet">
            <img src="/images/tablet.png" alt="" />
          </div>
        </RSide>
      </Main>
      <Band>
        Effective and Efficient Inventory Management at Home, Work or On The Go
      </Band>
      <Footer />
    </Grid>
  );
};

export default Homepage;

const Grid = styled.div`
  width: 100dvw;
  height: auto;
  background: white;
  display: flex;
  flex-direction: column;
`;

const Bar = styled.div`
  width: 100vw;
  height: 3rem;
  box-shadow: 0px 3px 2.5px var(--shadow-color);
  display: flex;
  justify-content: space-between;

  @media (max-width: 1200px) {
    height: calc(30px * 1.6);
    font-size: 16px;
  }

  .links {
    display: flex;
    justify-content: space-between;
    /* border: solid green 2px; */
    align-items: center;
    gap: 50px;

    a {
      color: var(--primary-black);
      font-weight: bold;

      &:hover {
        color: var(--primary-yellow);
      }
    }

    @media (max-width: 500px) {
    button{
      display: none;
    }

    a{
      margin-right: 10px
    }
  }
  }
`;

const Logo = styled.img`
  width: 100px;
  margin-left: 10px;
`;

const Button = styled.button`
  width: 150px;
  display: flex;
  color: white;
  height: 30px;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
  background: var(--primary-black);
  border: none;
  font-weight: bold;
  margin-right: 10px;

  &:hover {
    color: var(--primary-yellow);
  }
  &:active {
    color: var(--primary-black);
    background: transparent;
    border: solid var(--primary-black) 1px;
  }
`;

const Main = styled.div`
  width: 100vw;
  position: relative;
  display: flex;
  margin-bottom: 4rem;

  @media (max-width: 1200px) {
    height: 75%;
  }

  @media (max-width: 1000px) {
    flex-direction: column;
  }
`;

const LSide = styled.div`
  height: 100%;
  margin-left: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 30vw;
  margin-top: 2rem;

  @media (max-width: 600px) {
    margin-left: 20px;
  }
  @media (max-width: 1000px) {
    width: 100vw;
    justify-content: flex-start;
    align-items: flex-start;
  }

  h2 {
    color: #e2b43b;
    font-size: 3.5rem;
    margin-bottom: 2rem;
  }

  span {
    color: var(--primary-black);
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  span:nth-child(4) {
    margin-bottom: 3rem;
  }
  p {
    font-size: 1.8rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 2rem;

    @media (max-width: 1000px) {
      text-align: left;
      width: 70%;
    }
  }
`;

const RSide = styled.div`
  position: relative;
  margin-top: 2rem;
  margin-right: 1rem;
  width: 60vw;
  display: flex;
  justify-content: flex-end;
  /* border: solid brown 2px; */

  @media (max-width: 1000px) {
    width: 100vw;
  }
  @media (max-width: 600px) {
    .desktop,
    .tablet {
      display: none;
    }
  }

  .desktop {
    width: 40rem;
    height: 25rem;
    border-radius: 1rem;
    background: black;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;

    @media (max-width: 1200px) {
      top: 150px;
      width: 60rem;
      height: 35rem;
    }

    @media (max-width: 1000px) {
      width: calc(60rem / 1.5);
      height: calc(35rem / 1.5);
    }

    @media (max-width: 600px) {
      display: none;
    }
    img {
      width: 100%;
      height: 100%;
      display: block;
      border-radius: 0.8rem;
    }
  }
  .tablet {
    width: calc(40rem / 1.5);
    height: calc(25rem / 1.5);
    border-radius: calc(1rem / 1.5);
    background: black;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    position: absolute;
    bottom: 0px;
    right: -3rem;

    @media (max-width: 1200px) {
      top: 250px;
      width: 300px;
      height: 200px;
    }

    @media (max-width: 1000px) {
      width: calc(300px / 1.5);
      height: calc(200px / 1.5);
      top: 150px;
      right: 0px;
    }
    @media (max-width: 600px) {
      display: none;
    }

    img {
      width: 100%;
      height: 100%;
      display: block;
      border-radius: calc(0.8rem / 1.5);
    }
  }
`;

const ActionBtn = styled(Button)`
  width: 20rem;
  height: 3rem;
  font-size: 1.6rem;
  border-radius: 10rem;
  
`;

const Band = styled.div`
  width: 100vw;
  height: 7rem;
  background: #e2b43b;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;
  position: absolute;
  bottom: 100px;

  @media (max-width: 500px) {
    height: 150px;
  }
`;

const Footer = styled.div`
  width: 100vw;
  flex-grow: 1;
  background: url("/images/footer.jpg");
  position: absolute;
  bottom: 0px;
  left: 0px;
  height: 100px;
  /* border: solid green 2px; */
`;
