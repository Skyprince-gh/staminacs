import style from "../formStyle.module.css";
import { ArrowBack } from "@mui/icons-material";
import "animate.css";
import { useEffect, useState } from "react";
import styled from "styled-components";
import regex from "../../../../util/regex";
import Prompt from "../../Prompt";
import Textbox from "../../../Inputs/Textbox";

const UserCredentials = (props) => {
  useEffect(() => {}, []);

  const [formIsValid, setFormIsValid] = useState(false);

  const [userName, setUserName] = useState({
    value: props.cred.userName || "",
    isValid: false,
  });
  const [password, setPassword] = useState({
    value: props.cred.password || "",
    isValid: false,
  });
  const [confirmPassword, setConfirmPassword] = useState({
    value: props.cred.confirmPassword || "",
    isValid: false,
  });

  const handleUserName = (event) => {
    setUserName({ ...userName, value: event.target.value });
  };

  const handleUserNameValidation = (event) => {
    if (regex.userName.test(event.target.value) || userName.value === "") {
      setUserName({ ...userName, isValid: false });
    } else {
      setUserName({ ...userName, isValid: true });
    }
  };

  const handlePassword = (event) => {
    setPassword({ ...password, value: event.target.value });
  };

  const handlePasswordValidation = (event) => {
    if (regex.password.test(event.target.value) || password.value === "") {
      setPassword({ ...password, isValid: false });
    } else {
      setPassword({ ...password, isValid: true });
    }
  };

  const handleConfirmPassword = (event) => {
    setConfirmPassword({ ...confirmPassword, value: event.target.value });
  };

  const handleConfirmPasswordValidation = (event) => {
    if (
      regex.password.test(event.target.value) &&
      confirmPassword.value === password.value
    ) {
      setConfirmPassword({ ...confirmPassword, isValid: false });
    } else {
      setConfirmPassword({ ...confirmPassword, isValid: true });
    }
  };

  const nextForm = (event) => {
    //trigger the external functions to switch to the next form and then push all the data to the auth object outside of this component
    event.preventDefault();
    if (userName.isValid || password.isValid || confirmPassword.isValid) {
      setFormIsValid(true);
      return;
    }

    setFormIsValid(false);

    props.handleFormData({
      userName: userName.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    });
    props.goToNext();
  };

  const previousForm = (event) => {
    //trigger the external functions to switch to the previous form and then push all the data to the auth object outside of this component
    props.goToPrev();
  };

  return (
    <Grid
      onSubmit={nextForm}
      className={`${style.grid} animate__animated animate__fadeInDown`}
      action=""
    >
      <h2>Complete Your Profile</h2>
      <div className={style.inputs}>
        <Textbox
          className={style.textInput}
          value={userName.value}
          onChange={handleUserName}
          type="text"
          onBlur={handleUserNameValidation}
          label="Username"
          required
        />
        {userName.isValid && (
          <Prompt>
            Username is invalid. Username must be one single word without
            spaces. You can use hyphens and letters.
          </Prompt>
        )}
        <Textbox
          className={style.textInput}
          value={password.value}
          onChange={handlePassword}
          onBlur={handlePasswordValidation}
          type="password"
          label="Password"
          required
        />
        {password.isValid && (
          <Prompt>
            Invalid password. Password must not be less than 8 characters
          </Prompt>
        )}
        <Textbox
          className={style.textInput}
          value={confirmPassword.value}
          onChange={handleConfirmPassword}
          onBlur={handleConfirmPasswordValidation}
          type="password"
          label="Retype Password"
          required
        />
        {confirmPassword.isValid && (
          <Prompt>
            Passwords do not match or is invalid. please check and retype
            password to match the one above
          </Prompt>
        )}
        {formIsValid && (
          <Prompt>
            One or more fields in the form do not have valid data. Please check
            and correct them before you proceed
          </Prompt>
        )}
      </div>
      <div className={style.links}>
        <div className={style.left}>
          <button className={style.submit} onClick={previousForm}>
            Back
          </button>
        </div>
        <div className={style.right}>
          <button className={style.submit} type="submit">
            Next
          </button>
        </div>
      </div>
    </Grid>
  );
};

export default UserCredentials;

const Grid = styled.form`
  height: 40vh;

  @media (max-height: 720px) {
    height: 60vh;
  }
`;
