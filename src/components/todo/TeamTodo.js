import { Button } from "@material-ui/core";
import React, { useState } from "react";
import styled from "styled-components";
import { db } from "../../firebase";
import AddingTeamModal from "./Dialog";
import TeamCard from "./TeamCard";
import { useAuth } from "../../context/AuthContext";
import { generateMedia } from "styled-media-query";
import AlarmIcon from "@material-ui/icons/AddAlarm";
import {
  DateTimePicker,
  MuiPickersUtilsProvider,
  DatePicker,
} from "@material-ui/pickers";
import AddIcon from "@material-ui/icons/Add";
import MomentUtils from "@date-io/moment";
import CreateIcon from "@material-ui/icons/Create";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import green from "@material-ui/core/colors/green";
import CustomTooltip from "../CustomTooltip";
import firebase from "firebase";
import TeamTodoCard from "./TeamTodoCard";
import noTeamTodoImage from "../../assets/images/noTeamTodo.svg";
import noTodoJoinTeam from "../../assets/images/noTodoJoinTeam.svg";
import deletedTeam from "../../assets/images/deletedTeam.svg";

const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: green,
    width: "100%",
    cursor: "pointer",
  },
});

function TeamTodo({ UrlTeamName }) {
  const [openMaker, setOpenMaker] = useState(false);
  const [make, setMake] = useState(false);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [inputTodo, setInputTodo] = useState("");
  const [thisIsAdmin, setThisIsAdmin] = useState(false);
  const [deleteTeam, setDeleteTeam] = useState(false);
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [teams, setTeams] = useState([]);
  const [joinedTeams, setJoinedTeams] = useState([]);
  const [teamsTodoList, setTeamsTodoList] = useState([]);
  const { currentUser } = useAuth();

  const handleInputChange = (value) => {
    setInputTodo(value);
    setError(false);
  };

  const handleClickMakeTeam = () => {
    setMake(true);
    setOpenMaker(true);
  };

  const handleClickJoinTeam = () => {
    setMake(false);
    setOpenMaker(true);
  };

  const handleClose = () => {
    setOpenMaker(false);
  };

  const handleSubmit = () => {
    if (inputTodo !== "") {
      db.collection("teams").doc(UrlTeamName).collection("teamTodos").add({
        todoText: inputTodo,
        todoTime: selectedDate.toISOString(),
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        admin: currentUser.uid,
        checked: false,
        assignedTo: "",
        todoImage: "",
      });
      setInputTodo("");
      setLoader(false);
    }
  };

  const handleSubmitEnter = async (event) => {
    if (
      (inputTodo !== "" && event.code === "Enter") ||
      event.code === "NumpadEnter"
    ) {
      db.collection("teams").doc(UrlTeamName).collection("teamTodos").add({
        todoText: inputTodo,
        todoTime: selectedDate.toISOString(),
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        admin: currentUser.uid,
        checked: false,
        assignedTo: "",
        todoImage: "",
      });
      setInputTodo("");
      setLoader(false);
    }
  };

  React.useEffect(() => {
    db.collection("teams")
      .doc(UrlTeamName)
      .collection("teamTodos")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          admin: doc.data().admin,
          todoText: doc.data().todoText,
          todoTime: doc.data().todoTime,
          checked: doc.data().checked,
          assignedTo: doc.data().assignedTo,
          todoImage: doc.data().todoImage,
        }));
        setTeamsTodoList(list);
      });
  }, [UrlTeamName]);

  React.useEffect(() => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("userTeams")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) => {
        const _teams = snapshot.docs.map((doc) => ({
          id: doc.id,
          teamName: doc.data().teamName,
          admin: doc.data().admin,
        }));
        console.log(_teams);
        setTeams(_teams);
      });
    db.collection("users")
      .doc(currentUser.uid)
      .collection("joinTeams")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) => {
        const _joinedTeams = snapshot.docs.map((doc) => ({
          id: doc.id,
          teamName: doc.data().teamName,
        }));
        console.log(_joinedTeams);
        setJoinedTeams(_joinedTeams);
      });
  }, [UrlTeamName]);

  React.useEffect(() => {
    setThisIsAdmin(false);
    db.collection("teams").onSnapshot((snapshot) => {
      const tempTeamList = snapshot.docs.map((doc) => ({
        id: doc.id,
        admin: doc.data().admin,
        teamDeleted: doc.data().teamDeleted,
      }));
      tempTeamList.filter((team) => {
        if (team.id === UrlTeamName) {
          setDeleteTeam(team.teamDeleted);
          if (team.admin === currentUser.uid) {
            setThisIsAdmin(true);
          }
        }
      });
    });
  }, [UrlTeamName]);
  return (
    <div>
      <TeamTodoContainer>
        <TeamTodoLeftContainer>
          <TeamTodoLeftLeftBox>
            <Button className="addButton" onClick={() => handleClickMakeTeam()}>
              Make a team
            </Button>
            <h3 style={{ overflow: "hidden" }}>My Teams</h3>
            <MyTeamContainer>
              {teams.map((team) => (
                <TeamCard
                  id={team.id}
                  teamName={team.teamName}
                  UrlTeamName={UrlTeamName}
                ></TeamCard>
              ))}
            </MyTeamContainer>
          </TeamTodoLeftLeftBox>
          <TeamTodoLeftRightBox>
            <Button className="addButton" onClick={() => handleClickJoinTeam()}>
              Join a team
            </Button>
            <h3 style={{ overflow: "hidden" }}>Joined Teams</h3>
            <MyTeamContainer>
              {joinedTeams.map((team) => (
                <TeamCard
                  id={team.id}
                  teamName={team.teamName}
                  UrlTeamName={UrlTeamName}
                ></TeamCard>
              ))}
            </MyTeamContainer>
          </TeamTodoLeftRightBox>
        </TeamTodoLeftContainer>
        <TeamTodoRightContainer>
          {thisIsAdmin ? (
            <TodoRightUpBox>
              <div className="inputField">
                <CreateIcon className="todoIcon" />
                <input
                  value={inputTodo}
                  className="todoInput"
                  type="text"
                  placeholder="Write here..."
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={(e) => handleSubmitEnter(e)}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  paddingLeft: "0 0rem",
                  width: "100%",
                }}
              >
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <CustomTooltip title="Enter date" placement="top" arrow>
                    <div className="dateBox">
                      <ThemeProvider theme={defaultMaterialTheme}>
                        <DatePicker
                          variant="inline"
                          value={selectedDate}
                          onChange={handleDateChange}
                          style={{
                            width: "100%",
                            textAlign: "center",
                            cursor: "pointer",
                          }}
                          InputProps={{
                            endAdornment: <AlarmIcon className="AlarmIcon" />,
                            disableUnderline: true,
                          }}
                        />
                      </ThemeProvider>
                    </div>
                  </CustomTooltip>
                </MuiPickersUtilsProvider>

                <Button
                  disabled={loader}
                  endIcon={<AddIcon />}
                  className={loader ? "AddButtonDisabled" : "AddButton"}
                  onClick={() => handleSubmit()}
                >
                  ADD
                </Button>
              </div>
            </TodoRightUpBox>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "rgb(5, 185, 125)",
                padding: "1.4rem 0rem",
                borderBottom: "2px solid rgba(0, 141, 94, 0.295)",
              }}
            >
              <h1>SLOGGER</h1>
            </div>
          )}
          {teamsTodoList.length === 0 ? (
            thisIsAdmin ? (
              <div
                style={{
                  height: "80%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  objectFit: "contain",
                }}
              >
                <img
                  src={noTeamTodoImage}
                  style={{ height: "15rem", width: "15rem" }}
                />
                <h3 style={{ color: "rgba(0, 141, 94, 0.695)" }}>
                  NO WORK TO DO
                </h3>{" "}
                <h4 style={{ color: "rgba(0, 141, 94, 0.695)" }}>ADD SOME</h4>{" "}
                <br />
                <h6
                  style={{
                    color: "rgba(0, 141, 94, 0.695)",
                    cursor: "pointer",
                  }}
                >
                  Need Help?
                </h6>{" "}
              </div>
            ) : deleteTeam ? (
              <div
                style={{
                  height: "80%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  objectFit: "contain",
                }}
              >
                <img
                  src={deletedTeam}
                  style={{ height: "15rem", width: "15rem" }}
                />
                <h4 style={{ color: "rgba(0, 141, 94, 0.695)" }}>
                  THIS TEAM WAS DELETED BY THE ADMIN
                </h4>{" "}
                <br />
                <h6
                  style={{
                    color: "rgba(0, 141, 94, 0.695)",
                    cursor: "pointer",
                  }}
                >
                  Need Help?
                </h6>{" "}
              </div>
            ) : (
              <div
                style={{
                  height: "80%",
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  objectFit: "contain",
                }}
              >
                <img
                  src={noTodoJoinTeam}
                  style={{ height: "15rem", width: "15rem" }}
                />
                <h4 style={{ color: "rgba(0, 141, 94, 0.695)" }}>
                  NO WORK TO DO, WE WILL UPDATE IF THERE WILL BE ANY
                </h4>{" "}
                <h5 style={{ color: "rgba(0, 141, 94, 0.695)" }}>
                  TILL THEN SIT BACK AND RELAX
                </h5>{" "}
                <br />
                <h6
                  style={{
                    color: "rgba(0, 141, 94, 0.695)",
                    cursor: "pointer",
                  }}
                >
                  Need Help?
                </h6>{" "}
              </div>
            )
          ) : (
            ""
          )}

          {teamsTodoList.map((todo) => (
            <TeamTodoCard
              id={todo.id}
              text={todo.todoText}
              date={todo.todoTime}
              checked={todo.checked}
              admin={todo.admin}
              urlTeamName={UrlTeamName}
              assigned={todo.assignedTo}
              todoImage={todo.todoImage}
            />
          ))}
        </TeamTodoRightContainer>
      </TeamTodoContainer>
      {openMaker && (
        <AddingTeamModal
          open={openMaker}
          handleClose={handleClose}
          make={make}
        />
      )}
    </div>
  );
}

