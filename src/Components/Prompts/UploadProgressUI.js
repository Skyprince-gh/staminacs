import ReactDOM from "react-dom";
import { Fragment, useEffect, useState } from "react";
import styled from "styled-components";
import "animate.css";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { actions as inventoryActions } from "../../store/inventory";

const ProgressModal = (props) => {
  const dispatch = useDispatch();
  const [itemsLeft, setItemsLeft] = useState(0);
  // const itemsLeft = useSelector(
  //   (state) => state.inventory.uploadStats.itemsLeft
  // );
  const [itemsUploaded, setItemsUploaded] = useState(0);
  // const itemsUploaded = useSelector(
  //   (state) => state.inventory.uploadStats.itemsUploaded
  // );
  // const [initialAmount, setInitialAmount] = useState(0)
  const initialAmount = useSelector(
    (state) => state.inventory.uploadStats.initialAmount
  );
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    
  }, [])
  

  
  return (
    <Grid
      className="animate__animated animate__fadeInUp"
      percentage={`${percentage}%`}
    >
      <div className="top">
        <h5>Uploading Items</h5>
        <div className="close" onClick={props.toggle}>
          <Close />
        </div>
      </div>
      <div className="remaining">
        {itemsLeft} items remaining || {itemsUploaded} items uploaded
      </div>
      <div className="progress-container">
        <div className="loading-bar">
          <div className="bar"></div>
        </div>
        <span>{percentage || 0}%</span>
      </div>
    </Grid>
  );
};

const UploadProgressUI = (props) => {
  return (
    <Fragment>
      {ReactDOM.createPortal(
        <ProgressModal toggle={props.toggle} />,
        document.getElementById("backdrop-root")
      )}
    </Fragment>
  );
};

export default UploadProgressUI;

const Grid = styled.div`
  width: 20rem;
  height: 7rem;
  background: var(--primary-grey);
  box-shadow: 5px 5px 10px var(--shadow-color);
  border: 0.2px solid var(--primary-grey-2);
  border-radius: 0.8rem;
  padding: 5px;
  z-index: 10;
  position: absolute;
  bottom: 10px;
  left: 20px;

  .top {
    display: flex;
    justify-content: space-between;
    .close {
      width: 50px;
      display: flex;
      justify-content: flex-end;

      svg {
        width: 20px;
        height: 20px;
      }

      &:hover {
        color: var(--primary-yellow);
      }
    }
  }

  .remaining {
    height: 0.4rem;
  }

  .progress-container {
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      font-weight: bold;
      color: var(--primary-black);
    }

    .loading-bar {
      width: 85%;
      height: 15px;

      .bar {
        height: 100%;
        max-width: ${(props) => props.percentage || "0%"};
        background: var(--primary-yellow);
        border-radius: 7.5px;
      }
    }
  }
`;
