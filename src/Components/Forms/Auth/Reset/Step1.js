import style from "../formStyle.module.css";
import styled from "styled-components";
import { Link } from "react-router-dom";
import "animate.css";
import { resetPasswordWithEmail } from "../../../../util/firebase-auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Step1 = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate()

  const sendResetLink = (event) => {
    event.preventDefault();
    resetPasswordWithEmail(email).then(() => {
      setEmailSent(true);
    });
  };

  const updateEmail = (event) => {
    setEmail(event.target.value);
  };

  const navigateToLogin = event => {
    event.preventDefault();
    navigate("/signin");
  }

  return (
    <>
      {!emailSent && (
        <Grid
          className={`${style.grid} animate__animated animate__fadeInDown`}
          action=""
          onSubmit={sendResetLink}
        >
          <h2>Forgot Your Password ?</h2>
          <CustomParagraph>
            No Worries, just enter your email address below.
          </CustomParagraph>
          <input
            className={style.textInput}
            type="email"
            name="email"
            placeholder="Email"
            onChange={updateEmail}
            value={email}
          />
          <div className={style.links}>
            <div className={style.left}></div>
            <div className={style.right}>
              <button className={style.submit} on type="submit">
                Continue
              </button>
            </div>
          </div>
          <div className={style.hasNoAccount}>
            <p>
              <Link to="/signup">Don't have an account?</Link>
            </p>
          </div>
        </Grid>
      )}

      {emailSent && (
        <Grid
          className={`${style.grid} animate__animated animate__fadeInDown`}
          action=""
          onSubmit={navigateToLogin}
        >
          <h2>Forgot Your Password ?</h2>
          <CustomParagraph>
            Password reset link sent to your email: {email}. Check your email to
            reset your password
          </CustomParagraph>

          <div className={style.links}>
            <div className={style.left}></div>
            <div className={style.right}>
              <button className={style.submit} on type="submit">
               Login
              </button>
            </div>
          </div>
          <div className={style.hasNoAccount}>
            <p>
              <Link to="/signup">Don't have an account?</Link>
            </p>
          </div>
        </Grid>
      )}
    </>
  );
};

export default Step1;

const Grid = styled.form`
  height: auto;
  padding-top: 50px;
  padding-bottom: 50px;

  input {
    height: 60px;
  }
`;

const CustomParagraph = styled.p`
  margin-left: 5%;
  margin-top: 20px;
  color: white;
  margin-bottom: 20px;
`;
