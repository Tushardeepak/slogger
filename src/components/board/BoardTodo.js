import React, { useState } from "react";
import styled from "styled-components";
import DeleteIcon from "@material-ui/icons/Delete";
import PostAddIcon from "@material-ui/icons/PostAdd";
import EditIcon from "@material-ui/icons/Edit";
import { useAuth } from "../../context/AuthContext";
import { db, storage } from "../../firebase";
import CustomTooltip from "../CustomTooltip";
import { generateMedia } from "styled-media-query";
import {
  Avatar,
  Button,
  IconButton,
  makeStyles,
  Slide,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import CalendarModal from "../Schedular/CalendarModal";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { AvatarGroup } from "@material-ui/lab";
import TeamMembers from "../todo/members/TeamMembers";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import Material from "../todo/Material";

const useStyles = makeStyles((theme) => ({
  addBtn: {
    minWidth: "1.5rem",
    padding: 0,
    height: "1.5rem",
  },
}));

function BoardTodo({
  id,
  text,
  startDate,
  endDate,
  checked,
  admin,
  urlTeamName,
  assigned,
  userName,
  transitionDirectionUpcoming,
  setTransitionDirectionUpcoming,
  priority,
  assignedById,
  state,
  setTransitionDirectionCurrent,
  setTabValue,
  profileImage,
  comment,
  checkedBy,
  assignedBy,
  checkedByProfile,
}) {
  const { currentUser } = useAuth();
  const [localCheck, setLocalCheck] = useState(checked);
  const [openMaterial, setOpenMaterial] = useState(false);
  const [assignChange, setAssignChange] = useState(false);
  const [transitionIn, setTransitionIn] = useState(true);
  const [openMembers, setOpenMembers] = useState(false);
  const [edit, setEdit] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));

  const classes = useStyles();

  const handleShift = (id) => {
    setTransitionDirectionUpcoming("left");
    setTransitionDirectionCurrent("right");
    setTransitionIn(false);
    setTimeout(() => {
      db.collection("teams")
        .doc(urlTeamName)
        .collection("teamTodos")
        .doc(id)
        .set(
          {
            state: "current",
          },
          { merge: true }
        );
    }, 200);
  };

  const handleDelete = async (id) => {
    if (checked === true) {
      setTransitionDirectionUpcoming("left");
    } else {
      setTransitionDirectionUpcoming("down");
    }
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

  const handleChecked = (id) => {
    setTransitionDirectionCurrent("left");
    setTransitionDirectionUpcoming("right");
    setTransitionIn(false);
    setTimeout(() => {
      db.collection("teams")
        .doc(urlTeamName)
        .collection("teamTodos")
        .doc(id)
        .set(
          {
            checked: true,
            checkedBy: userName,
            checkedByProfile: profileImage,
          },
          { merge: true }
        );
    }, 200);
  };

  const emptyFunction = () => {};

  return (
    <Slide
      in={transitionIn}
      timeout={400}
      direction={transitionDirectionUpcoming}
    >
      <TodoMainCard>
        <TodoTextBox>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            {assignedById === currentUser.uid && (
              <div style={{ display: "flex" }}>
                {checked === false && (
                  <Button
                    classes={{ root: classes.addBtn }}
                    className="uploadView"
                    style={{
                      fontSize: "0.65rem",
                      color: "#fff",
                      backgroundColor: "rgb(5, 185, 125,0.9)",
                      marginRight: "0.4rem",
                    }}
                    onClick={() => setEdit(true)}
                  >
                    <EditIcon style={{ transform: "scale(0.7)" }} />
                  </Button>
                )}
                <Button
                  classes={{ root: classes.addBtn }}
                  className="uploadView"
                  style={{
                    fontSize: "0.65rem",
                    color: "#fff",
                    backgroundColor: "rgb(5, 185, 125,0.9)",
                    marginRight: "0.4rem",
                    marginBottom: "0.2rem",
                  }}
                  onClick={() => handleDelete(id)}
                >
                  <DeleteIcon style={{ transform: "scale(0.7)" }} />
                </Button>
                <Button
                  classes={{ root: classes.addBtn }}
                  className="uploadView"
                  style={{
                    fontSize: "0.65rem",
                    color: "#fff",
                    backgroundColor: "rgb(5, 185, 125,0.9)",
                    marginRight: "1rem",
                    marginBottom: "0.2rem",
                  }}
                  onClick={() => setOpenMaterial(true)}
                >
                  <PostAddIcon style={{ transform: "scale(0.7)" }} />
                </Button>
              </div>
            )}
            <div style={{ flex: 1 }}></div>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "0.7rem",
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
          {state === "current" && checked === false && (
            <div style={{ width: "100%", flex: 1, marginBottom: "0.5rem" }}>
              <div className="inputField">
                <p className="assignedTo">Assigned to :</p>
                <div className="assignedMembers">
                  <AvatarGroup max={5} className="memberAvatar">
                    {assigned.map((member) => (
                      <Avatar
                        alt={member.name}
                        src={member.profileImage}
                        className="memberAvatar"
                      />
                    ))}
                  </AvatarGroup>
                </div>
                <div style={{ flex: 1 }}></div>
                {admin === currentUser.uid ? (
                  <AddCircleIcon
                    className="assignIcon"
                    onClick={() => setOpenMembers(true)}
                  />
                ) : (
                  ""
                )}
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
              margin: "0.5rem 0",
              fontFamily: "Times New Roman",
            }}
          >
            {text}
          </p>
          <div style={{ display: "flex", alignItems: "center" }}>
            {state === "current" && (
              <div
                style={{
                  borderRadius: "200%",
                  height: "0.7rem",
                  width: "0.7rem",
                  backgroundColor:
                    priority === 3
                      ? "rgba(185, 5, 5, 0.9)"
                      : priority === 2
                      ? "rgba(185, 86, 5, 0.9)"
                      : "rgba(0, 99, 66, 0.9)",
                }}
              ></div>
            )}
            <div style={{ flex: 1 }}></div>

            {state === "upcoming" && checked === false && (
              <Button
                className="uploadView"
                style={{
                  fontSize: "0.65rem",
                  height: "1.2rem",
                  color: "#fff",
                  backgroundColor: "rgb(5, 185, 125,0.9)",
                  marginBottom: "0.2rem",
                }}
                onClick={() => handleShift(id)}
              >
                shift to current{" "}
                <ArrowForwardIcon style={{ fontSize: "0.85rem" }} />
              </Button>
            )}
            {state === "current" && checked === false && (
              <Button
                className="uploadView"
                style={{
                  fontSize: "0.65rem",
                  height: "1.2rem",
                  color: "#fff",
                  backgroundColor: "rgb(5, 185, 125,0.9)",
                  marginBottom: "0.2rem",
                }}
                onClick={() => handleChecked(id)}
              >
                completed <ArrowForwardIcon style={{ fontSize: "0.85rem" }} />
              </Button>
            )}
            {checked === true && (
              <div style={{ textAlign: "end" }}>
                <p
                  style={{ fontSize: "0.5rem", color: "rgb(5, 185, 125,0.65)" }}
                >
                  -Completed by
                </p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={checkedByProfile}
                    alt={checkedBy}
                    style={{
                      height: "1.2rem",
                      width: "1.2rem",
                      marginRight: "0.5rem",
                    }}
                  />
                  <p
                    style={{
                      fontSize: "0.7rem",
                      color: "rgb(5, 185, 125,0.9)",
                    }}
                  >
                    {checkedBy}
                  </p>
                </div>
              </div>
            )}
          </div>
        </TodoTextBox>

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
            setOpenSchedular={emptyFunction}
            board={state === "upcoming" ? true : false}
          />
        )}
        {openMembers && (
          <TeamMembers
            todoId={id}
            open={openMembers}
            handleClose={() => setOpenMembers(false)}
            urlTeamName={urlTeamName}
            assigned={assigned}
          />
        )}
        {openMaterial && (
          <Material
            open={openMaterial}
            handleClose={() => setOpenMaterial(false)}
            id={id}
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
            completed={state === "upcoming" || checked ? true : false}
          />
        )}
      </TodoMainCard>
    </Slide>
  );
}

export default BoardTodo;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "1000px",
  smTablet: "600px",
});

const TodoMainCard = styled.div`
  margin: 0.7rem 0.2rem;
  box-shadow: 0px 1px 2px rgb(0, 129, 86);
  background-color: rgb(231, 250, 243);
  border-radius: 10px;
  width: 98%;
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

const TodoTextBox = styled.div`
  flex: 1;
  width: 100%;
  padding: 0.2rem 0.5rem;
  word-break: "break-word";
  height: auto;

  .assignedTo {
    color: rgb(0, 90, 60);
    font-size: 0.7rem;
    ${customMedia.lessThan("tablet")`
         display:none;
    `};
    ${customMedia.lessThan("smTablet")`
         font-size: 0.5rem;
    `};
  }

  .assignIcon {
    color: rgb(3, 185, 124);
    font-size: 1.2rem !important;
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
    ${customMedia.lessThan("tablet")`
        padding: 0rem;
    `};
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
