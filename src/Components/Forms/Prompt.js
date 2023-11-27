import styled from "styled-components";

const FormPropt = (props) => {
  return (
    <Prompt>
      <p>{props.children}</p>
    </Prompt>
  );
};

export default FormPropt;

const Prompt = styled.div`
  color: var(--primary-yellow);
  border: solid 2px var(--primary-yellow);
  border-radius: 10px;
  padding: 5px 0px;
  display: flex;
  justify-content: flex-start;
  padding-left:10px;
  width: 100%;
`;
