import styled from "styled-components";

const DashedProgressBar = (props) => {
  return (
    <ProgressionBar>
      {new Array(props.step).fill(0).map((item,index) => (
        <Bar color={props.color || "var(--primary-yellow)"} key={index} />
      ))}

      {new Array(props.repeat - props.step).fill(0).map((item,index) => (
        <Bar color='black' key={index + "a"}/>
      ))}
    </ProgressionBar>
  );
};

export default DashedProgressBar;

const ProgressionBar = styled.div`
  width: 70%;
  /* position: relative; */
  display: flex;
  height: 30px;
  /* bottom: 25px; */
  justify-content: center;
`;

const Bar = styled.div`
${props => `
background-color: ${props.color};
`}
  width: 12px;
  height: 12px;
  border-radius: 6px;
  margin: auto 5px
`
