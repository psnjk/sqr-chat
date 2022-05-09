import React from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import Channel from "./components/Channel";
import Auth from "./Auth/Auth";

import cn from "./App.module.scss";

function App() {
  const firebaseApp = initializeApp({
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_AUTH_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
  });
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const [user, loading, error] = useAuthState(auth);

  const logout = () => {
    signOut(auth);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={cn.container}>
          <p>loading...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className={cn.container} data-testid="error">
          <p>Something went wrong :( try again.</p>
        </div>
      );
    }

    if (user) return <Channel db={db} auth={auth} data-testid="channel" />;
    return (
      <div className={cn.logIn}>
        <div className={cn["logIn--container"]}>
          <h2 className={cn["logIn--title"]}>Chat on firebase and react</h2>
          <p>The easiest way to chat with people all around the world.</p>
          <Auth auth={auth} db={db} />
        </div>
      </div>
    );
  };

  return (
    <div className={cn.root} data-testid="app">
      <header className={cn.header}>
        <p>React Firebase Chat</p>
        <div>
          {user ? (
            <button
              onClick={logout}
              className={cn["header--button"]}
              data-testid="signout"
            >
              Sign out
            </button>
          ) : null}
        </div>
      </header>
      <main className={cn.main}>{renderContent()}</main>
    </div>
  );
}

export default App;
