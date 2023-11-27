import styled from "styled-components";

const Input = (props) => {
  // console.log(typeof props.width);
  return (
    <Grid type={props.type} width={props.width}>
      {props.type != "checkbox" && (
        <label htmlFor={props.id || props.name}>{props.label}</label>
      )}

      {props.type === "select_group" && <Select
          name={props.name || ""}
          id={props.id || ""}
          onChange={props.onChange}
        >
          {props.children}
        </Select>}
      {props.type === "select" && (
        <Select
          name={props.name || ""}
          id={props.id || ""}
          onChange={props.onChange}
        >
          {props.options.map((opt, index) => (
            <option value={opt.value} key={opt.name + index}>
              {opt.name}
            </option>
          ))}
        </Select>
      )}

      {props.type === "checkbox" && (
        <Checkbox
          type="checkbox"
          checked={props.value}
          name={props.name || ""}
          id={props.id || ""}
          onChange={(e) => {
            props.onChecked(e);
          }}
        />
      )}
    </Grid>
  );
};

export default Input;

const Grid = styled.div`

  width: ${(props) =>
    props.type === "checkbox"
      ? "50px"
      : props.width +
        "px"}; // the props width will change based on whether the input element is of type radio
  height: ${(props) =>
    props.type === "checkbox"
      ? "20px"
      : "40px"}; // the props height will change based on whether the input element is of type radio
  /* width: ${(props) => props.width + "px"}; */
  /* height: 50px; */
  padding: 5px 10px;
  border: ${(props) =>
    props.type === "checkbox" ? "none" : "solid 1px var(--primary-black)"};
  border-radius: 15px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: ${(props) => (props.type = "checkbox" ? "transparent" : "white")};
  position: relative;

  label {
    width: auto;
    font-size: 10px;
    background: white;
    border-radius: 50%;
    display: inline-flex;
    position: absolute;
    /* text-overflow: ellipsis; */
    white-space: nowrap;
    color: var(--primary-black);
    top: -10px;
    padding: 0 5px;
  }
`;

const Select = styled.select`
  width: 100%;
  margin-left: auto;
  outline: none;
  border: none;
  font-size: 18px;
  margin-left: 0;
  background: transparent;

  option {
    text-transform: capitalize;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: flex-start;
  }

  optgroup{
    text-transform: capitalize;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: flex-start;

    option {
    text-transform: capitalize;
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: flex-start;
  }
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
`;
