import React, { useState } from "react";
import styled from "styled-components";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import DeleteIcon from "@material-ui/icons/Delete";
import { useAuth } from "../../context/AuthContext";
import { db, storage } from "../../firebase";
import moment from "moment";
import CustomTooltip from "../CustomTooltip";
import { generateMedia } from "styled-media-query";
import {
  Button,
  IconButton,
  Slide,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import Material from "./Material";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import DoneIcon from "@material-ui/icons/Done";
import CalendarModal from "../Schedular/CalendarModal";

function TeamTodoCard({
  id,
  text,
  startDate,
  endDate,
  checked,
  checkedBy,
  admin,
  urlTeamName,
  assigned,
  assignedBy,
  todoImage,
  comment,
  userName,
  profileImage,
  setTabValue,
  transitionDirection,
  setTransitionDirection,
  priority,
  setOpenSchedular,
}) {
  const { currentUser } = useAuth();
  const [localCheck, setLocalCheck] = useState(checked);
  const [assignedTo, setAssignedTo] = useState();
  const [openMaterial, setOpenMaterial] = useState(false);
  const [assignChange, setAssignChange] = useState(false);
  const [transitionIn, setTransitionIn] = useState(true);
  const [edit, setEdit] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));

  React.useEffect(() => {
    if (assigned === "") {
      setAssignedTo("");
    } else {
      setAssignedTo(assigned);
    }
  }, [assigned]);

  const handleInputChange = (value) => {
    setAssignedTo(value);
    setAssignChange(true);
  };

  const handleDelete = async (id) => {
    setTransitionDirection("left");
    setTransitionIn(false);
    setTimeout(() => {
      db.collection("teams")
        .doc(urlTeamName)
        .collection("teamTodos")
        .doc(id)
        .collection("teamTodoImages")
        .onSnapshot((snapshot) => {
          const list = snapshot.docs.map((doc) => ({
            id: doc.id,
            todoImage: doc.data().todoImage,
          }));
          if (list.length !== 0) {
            list.forEach((file) => {
              storage.refFromURL(file.todoImage).delete();
            });
          }
        });

      db.collection("teams")
        .doc(urlTeamName)
        .collection("teamTodos")
        .doc(id)
        .delete();
    }, 200);
  };

  const handleChecked = () => {
    setLocalCheck(!localCheck);
    db.collection("teams")
      .doc(urlTeamName)
      .collection("teamTodos")
      .doc(id)
      .set(
        {
          checked: localCheck,
          checkedBy: localCheck ? userName : "",
        },
        { merge: true }
      );
  };

  const handleAssignedSubmit = () => {
    db.collection("teams").doc(urlTeamName).collection("teamTodos").doc(id).set(
      {
        assignedTo: assignedTo,
      },
      { merge: true }
    );
    setAssignedTo("");
    setAssignChange(false);
  };

  const emptyFunction = () => {};

  return (
    <Slide in={transitionIn} timeout={400} direction={transitionDirection}>
      <TodoMainCard>
        <TodoStartIcon>
          {/* <CustomTooltip title="Double tap" arrow placement="top"> */}
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
          {/* </CustomTooltip> */}
        </TodoStartIcon>

        <TodoTextBox>
          {!isSmall ? (
            <>
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex" }}>
                  <Button
                    className="uploadView"
                    style={{
                      width: "98%",
                      fontSize: "0.65rem",
                      height: "1.2rem",
                      color: "#fff",
                      backgroundColor: "rgb(5, 185, 125,0.8)",
                      marginRight: "0.4rem",
                    }}
                    onClick={() => setEdit(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="uploadView"
                    style={{
                      width: "10%",
                      fontSize: "0.65rem",
                      height: "1.2rem",
                      color: "#fff",
                      backgroundColor: "rgb(5, 185, 125,0.8)",
                      marginRight: "1rem",
                      marginBottom: "0.2rem",
                    }}
                    onClick={() => setOpenMaterial(true)}
                  >
                    Details
                  </Button>
                </div>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginRight: "0.4rem",
                    }}
                  >
                    <strong
                      className="todoDate"
                      style={{
                        color: "rgba(0, 99, 66, 0.668)",
                      }}
                    >
                      Start
                    </strong>
                    <p
                      className="todoDate"
                      style={{
                        color: "rgba(0, 99, 66, 0.668)",
                        paddingBottom: "0.3rem",
                      }}
                    >
                      {startDate?.substring(8, 10)}
                      {"/"}
                      {startDate?.substring(5, 7)}
                      {"/"}
                      {startDate?.substring(0, 4)}
                    </p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginRight: "0.4rem",
                    }}
                  >
                    <strong
                      className="todoDate"
                      style={{
                        color: "rgba(0, 99, 66, 0.668)",
                      }}
                    >
                      End
                    </strong>
                    <p
                      className="todoDate"
                      style={{
                        color: "rgba(0, 99, 66, 0.668)",
                        paddingBottom: "0.3rem",
                      }}
                    >
                      {endDate?.substring(8, 10)}
                      {"/"}
                      {endDate?.substring(5, 7)}
                      {"/"}
                      {endDate?.substring(0, 4)}
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ width: "100%", flex: 1, marginBottom: "0.5rem" }}>
                <div className="inputField">
                  <p className="assignedTo">Assigned to :</p>
                  <input
                    value={assignedTo}
                    className="todoInput"
                    type="text"
                    onChange={
                      admin === currentUser.uid
                        ? (e) => handleInputChange(e.target.value)
                        : () => emptyFunction()
                    }
                    // onKeyDown={(e) => handleSubmitEnter(e)}
                  />
                  {admin === currentUser.uid
                    ? assignChange && (
                        <DoneIcon
                          className="assignIcon"
                          onClick={() => handleAssignedSubmit()}
                        />
                      )
                    : ""}
                </div>
              </div>
            </>
          ) : (
            <div style={{ display: "flex" }}>
              <div style={{ width: "100%", flex: "1" }}>
                <div className="inputField">
                  <p className="assignedTo">Assigned to :</p>
                  <input
                    value={assignedTo}
                    className="todoInput"
                    type="text"
                    onChange={
                      admin === currentUser.uid
                        ? (e) => handleInputChange(e.target.value)
                        : () => emptyFunction()
                    }
                    // onKeyDown={(e) => handleSubmitEnter(e)}
                  />
                  {admin === currentUser.uid
                    ? assignChange && (
                        <DoneIcon
                          className="assignIcon"
                          onClick={() => handleAssignedSubmit()}
                        />
                      )
                    : ""}
                </div>
              </div>
              <div
                style={{
                  //flex: "0.45",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginRight: "0.4rem",
                  }}
                >
                  <strong
                    className="todoDate"
                    style={{
                      color: "rgba(0, 99, 66, 0.668)",
                      paddingBottom: "0.3rem",
                    }}
                  >
                    Start
                  </strong>
                  <p
                    className="todoDate"
                    style={{
                      color: "rgba(0, 99, 66, 0.668)",
                      paddingBottom: "0.3rem",
                    }}
                  >
                    {startDate?.substring(8, 10)}
                    {"/"}
                    {startDate?.substring(5, 7)}
                    {"/"}
                    {startDate?.substring(0, 4)}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginRight: "0.4rem",
                  }}
                >
                  <strong
                    className="todoDate"
                    style={{
                      color: "rgba(0, 99, 66, 0.668)",
                      paddingBottom: "0.3rem",
                    }}
                  >
                    End
                  </strong>
                  <p
                    className="todoDate"
                    style={{
                      color: "rgba(0, 99, 66, 0.668)",
                      paddingBottom: "0.3rem",
                    }}
                  >
                    {endDate?.substring(8, 10)}
                    {"/"}
                    {endDate?.substring(5, 7)}
                    {"/"}
                    {endDate?.substring(0, 4)}
                  </p>
                </div>
                <div style={{ display: "flex" }}>
                  <Button
                    className="uploadView"
                    style={{
                      width: "98%",
                      fontSize: "0.65rem",
                      height: "1.2rem",
                      color: "#fff",
                      backgroundColor: "rgb(5, 185, 125,0.8)",
                      marginRight: "0.4rem",
                    }}
                    onClick={() => setEdit(true)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="uploadView"
                    style={{
                      width: "98%",
                      fontSize: "0.65rem",
                      height: "1.2rem",
                      color: "#fff",
                      backgroundColor: "rgb(5, 185, 125,0.8)",
                    }}
                    onClick={() => setOpenMaterial(true)}
                  >
                    Details
                  </Button>
                </div>
              </div>
            </div>
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
        {admin === currentUser.uid ? (
          <TodoActions priority={priority}>
            <DeleteIcon className="delete" onClick={() => handleDelete(id)} />
          </TodoActions>
        ) : (
          <TodoActions priority={priority}>
            <DeleteIcon style={{ opacity: 0 }} />
          </TodoActions>
        )}
        {openMaterial && (
          <Material
            open={openMaterial}
            handleClose={() => setOpenMaterial(false)}
            id={id}
            todoImage={todoImage}
            admin={admin}
            currentUser={currentUser}
            comment={comment}
            urlTeamName={urlTeamName}
            checkedBy={checkedBy}
            assignedBy={assignedBy}
            todoText={text}
            todoEndDate={endDate}
            profileImage={profileImage}
            userName={userName}
            setTabValue={setTabValue}
          />
        )}
        {edit && (
          <CalendarModal
            open={edit}
            handleClose={() => setEdit(false)}
            event={{
              title: text,
              backgroundColor:
                priority === 3
                  ? "rgba(185, 5, 5, 0.8)"
                  : priority === 2
                  ? "rgba(185, 86, 5, 0.8)"
                  : "rgba(0, 99, 66, 0.8)",
              start: new Date(startDate),
              end: new Date(endDate),
              _def: {
                publicId: id,
                extendedProps: {
                  teamName: "",
                },
              },
            }}
            team={true}
            urlTeamName={urlTeamName}
            setPersonalTabValue={emptyFunction}
            setOpenSchedular={setOpenSchedular}
          />
        )}
      </TodoMainCard>
    </Slide>
  );
}

