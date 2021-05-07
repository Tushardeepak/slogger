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
import { Fade, Slide, useMediaQuery, useTheme } from "@material-ui/core";

function TodoCard({
  id,
  text,
  todoStartDate,
  todoEndDate,
  checked,
  priority,
  teamTodoText,
  todoTeamName,
  help,
  transitionDirection,
  setTransitionDirection,
  setPersonalTabValue,
}) {
  const { currentUser } = useAuth();
  const [localCheck, setLocalCheck] = useState(checked);
  const [openEdit, setOpenEdit] = useState(false);
  const [transitionIn, setTransitionIn] = useState(true);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));

  const handleDelete = (todoId) => {
    setTransitionDirection("left");
    setTransitionIn(false);
    setTimeout(() => {
      db.collection("users")
        .doc(currentUser.uid)
        .collection("todos")
        .doc(todoId)
        .delete();
    }, 200);
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

  const emptyFunction = () => {};

  return (
    <Slide in={transitionIn} timeout={400} direction={transitionDirection}>
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
            <p className="startStartDate">
              Start{isSmall ? " Date:" : ":"}
              <span className="startEndDateSpan">
                {isSmall
                  ? new Date(todoStartDate).toString().substring(0, 15)
                  : new Date(todoStartDate).toString().substring(4, 11)}
              </span>
            </p>
            <p className="startEndDate">
              End{isSmall ? " Date:" : ":"}
              <span className="startEndDateSpan">
                {isSmall
                  ? new Date(todoEndDate).toString().substring(0, 15)
                  : new Date(todoEndDate).toString().substring(4, 11)}
              </span>
            </p>
            {new Date().getTime() - new Date(todoEndDate).getTime() >
              86400000 && !checked ? (
              <p className="missed">missed</p>
            ) : new Date(todoEndDate).toString().substring(0, 15) ===
                new Date().toString().substring(0, 15) && !checked ? (
              <p className="missed">due today</p>
            ) : (
              <p className="missed" style={{ opacity: 0 }}>
                {/* missed for spacing */}
                missed
              </p>
            )}
            <EditIcon
              className="editTodoIcon"
              onClick={() => setOpenEdit(true)}
            />
          </div>
          {help && (
            <p
              style={{
                backgroundColor: "rgba(0, 99, 66,0.4)",
                color: "#fff",
                fontWeight: 300,
                width: "auto",
                wordBreak: "break-word",
                verticalAlign: "center",
                height: "auto",
                padding: "5px",
                borderRadius: "5px",
                // lineHeight: "30px",
                fontFamily: "Times New Roman",
                display: "flex",
                flexDirection: "column",
                marginBottom: "0.3rem",
                fontSize: "13px",
              }}
            >
              <span style={{ marginBottom: "5px" }}>
                <span
                  style={{
                    fontSize: "10px",
                    color: "rgba(0, 99, 66)",
                    backgroundColor: "rgba(0, 99, 66,0.2)",
                    padding: "2px 10px",
                    borderRadius: "5px",
                  }}
                >
                  {todoTeamName}
                </span>
              </span>
              {teamTodoText}
            </p>
          )}
          <p
            style={{
              color: "rgba(0, 99, 66, 0.868)",
              fontWeight: 400,
              width: "100%",
              wordBreak: "break-word",
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
                extendedProps: {
                  teamName: todoTeamName,
                },
              },
            }}
            setPersonalTabValue={setPersonalTabValue}
            setOpenSchedular={emptyFunction}
            team={false}
            urlTeamName={""}
          />
        )}
      </TodoMainCard>
    </Slide>
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
  margin-top: -0.2rem;
  box-shadow: 0px 1px 3px rgb(0, 129, 86);
  background-color: rgb(231, 250, 243);
  border-radius: 20px 10px 30px 10px;
  width: 100%;
  height: 3rem;
  min-height: 3rem;
  display: flex;
  word-break: "break-word";
  height: auto;
`;
const TodoStartIcon = styled.div`
  transform: scale(0.8);
  flex: 0.04;
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
    font-size: 1.2rem;
    object-fit: contain;
    cursor: pointer;

    ${customMedia.lessThan("smTablet")`
      transform:scale(0.8);
      padding:0 0.3rem;
    `};
  }
`;
const TodoTextBox = styled.div`
  flex: 1;
  width: 100%;
  padding: 0.2rem 0.5rem;
  word-break: "break-word";
  height: auto;

  .todoDate {
    font-size: 13px;
    ${customMedia.lessThan("smTablet")`
       font-size:9px;
    `};
  }
  .startStartDate {
    flex: 0.5;
    font-size: 9px;
    color: rgba(4, 126, 85, 0.868);
    font-weight: 700;
    ${customMedia.lessThan("smTablet")`
       font-size:8px;
       font-weight: 400;
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
  .missed {
    font-size: 9px;
    color: #fff;
    background-color: rgba(4, 126, 85, 0.65);
    border-radius: 10px;
    padding: 2px 7px;
    width: 3rem;
    text-align: center;
    @media (max-width: 600px) {
      padding: 2px 0px;
      font-size: 8px;
    }
  }
  .editTodoIcon {
    margin-left: 1rem;
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
  flex: 0.03;
  width: 100%;
  height: auto;
  padding: 0.2rem 0.5rem;
  border-radius: 30px 10px 30px 30px;

  ${customMedia.lessThan("smTablet")`
      flex: 0.09;
    `};

  .delete {
    cursor: pointer;
    transform: scale(0.8);
    ${customMedia.lessThan("smTablet")`
      transform:scale(0.7);
    `};
  }
`;
