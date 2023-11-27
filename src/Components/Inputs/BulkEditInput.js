import { useState, Fragment, useEffect } from "react";
import styled from "styled-components";

const BulkEditInput = (props) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    // console.log("vlaues");
    setValue(props.value);
  }, []);

  const changeValue = (event) => {
    const val = event.target.value;
    setValue(val);
  };

  return (
    
      <Grid
        type={props.type}
        onChange={(e) => {
          changeValue(e);
        }}
        onBlur={props.onBlur}
        value={value}
        style={props.style}
      />
    
  );
};

export default BulkEditInput;

const Grid = styled.input`
height: 30px;
/* color: ${props => props.style} */
`