export default TeamTodo;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "740px",
});

const TeamTodoContainer = styled.div`
  width: 98.5%;
  height: 87%;
  position: absolute;
  display: flex;
`;

const TeamTodoLeftContainer = styled.div`
  flex: 0.5;
  border-right: 2px solid rgba(0, 141, 94, 0.295);
  display: flex;
  overflow: hidden;
`;

const TeamTodoLeftLeftBox = styled.div`
  flex: 0.5;
  height: 100%;
  width: 100%;
  border-right: 2px solid rgba(0, 141, 94, 0.295);
  display: flex;
  flex-direction: column;
  padding: 0.5rem;

  .addButton {
    width: 95.5%;
    color: #fff;
    font-weight: 600;
    background-color: rgb(5, 185, 125);
    margin: 0.5rem;
  }
  h3 {
    color: rgb(5, 185, 125);
    font-weight: 600;
    text-align: center;
    width: 100%;
    text-transform: uppercase;
    margin: 0.3rem 0;
  }
`;
const MyTeamContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll !important;
`;

const TeamTodoLeftRightBox = styled.div`
  flex: 0.5;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;

  .addButton {
    width: 95.5%;
    color: #fff;
    font-weight: 600;
    background-color: rgb(5, 185, 125);
    margin: 0.5rem;
  }
  h3 {
    color: rgb(5, 185, 125);
    font-weight: 600;
    text-align: center;
    width: 100%;
    text-transform: uppercase;
    margin: 0.3rem 0;
  }
