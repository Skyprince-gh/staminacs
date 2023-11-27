import styled from 'styled-components'

const Textbox = ({
  theme,
  label,
  type,
  value,
  onChange,
  onBlur,
  prefix,
  suffix,
  required = false
}) => {
  const isBlackTheme = theme === "black";

  return (
    <StyledTextboxWrapper theme={theme}>
      <StyledLabel theme={theme} htmlFor={label}>
        {label}
      </StyledLabel>

        {prefix && <StyledPrefix>{prefix}</StyledPrefix>}
        <StyledInput
          id={label}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="off"
          autoSave="off"
          theme={theme}
          required = {required}
        />
        {suffix && <StyledSuffix>{suffix}</StyledSuffix>}
    </StyledTextboxWrapper>
  );
};

export default Textbox

// Create styled components for your elements
const StyledTextboxWrapper = styled.div`
  width: 100%;
  height: 40px;
  position: relative;
  border: 2px solid ${(props) => (props.theme === "black" ? "#000" : "#fff")};
  border-radius: 2rem;
`;

const StyledLabel = styled.label`
  font-size: 12px;
  position: absolute;
  top: -12px;
  left: 8px;
  border-radius: 1rem;
  padding: 0.2rem 0.4rem;
  color: ${(props) => (props.theme === "black" ? "#000" : "#fff")};
  background-color: ${(props) => (props.theme === "black" ? "#fff" : "var(--primary-black)")};
`;

const StyledInputWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const StyledPrefix = styled.span`
  font-weight: bold;
  width: 10%;
  margin-left: 8px;
`;

const StyledInput = styled.input`
  flex: 1;
  height: 100%;
  width: 100%;
  border: none;
  background-color: transparent;
  color: ${(props) => (props.theme === "black" ? "#000" : "#fff")};
  outline: none;
  padding-left: 20px;
`;

const StyledSuffix = styled.span`
  font-weight: bold;
  width: 10%;
  margin-right: 8px;
`;