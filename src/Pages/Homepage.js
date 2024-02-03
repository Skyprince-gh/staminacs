import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Fragment from "react";

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
          <div id="motto">
            <span>
              Grow <span className="comma">,</span>
            </span>
            <span>
              Organize <span className="comma">,</span>
            </span>
            <span>Get Things Done</span>
          </div>
          <p>
            with our fast and seamless inventory management system anywhere on
            every computer or smart device
          </p>
          <ActionBtn onClick={(e) => navigate("/signin")}>
            Sign In
          </ActionBtn>

          <ActionBtn2 onClick={(e) => navigate("/signup")}>
            Create Free Account
          </ActionBtn2>
        </LSide>
        <RSide>
          <img src="/images/devices.png" alt="" />
        </RSide>
      </Main>
      {/* <Band>
        Effective and Efficient Inventory Management at Home, Work or On The Go
      </Band>
      <Footer /> */}
    </Grid>
  );
};

export default Homepage;

const Grid = styled.div`
  width: 100vw;
  height: 100vh;
  background: white;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
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

    @media (max-width: 600px) {
      button {
        display: flex;
      }

      a {
        display: none;
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

  #motto {
    display: flex;
    flex-direction: column;
    text-align: center;

    .comma {
      display: none;
    }
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
  }

  @media (max-width: 1080px) {
    width: 100vw;
    justify-content: center;
    align-items: center;
    margin-left: 0px;

    p {
      text-align: center;
      width: 70%;
    }

    #motto {
      flex-direction: row;
      gap: 10px;
      flex-wrap: wrap;
      text-align: center;

      .comma {
        display: inline;
      }
    }
  }

  @media (max-width: 600px) {
    align-items: center;
    justify-content: center;
    
    #motto {
      font-size: 10px !important;
      justify-content: center;
    }

    p{
      display: none;
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

  img {
    height: 500px;
  }

  @media (max-width: 1200px) {
    img {
      height: 450px;
    }
  }
  @media (max-width: 1080px) {
    width: 100vw;
    img {
      height: 400px;
      margin: 20px auto;
    }
  }
  @media (max-width: 600px) {
  }
`;

const ActionBtn = styled(Button)`
  width: 20rem;
  height: 3rem;
  font-size: 1.6rem;
  border-radius: 10rem;

  @media (max-width: 500px) {
    width: 15rem;
    height: 2.5rem;
    font-size: 14px;
    border-radius: calc(0.5 * 2.5rem);
    margin: 0 auto;
  }
`;

const ActionBtn2 = styled(ActionBtn)`
background:white; 
border: solid black 2px;
margin-top: 50px;
box-shadow: 2px 2px 4px var(--shadow-color2) ;
color: var(--primary-black);
display: none;

&:active{
  background-color: var(--primary-black);
  color: white;
}

@media (max-width:600px) {
  display:flex;
}
`

const Band = styled.div`
  width: 100vw;
  height: 7rem;
  background: #e2b43b;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  font-weight: bold;

  @media (max-width: 500px) {
    height: 100px;
    font-size: 14px;
    text-align: center;
  }
`;

const Footer = styled.div`
  width: 100vw;
  flex-grow: 1;
  background: url("/images/footer.jpg");
  height: 100px;
  /* border: solid green 2px; */
  @media (max-width: 500px) {
    height: 50px;
  }
`;
