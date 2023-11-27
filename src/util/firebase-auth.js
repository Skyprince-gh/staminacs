import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  ActionCodeSettings,
} from "firebase/auth";

import { initializeApp } from "firebase/app";
import { firebaseCredentials } from "../keys";

const app = initializeApp(firebaseCredentials);

const auth = getAuth(app);

// const actionCodeSettings = new ActionCodeSettings({
//   url: 'https://www.example.com/?email=' + auth.currentUser.email, 
//   handleCodeInApp: true,
//   dynamicLinkDomain:"example.page.link"
// })

//exports a function that allow you to sign into your app with an email and a password.
export const signInEmailAndPassword = async (email, password, Msg) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredentials) {
      console.log("signed in as", userCredentials.email);
      console.log("userCredentials:", userCredentials);
      return userCredentials;
    } else {
      return null;
    }
  } catch (err) {
    console.log("could not sign in with your email and password", err);
  }
};

export const createUserEmailAndPassword = async (email, password) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    if (userCredentials) {
      // console.log("user created:", userCredentials.email);
      // console.log("userCredentials:", userCredentials);
      return userCredentials;
    } else {
      return null;
    }
  } catch (err) {
    console.log("could not create user with given email and password:", err);
  }
};

export const resetPasswordWithEmail = async (email) => {
  await sendPasswordResetEmail(auth, email);

  return;
};

export default auth;