export default TeamTodoCard;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "600px",
});

const TodoMainCard = styled.div`
  margin: 0.7rem 0rem;
  box-shadow: 0px 1px 2px rgb(0, 129, 86);
  background-color: rgb(231, 250, 243);
  border-radius: 10px;
  width: 100%;
  height: 3rem;
  min-height: 3rem;
  display: flex;
  word-break: "break-word";
  min-height: 4.5rem !important;
  height: auto;
  /* ${customMedia.lessThan("smTablet")`
    width: 98%;
    `}; */
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

  .assignedTo {
    color: rgb(0, 90, 60);
    font-size: 0.7rem;
    ${customMedia.lessThan("smTablet")`
         font-size: 0.5rem;
    `};
  }

  .assignIcon {
    color: rgb(3, 185, 124);
    font-size: 1.2rem;
    flex: 0.1;
    padding-right: 0.3rem;
    cursor: pointer;
    ${customMedia.lessThan("smTablet")`
         flex:0.2;
         font-size: 1.5rem;
    `};
  }

  .inputField {
    width: 95%;
    height: 2rem;
    background-color: rgba(3, 185, 124, 0.308);
    border-radius: 5px;
    border: none;
    padding: 0rem 0.2rem;
    padding-left: 0.5rem;
    margin: 0.2rem;
    margin-bottom: 0.2rem;
    margin-left: 0;
    display: flex;
    align-items: center;
    flex: 0.9;
    overflow: hidden;
    ${customMedia.lessThan("smTablet")`
         margin:0.1rem 0;
         height: 1.5rem;
         flex: 0.8;
    `};
  }
  input {
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    background: transparent;
    color: rgb(0, 90, 60);
    font-size: 0.7rem;
    flex: 0.95;
    padding-left: 0.5rem;

    ${customMedia.lessThan("smTablet")`
      font-size:0.7rem;
    `};
  }
  input::placeholder {
    color: rgb(3, 185, 124);
    font-size: 0.7rem;
    ${customMedia.lessThan("smTablet")`
      font-size:0.7rem;
    `};
  }

  .todoDate {
    font-size: 10px;
    text-align: center;
    ${customMedia.lessThan("smTablet")`
       font-size:7px;
        padding-left:0.1rem !important;
        flex: 0.18 !important;
    `};
  }

  .uploadView {
    overflow: hidden;
    ${customMedia.lessThan("smTablet")`
      font-size:8px !important;
      padding:0.1rem 0 !important;
      width:60% !important;
    `};
  }
`;
const TodoActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  flex: 0.03;
  width: 100%;
  height: auto;
  padding: 0.2rem 0.5rem;
  border-radius: 30px 10px 10px 30px;
  background-color: ${(props) =>
    props.priority === 3
      ? "rgba(185, 5, 5, 0.8)"
      : props.priority === 2
      ? "rgba(185, 86, 5, 0.8)"
      : "rgba(0, 99, 66, 0.8)"};
  border-left: ${(props) =>
    props.priority === 3
      ? "2px solid rgba(185, 5, 5, 0.768)"
      : props.priority === 2
      ? "2px solid rgba(185, 86, 5, 0.768)"
      : "2px solid rgba(0, 99, 66, 0.768)"};

  ${customMedia.lessThan("smTablet")`
      flex: 0.05;
      padding-right: 0.7rem;
    `};

  .delete {
    cursor: pointer;
    transform: scale(0.8);
    ${customMedia.lessThan("smTablet")`
      transform:scale(0.7);
    `};
  }
`;
