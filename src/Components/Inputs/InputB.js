 import styled from "styled-components";
import { AddCircleOutlineRounded, Add, Remove } from "@mui/icons-material";
import { useState, useRef, Fragment } from "react";

const InputB = (props) => {
  const [listIsActive, setListIsActive] = useState(false);
  const [strings, setStrings] = useState(props.value || []);
  let stringField = useRef();

  const toggleList = (event) => {
    setListIsActive(!listIsActive);
    props.onUpdate(strings);
  };

  const addString = (event) => {
    event.preventDefault();
    if (stringField.current.value.trim().length > 0) {
      setStrings([...strings, stringField.current.value]);
      stringField.current.value = "";
      // console.log("string is adding:", stringField.current.value.trim().length);
    }
  };

  const removeString = (string) => {
    console.log("remove", string);
  };

  return (
    <Grid
      width={props.width}
      type={props.type || ""}
      top={props.top || ""}
      left={props.left || ""}
      right={props.right || ""}
      bottom={props.bottom || ""}
      position={props.position || ""}
      height={props.height}
      maxWidth={props.maxWidth || ""}
    >
      <label htmlFor={props.name || ""}>{props.label || "label"}</label>

      <div>
        {props.prefix && <span>{props.prefix}</span>}
        {props.type === "text" && (
          <input
            type="text"
            id={props.id || ""}
            name={props.name || ""}
            onChange={props.onChange}
            value={(props.prefix || "") + props.value + (props.suffix || "")}
          />
        )}
        {props.type === "number" && (
          <input
            type="number"
            id={props.id || ""}
            name={props.name || ""}
            onChange={props.onChange}
            value={props.value}
          />
        )}
        {props.type === "select" && (
          <select
            id={props.id || ""}
            name={props.name || ""}
            onChange={props.onChange}
            defaultValue={props.defaultValue}
            value={props.value}
          >
            {props.options.map((opt) => {
              return (
                <option value={opt} key={opt}>
                  {opt}
                </option>
              );
            })}
          </select>
        )}

        {props.type === "list" && (
          <List isActive={listIsActive}>
            <Items>
              {!listIsActive && (
                <div className="strings">
                  {strings.map((string) => {
                    return " " + string + " |";
                  })}
                </div>
              )}
              {listIsActive && (
                <ul onMouseLeave={toggleList}>
                  {strings.map((string, index) => {
                    return (
                      <li key={string + index}>
                        {string}{" "}
                        <Remove
                          onClick={(e) => {
                            removeString(string);
                          }}
                        />
                      </li>
                    );
                  })}
                  <div>
                    <input type="text" ref={stringField} />
                    <Add onClick={addString} />
                  </div>
                </ul>
              )}
            </Items>
            <AddCircleOutlineRounded className="button" onClick={toggleList} />
          </List>
        )}
        {props.suffix && <span>{props.suffix}</span>}
      </div>

      {props.type === "textArea" && (
        <textarea
          onChange={props.onChange}
          name={props.name || ""}
          // height={props.height}
          value={props.value}
        ></textarea>
      )}
    </Grid>
  );
};

export default InputB;

const Grid = styled.div`
  position: relative;
  padding: 0px 10px;
  width: ${(props) => props.width || "100px"};
  max-width: ${(props) => props.maxWidth || ""};
  height: ${(props) => props.height || "40px"};
  border: solid var(--primary-black) 1px;
  border-radius: 10px;
  padding-right: 5px;
  background-color: white;
  min-height: ${(props) => (props.type === "textArea" ? "200px" : "")};

  label {
    display: block;
    position: absolute;
    color: var(--primary-black);
    font-weight: bold;
    font-size: 10px;
    padding: 0 5px;
    top: -10px;
    background: white;

  }

  textarea {
    width: 100%;
    height: calc(100% - 25px) !important;
    resize: none;
    outline: none;
    display: block;
    box-sizing: border-box;
    position: static;
    border: none;
    font-weight: bold;
    line-height: 24px;
  }

  div {
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    input[type="text"],
    select {
      border: none;
      display: block;
      width: 99%;
      height: 35px;
      /* position:absolute; */
      bottom: 0px;
      font-size: 16px;
      outline: none;
      border-radius: 10px;
      min-width: 10px;
      margin-right: auto;

      option {
        background: var(--primary-black);
        color: white;
        /* overflow-y: scroll; */
      }
    }

    input {
      display: block;
    }

    input[type="number"] {
      display: block;
      border: none;
      min-width: 20px;
      height: 35px;
      /* position:absolute; */
      bottom: 0px;
      font-size: 16px;
      outline: none;
      border-radius: 10px;
      min-width: 10px;
      margin-right: auto;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type="number"] {
      -moz-appearance: textfield;
    }
  }

 
`;

const List = styled.div`
  /* width: ${(props) => "100%"}; */
  width: 100%;
  height: 40px;
  color: var(--primary-black);
  display: flex;
  flex-grow: 1;
  /* border: solid yellow 2px; */
  justify-content: space-between;
  .button {
    &:hover {
      color: var(--primary-yellow);
    }
  }

  svg {
    transition: 0.3s;
    transform: ${(props) => (props.isActive ? "rotate(45deg)" : "")};
  }
`;
const Items = styled.div`
  display: flex;
  justify-content: flex-start;
  width: calc(100% - 24px);
  margin-left: auto;
  position: relative;
  padding: 10px auto;
  height: 100%;
  /* border: solid green 2px; */

  div.strings {
    width: 100%;
    /* display:flex; */
    height: 100%;
    text-overflow: ellipsis;
    display: flex;
    overflow: hidden;
    align-items: center;
    white-space: nowrap;
    font-weight: bold;
  }

  ul {
    list-style-type: none;
    background: var(--primary-black);
    border-radius: 10px;
    display: block;
    position: absolute;
    width: 150px;
    left: -10px;
    top: 30px;
    padding: 10px 0px;
    z-index: 3;

    li {
      /* height: 20px; */
      border-bottom: 1px solid white;
      
      padding: 5px;
      color: white;
      display: flex;
      justify-content: space-between;

      svg {
        transform: rotate(0);

        &:hover {
          color: var(--primary-yellow);
        }

        &:active {
          color: black;
        }
      }
    }

    div {
      display: flex;
      justify-content: space-between;
      padding: 5px;
      input[type="text"] {
        display: block;
        height: 30px;
        border-radius: 10px;
        width: 100%;
        width: calc(100% - 30px);
      }

      svg {
        color: white;
        transform: rotate(0deg);
        &:hover {
          color: var(--primary-yellow);
        }
        &:active {
          color: black;
        }
      }
    }
  }
`;
