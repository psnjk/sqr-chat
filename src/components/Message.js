import React from "react";
import PropTypes from "prop-types";
import { formatRelative } from "date-fns";

import cn from "./Message.module.scss";

const formatDate = (date) => {
  let formattedDate = "";
  if (date) {
    // Convert the date in words relative to the current date
    formattedDate = formatRelative(date, new Date());
    // Uppercase the first letter
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  return formattedDate;
};

const Message = ({
  createdAt = null,
  text = "",
  displayName = "",
  photoURL = "",
}) => {
  if (!text) return null;
  return (
    <div className={cn.root} data-testid="message">
      {photoURL ? (
        <img
          src={photoURL}
          alt="Avatar"
          className={cn.img}
          width={45}
          height={45}
        />
      ) : (
        <div className={cn.circle} />
      )}
      <div>
        <div className={cn.message}>
          {displayName ? <p className={cn.name}>{displayName}</p> : null}
          {createdAt?.seconds ? (
            <span className={cn.date}>
              {formatDate(new Date(createdAt.seconds * 1000))}
            </span>
          ) : null}
        </div>
        <p className={cn.text} data-testid="message-text">
          {text}
        </p>
      </div>
    </div>
  );
};

Message.propTypes = {
  text: PropTypes.string,
  createdAt: PropTypes.shape({
    seconds: PropTypes.number,
  }),
  displayName: PropTypes.string,
  photoURL: PropTypes.string,
};

export default Message;