`;
const TeamTodoRightContainer = styled.div`
  flex: 0.5;
  overflow-y: scroll;
  padding: 0 1rem;
`;

const TodoRightUpBox = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid rgba(0, 141, 94, 0.295);

  ${customMedia.lessThan("smTablet")`

    border:none;
  `}

  .inputField {
    width: 100%;
    height: 1.7rem;
    background-color: rgba(3, 185, 124, 0.308);
    border-radius: 5px;
    border: none;
    padding: 0.2rem 0;
    margin: 0.5rem 0;
    margin-bottom: 0.2rem;
    display: flex;
    align-items: center;
    ${customMedia.lessThan("smTablet")`
         margin:0;
         height: 3rem;
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
    padding-left: 0rem;

    ${customMedia.lessThan("smTablet")`
      font-size:0.5rem;
    `};
  }
  input::placeholder {
    color: rgb(3, 185, 124);
    font-size: 0.7rem;
    ${customMedia.lessThan("smTablet")`
      font-size:0.5rem;
    `};
  }
  .todoIcon {
    color: rgb(3, 185, 124);
    font-size: 1.2rem;
    flex: 0.05;
    padding-right: 0.3rem;
    transform: rotateY(180deg) !important;
  }
  .AlarmIcon {
    color: rgb(3, 185, 124);
    font-size: 1.2rem;
    flex: 0.1;
    padding-right: 0.3rem;
    cursor: pointer;
    ${customMedia.lessThan("smTablet")`
    margin-top:-10px;
    `};
  }
  .dateBox {
    width: 88%;
    height: 1.5rem;
    background-color: rgba(3, 185, 124, 0.308);
    border: none;
    border-radius: 5px;
    padding: 0.4rem;
    margin: 0.2rem 0;
    margin-right: 0.2rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    ${customMedia.lessThan("smTablet")`
    padding: 0.1rem 0.5rem;
         margin:0.1rem 0;
    `};
  }
  .AddButton {
    width: 95.5%;
    color: #fff;
    font-weight: 600;
    background-color: rgb(5, 185, 125);
    margin: 0.2rem 0;

    ${customMedia.lessThan("smTablet")`
     margin: 0rem;
    `};
  }

  .AddButton:hover {
    background-color: rgb(5, 185, 125);
  }
  .AddButtonDisabled {
    opacity: 0.7;
    width: 95.5%;
    color: #fff;
    font-weight: 600;
    background-color: rgb(5, 185, 125);
    margin: 0.2rem;
  }
`;
