import style from "../formStyle.module.css";
import { Link } from "react-router-dom";
import "animate.css";
import { useState, useRef } from "react";
import regex from "../../../../util/regex";
import Prompt from "../../Prompt";
import auth, { signInEmailAndPassword } from "../../../../util/firebase-auth";
import Textbox from "../../../Inputs/Textbox";
// import { signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
  const [userName, setUserName] = useState({ value: "", isInvalid: false });
  const [email, setEmail] = useState({ value: "", isInvalid: false });
  const [password, setPassword] = useState({ value: "", isInvalid: false });
  const [formIsInvalid, setFormIsInvalid] = useState(false);
  const [isErr, setIsErr] = useState(false);

  // const handleUserName = (event) => {
  //   setUserName({ ...userName, value: event.target.value });
  // };

  const handleUserNameValidation = (event) => {
    if (regex.userName.test(event.target.value)) {
      setUserName({ ...userName, isInvalid: false });
    } else {
      setUserName({ ...userName, isInvalid: true });
    }
  };

  const handleEmail = (event) => {
    setEmail({ ...email, value: event.target.value });
  };

  const handleEmailValidation = (event) => {
    if (regex.email.test(event.target.value)) {
      setEmail({ ...email, isInvalid: false });
    } else {
      setEmail({ ...email, isInvalid: true });
    }
  };

  const handlePassword = (event) => {
    setPassword({ ...password, value: event.target.value });
  };

  const handlePasswordValidation = (event) => {
    if (regex.password.test(event.target.value)) {
      setPassword({ ...password, isInvalid: false });
    } else {
      setPassword({ ...password, isInvalid: true });
    }
  };

  //this function will sign the user in if the email and password is valid.
  const submitForm = (event) => {
    event.preventDefault();

    if (email.isInvalid || password.isInvalid) {
      setFormIsInvalid(true);
      return;
    }

    setFormIsInvalid(false);
    console.log("email:", email.value, "password:", password.value);
    signInEmailAndPassword(email.value.trim(), password.value.trim());
    
  };

  return (
    <form
      className={`${style.grid} animate__animated animate__fadeInDown`}
      action=""
    >
      <h2>Signin</h2>
      {/* <div> */}
      <div className={style.inputs}>
        {/* <Textbox
          className={style.textInput}
          onChange={handleUserName}
          onBlur={handleUserNameValidation}
          type="text"
          label="username"
          theme="white"
          required={true}
        /> */}
        {userName.isInvalid && (
          <Prompt>
            Username is invalid. Username must be one single word without
            spaces. You can use hyphens and letters.
          </Prompt>
        )}
        <Textbox
          className={style.textInput}
          onChange={handleEmail}
          onBlur={handleEmailValidation}
          type="email"
          label="email"
          placeholder="Email"
          theme="white"
          required={true}
        />
        {email.isInvalid && (
          <Prompt>Email Incorrect. Please Enter a valid email address</Prompt>
        )}
        <Textbox
          onChange={handlePassword}
          onBlur={handlePasswordValidation}
          label="password"
          type="password"
          theme="white"
          placeholder="Password"
          required={true}
        />
        {password.isInvalid && (
          <Prompt>
            Invalid password. Password must not be less than 8 characters
          </Prompt>
        )}
        {formIsInvalid && (
          <Prompt>
            One or more of the Field on the form is incorrect. Please validate
            your form before submission.
          </Prompt>
        )}

        {isErr && (
          <Prompt>
            Your email or password is incorrect please validate your email and
            password before submitting the form
          </Prompt>
        )}
      </div>
      <div className={style.links}>
        <div className={style.left}>
          <p>
            <Link to="/signin/forgotten-password">
              Forgotten your password?
            </Link>
          </p>
        </div>
        <div className={style.right}>
          <button className={style.submit} onClick={submitForm} type="submit">
            Signin
          </button>
        </div>
      </div>
      <div className={style.hasNoAccount}>
        <p>
          <Link to="/signup">Don't have an account?</Link>
        </p>
      </div>
    </form>
  );
};

export default SignIn;
