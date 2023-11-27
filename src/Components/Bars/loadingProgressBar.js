import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  // useEffect(() => {
    const increment = 100 / 5; // 20% increment per second

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + increment;
        } else {
          clearInterval(timer);
          return 100;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  // }, []);

  return (
    <ProgressBarWrapper>
      <ProgressBarFill progress={progress} />
    </ProgressBarWrapper>
  );
};

export default ProgressBar;

const ProgressBarWrapper = styled.div`
  width: 100%;
  background-color: #ccc;
  height: 20px;
  border-radius: 10px;
`;

const ProgressBarFill = styled.div`
  width: ${(props) => props.progress}%;
  background-color: #007bff;
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s;
`;
