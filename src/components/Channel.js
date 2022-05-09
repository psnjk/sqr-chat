import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  addDoc,
} from "firebase/firestore";

import Message from "./Message";

import cn from "./Channel.module.scss";

const Channel = ({ db, auth }) => {
  const [user] = useAuthState(auth);
  const messagesRef = collection(db, "messages");
  const [anonModeName, setAnonModeName] = useState(undefined);

  const messages = QueryFirestore(
    query(messagesRef, orderBy("createdAt", "desc"), limit(100))
  );

  const [newMessage, setNewMessage] = useState("");

  const inputRef = useRef();
  const bottomListRef = useRef();

  const { uid, displayName, photoURL } = user;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const handleOnChange = (e) => {
    setNewMessage(e.target.value);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      const obj = !anonModeName
        ? {
            text: trimmedMessage,
            createdAt: serverTimestamp(),
            uid,
            displayName,
            photoURL,
          }
        : {
            text: trimmedMessage,
            createdAt: serverTimestamp(),
            displayName: anonModeName,
          };
      addDoc(messagesRef, obj);
      setNewMessage("");
      bottomListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={cn.root}>
      <div className={cn.messages}>
        <div className={cn.container}>
          <div className={cn.greet}>
            <div className={cn["greet--title"]}>
              <p style={{ marginBottom: "0.25rem" }}>Welcome to</p>
              <p style={{ marginBottom: "0.75rem" }}>React FireChat</p>
            </div>
            <p className={cn["greet--text"]}>
              This is the beginning of this chat.
            </p>
          </div>
          <ul style={{ listStyle: "none" }}>
            {messages
              ?.sort((first, second) =>
                first?.createdAt?.seconds <= second?.createdAt?.seconds ? -1 : 1
              )
              ?.map((message) => (
                <li key={message.id}>
                  <Message {...message} />
                </li>
              ))}
          </ul>
          <div ref={bottomListRef} />
        </div>
      </div>
      <div className={cn.root2}>
        <form onSubmit={handleOnSubmit} className={cn.form}>
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={handleOnChange}
            placeholder="Type your message here..."
            className={cn.input}
          />
          <button type="submit" disabled={!newMessage} className={cn.submit}>
            Send
          </button>
        </form>
        <Options
          anonModeName={anonModeName}
          setAnonModeName={setAnonModeName}
        />
      </div>
    </div>
  );
};

Channel.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    displayName: PropTypes.string,
    photoURL: PropTypes.string,
  }),
};

export default Channel;

const QueryFirestore = (query) => {
  const queryRef = useRef(query);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(queryRef.current, (querySnapshot) => {
      const mess = [];
      querySnapshot.forEach((doc) => {
        mess.push(doc.data());
      });
      setMessages(mess);
    });
    return unsubscribe;
  }, [queryRef]);

  return messages;
};

const Options = ({ anonModeName, setAnonModeName }) => {
  const [name, setName] = useState();
  const handleOnChange = (e) => {
    setName(e.target.value);
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    setAnonModeName(name);
  };
  const hadnleClick = () => {
    setAnonModeName(undefined);
    setName("");
  };
  return (
    <>
      <div>
        <form onSubmit={handleOnSubmit} className={cn.options}>
          <input
            type="text"
            value={name}
            onChange={handleOnChange}
            placeholder="Name for anon mode"
            className={cn.input}
          />
          <div className={cn.btns}>
            <button
              type="submit"
              disabled={!name}
              className={cn[`anonBtn${anonModeName ? "--active" : ""}`]}
            >
              Anonymous mode {!anonModeName ? " - disabled" : " - enabled"}
            </button>
            {anonModeName && (
              <button onClick={hadnleClick} style={{ color: "red" }}>
                X
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};
