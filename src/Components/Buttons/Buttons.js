import styled from "styled-components";

const BtnPrimary = (props) => {
  return (
    <Grid
      width={props.width}
      type={props.type || "submit"}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </Grid>
  );
};

export const BtnSecondary = (props) => {
  return (
    <SecondaryBtn
      width={props.width}
      type={props.type || "submit"}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </SecondaryBtn>
  );
};

export const BtnTertiary = (props) => {
  return (
    <TertiaryBtn
      width={props.width}
      type={props.type || ""}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </TertiaryBtn>
  );
};

export const BtnDanger = (props) => {
  return (
    <BtnRed
      width={props.width}
      type={props.type || ""}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </BtnRed>
  );
};

export const BtnDisabled = (props) => {
  return (
    <BtnGrey
      width={props.width}
      type={props.type || ""}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </BtnGrey>
  );
};

export default BtnPrimary;

const Grid = styled.button`
  width: ${(props) => props.width || "auto"};
  min-width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-black);
  border-radius: 20px;
  color: white;
  font-weight: bold;
  border: none;
  font-size: 16px;
  padding: 0px 20px;

  &:hover {
    color: var(--primary-yellow);
  }

  &:active {
    color: var(--primary-black);
    background-color: var(--primary-yellow);
  }
`;

const SecondaryBtn = styled(Grid)`
  background-color: var(--primary-yellow);
  color: var(--primary-black);
  &:hover {
    color: white;
  }

  &:active {
    color: var(--primary-yellow);
    background-color: var(--primary-black);
  }
`;

const TertiaryBtn = styled(Grid)`
  border: solid 1px var(--primary-black);
  color: var(--primary-black);
  background: transparent;

  &:hover {
    color: var(--primary-yellow);
    border-color: var(--primary-yellow);
  }

  &:active {
    color: white;
    background-color: var(--primary-black);
  }
`;

const BtnRed = styled(Grid)`
  background-color: var(--red);

  &:hover {
    color: var(--primary-black);
  }

  &:active {
    color: white;
    background-color: var(--primary-black);
  }
`;

const BtnGrey = styled(Grid)`
  background-color: var(--primary-grey-2);
  color: white;

  &:hover {
    background: var(--primary-grey-2);
    color: white;
  }

  &:active {
    background-color: var(--primary-grey-2);
    color: white;
  }
`;
