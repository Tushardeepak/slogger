import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import DeleteIcon from "@material-ui/icons/Delete";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import moment from "moment";
import CustomTooltip from "../CustomTooltip";
import { generateMedia } from "styled-media-query";
import EditIcon from "@material-ui/icons/Edit";
import CalendarModal from "../Schedular/CalendarModal";
import { useMediaQuery, useTheme } from "@material-ui/core";

function TodoCard({ id, text, todoStartDate, todoEndDate, checked, priority }) {
  const { currentUser } = useAuth();
  const [localCheck, setLocalCheck] = useState(checked);
  const [openEdit, setOpenEdit] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));

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
        <CustomTooltip title="Completed" arrow placement="left">
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
        <div
          className="todoDate"
          style={{
            width: "100%",
            height: "20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <p className="startEndDate">
            Start{isSmall ? " Date:" : ":"}
            <span className="startEndDateSpan">
              {isSmall
                ? new Date(todoStartDate).toString().substring(0, 15)
                : new Date(todoStartDate).toString().substring(0, 11)}
            </span>
          </p>
          <p className="startEndDate">
            End{isSmall ? " Date:" : ":"}
            <span className="startEndDateSpan">
              {isSmall
                ? new Date(todoStartDate).toString().substring(0, 15)
                : new Date(todoStartDate).toString().substring(0, 11)}
            </span>
          </p>
          <EditIcon
            className="editTodoIcon"
            onClick={() => setOpenEdit(true)}
          />
        </div>
        <p
          style={{
            color: "rgba(0, 99, 66, 0.868)",
            fontWeight: 400,
            width: "100%",
            wordBreak: "break-all",
            verticalAlign: "center",
            height: "auto",
            // lineHeight: "30px",
            fontFamily: "Times New Roman",
          }}
        >
          {text}
        </p>
      </TodoTextBox>
      <TodoActions
        style={{
          backgroundColor:
            priority === 3
              ? "rgba(185, 5, 5, 0.8)"
              : priority === 2
              ? "rgba(185, 86, 5, 0.8)"
              : "rgba(0, 99, 66, 0.8)",
        }}
      >
        <DeleteIcon className="delete" onClick={() => handleDelete(id)} />
      </TodoActions>
      {openEdit && (
        <CalendarModal
          open={openEdit}
          handleClose={() => setOpenEdit(false)}
          event={{
            title: text,
            backgroundColor:
              priority === 3
                ? "rgba(185, 5, 5, 0.8)"
                : priority === 2
                ? "rgba(185, 86, 5, 0.8)"
                : "rgba(0, 99, 66, 0.8)",
            start: new Date(todoStartDate),
            end: new Date(todoEndDate),
            _def: {
              publicId: id,
            },
          }}
        />
      )}
    </TodoMainCard>
  );
}

export default TodoCard;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "600px",
});

const TodoMainCard = styled.div`
  margin: 0.7rem 0rem;
  box-shadow: 0px 1px 5px rgb(0, 129, 86);
  background-color: rgb(231, 250, 243);
  border-radius: 20px 10px 30px 10px;
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
  .startEndDate {
    flex: 0.5;
    font-size: 9px;
    color: rgba(4, 126, 85, 0.868);
    font-weight: 700;
    ${customMedia.lessThan("smTablet")`
       font-size:8px;
       font-weight: 400;
    `};
  }
  .startEndDateSpan {
    font-weight: 400;
    margin-left: 0.5rem;
    ${customMedia.lessThan("smTablet")`
          margin-left:0.1rem;
    `};
  }
  .editTodoIcon {
    color: rgba(4, 126, 85, 0.568);
    transform: scale(0.7);
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }
  .editTodoIcon:hover {
    color: rgba(4, 126, 85, 0.868);
    transform: scale(0.8);
  }
`;
const TodoActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  flex: 0.05;
  width: 100%;
  height: auto;
  padding: 0.2rem 0.5rem;
  border-radius: 30px 10px 30px 30px;

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
