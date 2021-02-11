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

function TodoCard({ id, text, date, checked }) {
  const { currentUser } = useAuth();
  const [localCheck, setLocalCheck] = useState(checked);

  var timeDifference = new Date().getTimezoneOffset();
  var date = moment(date).subtract(1, "h");
  var dateComponent = date.utc().format("DD-MM-YYYY");
  var timeComponent = date.utc().utcOffset(timeDifference).format("HH:mm");

  const handleDelete = (todoId) => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("todos")
      .doc(todoId)
      .delete();
  };

  const handleChecked = () => {
    setLocalCheck(!localCheck);
    db.collection("users").doc(currentUser.uid).collection("todos").doc(id).set(
      {
        checked: localCheck,
      },
      { merge: true }
    );
  };

  return (
    <TodoMainCard>
      <TodoStartIcon>
        <CustomTooltip title="Double tap" arrow placement="left">
          {checked ? (
            <CheckBoxIcon
              className="todoStartIcon"
              onClick={() => handleChecked()}
            />
          ) : (
            <CheckBoxOutlineBlankIcon
              className="todoStartIcon"
              onClick={() => handleChecked()}
            />
          )}
        </CustomTooltip>
      </TodoStartIcon>

      <TodoTextBox>
        <p
          className="todoDate"
          style={{
            color: "rgba(0, 99, 66, 0.668)",
            textAlign: "end",
            paddingBottom: "0.3rem",
          }}
        >
          {dateComponent}
          {" / "}
          {timeComponent}
        </p>
        <p
          style={{
            color: "rgba(0, 99, 66, 0.868)",
            fontWeight: 400,
            width: "100%",
            wordBreak: "break-all",
            verticalAlign: "center",
            height: "auto",
            // lineHeight: "30px",
            marginTop: "-8px",
          }}
        >
          {text}
        </p>
      </TodoTextBox>
      <TodoActions>
        <DeleteIcon className="delete" onClick={() => handleDelete(id)} />
      </TodoActions>
    </TodoMainCard>
  );
}

export default TodoCard;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "740px",
});

const TodoMainCard = styled.div`
  margin: 0.7rem 0rem;
  box-shadow: 0px 1px 5px rgb(0, 129, 86);
  background-color: rgb(231, 250, 243);
  border-radius: 10px;
  width: 100%;
  height: 3rem;
  min-height: 3rem;
  display: flex;
  word-break: "break-all";
  height: auto;
`;
const TodoStartIcon = styled.div`
  transform: scale(0.8);
  flex: 0.07;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 2px solid rgba(0, 99, 66, 0.368);

  ${customMedia.lessThan("smTablet")`
      flex: 0.09;
    `};

  .todoStartIcon {
    color: rgba(0, 99, 66, 0.568);
    font-size: 1.7rem;
    object-fit: contain;
    cursor: pointer;

    ${customMedia.lessThan("smTablet")`
      transform:scale(0.8);
      padding:0 0.3rem;
    `};
  }
`;
const TodoTextBox = styled.div`
  flex: 0.88;
  width: 100%;
  padding: 0.2rem 0.5rem;
  word-break: "break-all";
  height: auto;

  .todoDate {
    font-size: 13px;
    ${customMedia.lessThan("smTablet")`
       font-size:9px;
    `};
  }
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
