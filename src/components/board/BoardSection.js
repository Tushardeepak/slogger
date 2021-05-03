import { Button, makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import AddTeamTodo from "./AddTeamTodo";
import BoardTodo from "./BoardTodo";
import { db, storage } from "../../firebase";

const useStyles = makeStyles((theme) => ({
  addBtn: {
    minWidth: "1.3rem",
    padding: 0,
    height: "1.3rem",
  },
}));

function BoardSection({ urlTeamName, userName, setTabValue, profileImage }) {
  const classes = useStyles();
  const [openAddUpcoming, setOpenAddUpcoming] = useState(false);
  const [openAddCurrent, setOpenAddCurrent] = useState(false);
  const [
    transitionDirectionUpcoming,
    setTransitionDirectionUpcoming,
  ] = useState("down");
  const [transitionDirectionCurrent, setTransitionDirectionCurrent] = useState(
    "down"
  );
  const [teamsTodoList, setTeamsTodoList] = useState([]);

  const handleDeleteAllTask = () => {
    setTransitionDirectionUpcoming("right");
    teamsTodoList.forEach((list) => {
      if (list.checked === true) {
        setTimeout(() => {
          db.collection("teams")
            .doc(urlTeamName)
            .collection("teamTodos")
            .doc(list.id)
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
            .doc(list.id)
            .delete();
        }, 200);
      }
    });
  };

  useEffect(() => {
    db.collection("teams")
      .doc(urlTeamName)
      .collection("teamTodos")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          admin: doc.data().admin,
          todoText: doc.data().todoText,
          todoStartTime: doc.data().todoStartTime,
          todoEndTime: doc.data().todoEndTime,
          checked: doc.data().checked,
          checkedBy: doc.data().checkedBy,
          assignedTo: doc.data().assignedTo,
          assignedBy: doc.data().assignedBy,
          todoImage: doc.data().todoImage,
          comment: doc.data().comment,
          priority: doc.data().priority,
          state: doc.data().state,
          assignedById: doc.data().assignedById,
          checkedByProfile: doc.data().checkedByProfile,
        }));
        setTeamsTodoList(list);
      });
  }, [urlTeamName]);

  const emptyFunction = () => {};
  return (
    <BoardSectionContainer>
      <UpcomingContainer>
        <HeaderSection>
          <p>UPCOMING</p>
          <Button
            classes={{ root: classes.addBtn }}
            className="addButton1"
            //onClick={() => handleClickMakeTeam()}
          >
            <AddIcon
              className="addIcon"
              onClick={() => setOpenAddUpcoming(true)}
            />
          </Button>
        </HeaderSection>
        <TaskContainer>
          {teamsTodoList.length !== 0 &&
            teamsTodoList
              .filter((list) => {
                if (list.state === "upcoming" && list.checked === false) {
                  return list;
                }
              })
              .map((todo) => (
                <BoardTodo
                  key={todo.id}
                  id={todo.id}
                  text={todo.todoText}
                  startDate={todo.todoStartTime}
                  endDate={todo.todoEndTime}
                  checked={todo.checked}
                  checkedBy={todo.checkedBy}
                  admin={todo.admin}
                  urlTeamName={urlTeamName}
                  assigned={todo.assignedTo}
                  assignedBy={todo.assignedBy}
                  todoImage={todo.todoImage}
                  comment={todo.comment}
                  priority={todo.priority}
                  userName={userName}
                  assignedById={todo.assignedById}
                  state={todo.state}
                  transitionDirectionUpcoming={transitionDirectionUpcoming}
                  setTransitionDirectionUpcoming={
                    setTransitionDirectionUpcoming
                  }
                  setTransitionDirectionCurrent={setTransitionDirectionCurrent}
                  profileImage={profileImage}
                  setTabValue={setTabValue}
                  checkedByProfile={todo.checkedByProfile}
                />
              ))}
          <div style={{ height: "2rem", width: "13rem" }}></div>
        </TaskContainer>
      </UpcomingContainer>
      <CurrentContainer>
        <HeaderSection>
          <p>CURRENT</p>
          <Button
            classes={{ root: classes.addBtn }}
            className="addButton1"
            //onClick={() => handleClickMakeTeam()}
          >
            <AddIcon
              className="addIcon"
              onClick={() => setOpenAddCurrent(true)}
            />
          </Button>
        </HeaderSection>
        <TaskContainer>
          {teamsTodoList.length !== 0 &&
            teamsTodoList
              .filter((list) => {
                if (list.state === "current" && list.checked === false) {
                  return list;
                }
              })
              .map((todo) => (
                <BoardTodo
                  key={todo.id}
                  id={todo.id}
                  text={todo.todoText}
                  startDate={todo.todoStartTime}
                  endDate={todo.todoEndTime}
                  checked={todo.checked}
                  checkedBy={todo.checkedBy}
                  admin={todo.admin}
                  urlTeamName={urlTeamName}
                  assigned={todo.assignedTo}
                  assignedBy={todo.assignedBy}
                  todoImage={todo.todoImage}
                  comment={todo.comment}
                  priority={todo.priority}
                  userName={userName}
                  assignedById={todo.assignedById}
                  state={todo.state}
                  transitionDirectionUpcoming={transitionDirectionCurrent}
                  setTransitionDirectionUpcoming={
                    setTransitionDirectionUpcoming
                  }
                  setTransitionDirectionCurrent={setTransitionDirectionCurrent}
                  profileImage={profileImage}
                  setTabValue={setTabValue}
                  checkedByProfile={todo.checkedByProfile}
                />
              ))}
          <div style={{ height: "2rem", width: "13rem" }}></div>
        </TaskContainer>
      </CurrentContainer>
      <CompletedContainer>
        <HeaderSection>
          <p>COMPLETED</p>
          <Button
            classes={{ root: classes.addBtn }}
            className="addButton1"
            onClick={() => handleDeleteAllTask()}
          >
            <DeleteIcon
              className="addIcon"
              style={{ transform: "scale(0.7)" }}
            />
          </Button>
        </HeaderSection>
        <TaskContainer>
          {teamsTodoList.length !== 0 &&
            teamsTodoList
              .filter((list) => {
                if (list.checked === true) {
                  return list;
                }
              })
              .map((todo) => (
                <BoardTodo
                  key={todo.id}
                  id={todo.id}
                  text={todo.todoText}
                  startDate={todo.todoStartTime}
                  endDate={todo.todoEndTime}
                  checked={todo.checked}
                  checkedBy={todo.checkedBy}
                  admin={todo.admin}
                  urlTeamName={urlTeamName}
                  assigned={todo.assignedTo}
                  assignedBy={todo.assignedBy}
                  todoImage={todo.todoImage}
                  comment={todo.comment}
                  priority={todo.priority}
                  userName={userName}
                  assignedById={todo.assignedById}
                  state={todo.state}
                  transitionDirectionUpcoming={transitionDirectionUpcoming}
                  setTransitionDirectionUpcoming={
                    setTransitionDirectionUpcoming
                  }
                  setTransitionDirectionCurrent={setTransitionDirectionCurrent}
                  profileImage={profileImage}
                  setTabValue={setTabValue}
                  checkedByProfile={todo.checkedByProfile}
                />
              ))}
          <div style={{ height: "2rem", width: "13rem" }}></div>
        </TaskContainer>
      </CompletedContainer>
      {openAddUpcoming && (
        <AddTeamTodo
          open={openAddUpcoming}
          handleClose={() => setOpenAddUpcoming(false)}
          urlTeamName={urlTeamName}
          userName={userName}
          setTransitionDirectionUpcoming={setTransitionDirectionUpcoming}
        />
      )}
      {openAddCurrent && (
        <AddTeamTodo
          pri={true}
          open={openAddCurrent}
          handleClose={() => setOpenAddCurrent(false)}
          urlTeamName={urlTeamName}
          userName={userName}
          setTransitionDirectionUpcoming={setTransitionDirectionCurrent}
          current={true}
        />
      )}
    </BoardSectionContainer>
  );
}

