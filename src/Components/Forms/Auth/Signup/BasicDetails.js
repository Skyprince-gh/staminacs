import style from "../formStyle.module.css";
import { Link } from "react-router-dom";
import "animate.css";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Prompt from "../../Prompt";
import regex from "../../../../util/regex";
import Textbox from "../../../Inputs/Textbox";

const BasicDetails = (props) => {
  useEffect(() => {}, []);
  const [firstName, setFirstName] = useState({
    value: props.cred.firstName || "",
    isValid: false,
  });
  const [lastName, setLastName] = useState({
    value: props.cred.lastName || "",
    isValid: false,
  });
  const [email, setEmail] = useState({
    value: props.cred.email || "",
    isValid: false,
  });

  const [formIsValid, setFormIsValid] = useState(false);

  const handleFirstName = (event) => {
    setFirstName({ ...firstName, value: event.target.value });
  };

  const handleFirstNameValidation = (event) => {
    if (regex.firstName.test(event.target.value)) {
      setFirstName({ ...firstName, isValid: false });
    } else {
      setFirstName({ ...firstName, isValid: true });
    }
  };

  const handleLastName = (event) => {
    setLastName({ ...lastName, value: event.target.value });
  };

  const handleLastNameValidation = (event) => {
    if (regex.lastName.test(event.target.value)) {
      setLastName({ ...lastName, isValid: false });
    } else {
      setLastName({ ...lastName, isValid: true });
    }
  };

  const handleEmail = (event) => {
    setEmail({ ...email, value: event.target.value });
  };

  const handleEmailValidation = (event) => {
    if (regex.email.test(event.target.value)) {
      setEmail({ ...email, isValid: false });
    } else {
      setEmail({ ...email, isValid: true });
    }
  };

  const nextForm = (event) => {
    //trigger the external functions to switch to the next form and then push all the data to the auth object outside of this component
    event.preventDefault();
    if (
      email.isValid === true ||
      firstName.isValid === true ||
      lastName.isValid === true
    ) {
      setFormIsValid(true);
      return;
    }

    setFormIsValid(false);
    props.handleFormData({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
    });
    props.goToNext();
  };

  return (
    <Grid
      onSubmit={nextForm}
      className={`${style.grid} animate__animated animate__fadeInDown`}
      action=""
    >
      <h2>Signup</h2>
      <div className={style.inputs}>
        <Textbox
          className={style.textInput}
          value={firstName.value}
          onChange={handleFirstName}
          onBlur={handleFirstNameValidation}
          type="text"
          label="First Name"
          required = {true}
        />
        {firstName.isValid && (
          <Prompt>
            first name must be not less than two chacters and without spaces ,
            numbers or symbols
          </Prompt>
        )}
        <Textbox
          className={style.textInput}
          value={lastName.value}
          onChange={handleLastName}
          onBlur={handleLastNameValidation}
          type="text"
          label="Last Name"
          required = {true}
        />
        {lastName.isValid && (
          <Prompt>
            You can only enter a maximum of two other names seperated by spaces,
            numbers or symbols are not allowed
          </Prompt>
        )}
        <Textbox
          className={style.textInput}
          value={email.value}
          onChange={handleEmail}
          onBlur={handleEmailValidation}
          type="email"
          label= "email"
          required = {true}
        />
        {email.isValid && (
          <Prompt>Email Incorrect. Please Enter a valid email address</Prompt>
        )}
      </div>
      <div className={style.links}>
        <div className={style.left}>
          <p>
            <Link to="/signin">Already have an account?</Link>
          </p>
        </div>
        <div className={style.right}>
          <button className={style.submit} type="submit">
            Next
          </button>
        </div>
      </div>
      {formIsValid && (
        <Prompt>
          One or more of the fields is empty or contains incorrect data. Make
          corrections to proceed
        </Prompt>
      )}
    </Grid>
  );
};

export default BasicDetails;

const Grid = styled.form`
  height: auto;

  @media (max-height: 720px) {
    height: 60vh;
  }
`;
