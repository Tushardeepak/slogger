import React, { useState } from "react";
import styled from "styled-components";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import DeleteIcon from "@material-ui/icons/Delete";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import moment from "moment";
import CustomTooltip from "../CustomTooltip";
import { generateMedia } from "styled-media-query";

function Chat({ senderId, text, date, name, admin }) {
  const { currentUser } = useAuth();

  var timeDifference = new Date().getTimezoneOffset();
  var date = moment(date).subtract(1, "h");
  var dateComponent = date.utc().format("DD-MM-YYYY");
  var timeComponent = date.utc().utcOffset(timeDifference).format("HH:mm");
  var hours = new Date(date).getHours();
  var ampm = hours >= 12 ? "pm" : "am";

  return (
    <TodoMainCard>
      {senderId === currentUser.uid ? (
        <TodoTextBox>
          {currentUser.uid === senderId ? (
            ""
          ) : (
            <p className="senderName">
              {name}
              {senderId === admin ? " (Admin)" : ""}{" "}
            </p>
          )}

          <p
            style={{
              color: "rgba(0, 99, 66, 0.868)",
              fontWeight: 400,
              width: "100%",
              wordBreak: "break-all",
              verticalAlign: "center",
              height: "auto",
              fontSize: "small",
              margin: "0.2rem 0",
            }}
          >
            {text}
          </p>
          <p className="messageTime">
            {" "}
            {timeComponent} {ampm} {" - "}
            {dateComponent}
          </p>
        </TodoTextBox>
      ) : (
        <TodoTextBoxReceived>
          {currentUser.uid === senderId ? (
            ""
          ) : (
            <p className="senderName">{name}</p>
          )}

          <p
            style={{
              color: "rgba(0, 99, 66, 0.868)",
              fontWeight: 400,
              width: "100%",
              wordBreak: "break-all",
              verticalAlign: "center",
              height: "auto",
              fontSize: "small",
              margin: "0.2rem 0",
            }}
          >
            {text}
          </p>
          <p className="messageTime">
            {" "}
            {timeComponent} {ampm} {" - "}
            {dateComponent}
          </p>
        </TodoTextBoxReceived>
      )}
    </TodoMainCard>
  );
}

export default Chat;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "740px",
});

const TodoMainCard = styled.div`
  margin: 0.7rem 0rem;
  width: 100%;
  height: 3rem;
  min-height: 3rem;
  display: flex;
  word-break: "break-all";
  height: auto;
`;

const TodoTextBox = styled.div`
  background-color: rgb(231, 250, 243);
  border-radius: 15px 0px 15px 15px;
  margin-left: 40%;
  width: 60%;
  padding: 0.2rem 0.5rem;
  word-break: "break-all";
  height: auto;
`;

const TodoTextBoxReceived = styled.div`
  background-color: rgb(231, 250, 243);
  border-radius: 0px 15px 15px 15px;
  width: 60%;
  padding: 0.2rem 0.5rem;
  word-break: "break-all";
  height: auto;
`;
const TodoActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  flex: 0.05;
  width: 100%;
  height: auto;
  padding: 0.2rem 0.5rem;
  background-color: rgba(0, 99, 66, 0.868);
  border-radius: 30px 0px 0px 30px;
  border-left: 2px solid rgba(0, 99, 66, 0.768);

  ${customMedia.lessThan("smTablet")`
      flex: 0.09;
    `};

  .delete {
    cursor: pointer;
    ${customMedia.lessThan("smTablet")`
      transform:scale(0.8);
    `};
  }
`;
