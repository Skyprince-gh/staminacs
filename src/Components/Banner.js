import styled from "styled-components";

const Banner = () => {
  return (
    <Grid>
      <p className="animate__animated animate__fadeInRight">Grow</p>
      <p className="animate__animated animate__fadeInRight animate__delay-1s">
        Organize
      </p>
      <p className="animate__animated animate__fadeInRight animate__delay-2s">
        Get Things Done
      </p>
    </Grid>
  );
};

export default Banner;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  transform: translate(100px, 0px);
  z-index: 2;
  padding-left: 2rem;

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

  @media (max-width: 1024px) {
    width: 97vw;
    margin: 0 auto;
    padding: 0;
    transform: translate(0px, 0px);
    flex-direction: row;
    margin-bottom: 2rem;
    /* border: solid 2px red; */
    justify-content: space-between;
    align-content: space-between;
    p {
      font-size: 3rem;
    }
  }

  @media (max-width: 1800px) {
    p {
      font-size: 5rem;
    }
  }
  @media (max-width: 1500px) {
    p {
      font-size: 4rem;
    }
  }
  @media (max-width: 1250px) {
    p {
      font-size: 3.5rem;
    }
  }
  @media (max-width: 900px) {
    gap: 1rem;
    p {
      font-size: 2.8rem;
    }
  }
  @media (max-width: 500px) {
    p {
      font-size: 2.5rem;
    }
  }
  @media (max-width: 300px) {
    p {
      font-size: 2rem;
    }
  }
`;
