import styled from "styled-components";
import { ArrowRight } from "@mui/icons-material";
import "animate.css";
import { Fragment, useState } from "react";

const OptionsMenu = (props) => {
  const [viewListIsActive, setViewListIsActive] = useState(false);

  const handleImportClick = (event) => {
    props.toggleImport(event);
    props.toggleOptions(event);
  };

  const handleExportClick = (event) => {
    props.toggleExport(event);
    props.toggleOptions(event);
  };

  const handleViewToggle = (event) => {
    console.log("view is toggled")
    setViewListIsActive(!viewListIsActive)
  };

  return (
    <Fragment>
      <Grid className="animate__animated animate__fadeIn animate__faster">
        <li onClick={handleImportClick}>Import</li>
        <li onClick={handleExportClick}>Export</li>
        {/* <li onClick={handleViewToggle}>
          View <ArrowRight />{" "}
        </li> */}
      </Grid>
      {viewListIsActive && <Views>
        <li>Paginated</li>
        <li>Listed</li>
      </Views>}
      <ToggleBackground
        className="background"
        onClick={props.toggleOptions}
      ></ToggleBackground>
    </Fragment>
  );
};

export default OptionsMenu;

const Grid = styled.ul`
  position: absolute;
  color: white;
  left: 120px;
  top: 50px;
  list-style-type: none;
  background-color: var(--primary-black);
  width: 7rem;
  display: flex;
  flex-flow: column nowrap;
  padding: 5px;
  border-radius: 10px;
  z-index: 3;

  @media (max-width:1000px) {
    left: 20px;
    width: 15rem;
    height: 10rem;
    font-size: 2rem;
    row-gap: 20px;
  }

  li {
    display: flex;
    width: 100%;
    padding: 5px;
    justify-content: space-between;

    &:hover {
      color: var(--primary-yellow);
    }

    &:active {
      color: white;
    }
  }
`;

const Views = styled(Grid)`
left:240px;
top: 100px;
`

const ToggleBackground = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 2;

  width: 100vw;
  height: 100vh;
  background: transparent;
`;
