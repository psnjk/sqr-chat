import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithRedirect,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";

import cn from "./Auth.module.scss";

const Auth = ({ auth, db }) => {
  const provider = new GoogleAuthProvider();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [status, setStatus] = useState("");

  if (status === "reset") {
    return (
      <>
        <div className={cn.root} data-testid="reset">
          <input
            type="text"
            className={cn.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail Address"
          />
          <button
            className={cn.button}
            onClick={() => sendPasswordReset(auth, email)}
          >
            Send password reset email
          </button>
        </div>
        <button
          className={cn.buttonReg}
          onClick={() => setStatus("login")}
          data-testid="toLogin-id"
        >
          Log In
        </button>
      </>
    );
  }
  if (status === "reg") {
    return (
      <div className={cn.root} data-testid="reg">
        <input
          type="text"
          className={cn.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
        />
        <input
          type="text"
          className={cn.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className={cn.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className={cn.button}
          onClick={() => register(auth, db, name, email, password)}
        >
          Register
        </button>
        <button
          className={cn.buttonReg}
          onClick={() => setStatus("login")}
          data-testid="toLogin-id"
        >
          Already have an account?
        </button>
      </div>
    );
  }
  return (
    <>
      <div className={cn.root} data-testid="login">
        <input
          type="text"
          className={cn.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className={cn.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className={cn.button}
          onClick={() => logInWithEmailAndPassword(auth, email, password)}
        >
          Login
        </button>
        <button
          className={cn.buttonReg}
          onClick={() => setStatus("reg")}
          data-testid="toReg-id"
        >
          Do not have an account?
        </button>
        <button
          className={cn.buttonReg}
          onClick={() => setStatus("reset")}
          data-testid="toReset-id"
        >
          Forgot password
        </button>
        <button onClick={() => signInGoogle(auth, provider)}>Google</button>
      </div>
    </>
  );
};

export default Auth;

export const logInWithEmailAndPassword = async (auth, email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    // console.error(err);
    // alert(err.message);
    return;
  }
};

export const registerWithEmailAndPassword = async (
  auth,
  db,
  name,
  email,
  password
) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });
  } catch (err) {
    // console.error(err);
    // alert(err.message);
    return;
  }
};
export const register = (auth, db, name, email, password) => {
  if (!name) {
    return;
  }
  registerWithEmailAndPassword(auth, db, name, email, password);
};

export const sendPasswordReset = async (auth, email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    // console.error(err);
    // alert(err.message);
    return;
  }
};

export const signInGoogle = (auth, provider) => {
  if (!auth || !provider) return;
  signInWithRedirect(auth, provider);
};