export default BoardSection;

const BoardSectionContainer = styled.div`
  width: 100%;
  height: 93%;
  position: absolute;
  display: flex;
  align-items: center;
`;
const UpcomingContainer = styled.div`
  flex: 2.5;
  width: 98%;
  height: 100%;
  padding: 0 0.5rem;
  border-right: 2px solid rgba(0, 141, 94, 0.295);
  display: flex;
  flex-direction: column;
`;

const HeaderSection = styled.div`
  height: 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 2px solid rgba(0, 141, 94, 0.295);
  p {
    flex: 1;
    font-size: 0.8rem;
    text-align: center;
    color: rgb(5, 185, 125, 0.8);
  }
  .addButton1 {
    width: 10% !important;
    color: #fff;
    background-color: rgb(5, 185, 125, 0.8);
    font-size: 0.9rem;
    overflow: hidden;
  }
  .addButton1:hover {
    background-color: rgb(5, 185, 125);
  }
  .addIcon {
    transform: scale(0.8);
  }
`;

const TaskContainer = styled.div`
  width: 100%;
  height: 93%;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const CurrentContainer = styled.div`
  flex: 3;
  width: 98%;
  height: 100%;
  margin: 0 0.5rem;
  padding: 0 0.5rem;
  border-right: 2px solid rgba(0, 141, 94, 0.295);
`;
const CompletedContainer = styled.div`
  flex: 2.5;
  width: 98%;
  height: 100%;
  margin-right: 2rem;
  padding: 0 0.5rem;
`;
