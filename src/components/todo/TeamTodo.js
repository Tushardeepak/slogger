import { Button, useMediaQuery, useTheme, makeStyles } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import { db, storage } from "../../firebase";
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
import { useHistory } from "react-router-dom";
import "./heightMedia.css";
import SnackBar from "../snackbar/SnackBar";
import SidebarTeams from "./sidebar/SidebarTeams";
import VideoCallIcon from "@material-ui/icons/VideoCall";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={1}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "transparent",
    width: "100%",
  },
  AppBar: {
    backgroundColor: "transparent !important",
    boxShadow: "none",
    color: "#000",
    marginTop: "-1rem",
    paddingTop: "0.5rem",
  },
  Tabs: {
    display: "flex",
    justifyContent: "space-between",
  },
  indicator: {
    backgroundColor: "rgb(5, 185, 125)",
    height: 3,
    borderRadius: "7px",
    width: "10.2rem",
  },
  label: {
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "0.8rem",
    // lineHeight: "2.3rem",
    color: "#565656",
    textTransform: "uppercase",
    // padding: "1.8rem 4.2rem",
    padding: "0.3rem",
  },
  flexContainer: {
    borderBottom: "2px solid rgba(196, 196, 196, 0.5)",
  },
  addBtn: {
    minWidth: "1.5rem",
    padding: 0,
    height: "1.5rem",
  },
}));

const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: {
      main: "rgb(2, 88, 60)",
    },
  },
  width: "100%",
  cursor: "pointer",
  overrides: {
    MuiInputBase: {
      root: {
        overflow: "hidden",
      },
      input: {
        color: "rgb(0, 90, 60)",
        fontSize: "1rem",
        cursor: "pointer",
      },
    },
  },
});

function TeamTodo({
  UrlTeamName,
  setDiscussionLock,
  profileImage,
  setTabValue,
}) {
  const [openMaker, setOpenMaker] = useState(false);
  const [make, setMake] = useState(false);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [inputTodo, setInputTodo] = useState("");
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [thisIsAdmin, setThisIsAdmin] = useState(false);
  const [deleteTeam, setDeleteTeam] = useState(false);
  const [error, setError] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [firstLoader, setFirstLoader] = useState(true);
  const [teams, setTeams] = useState([]);
  const [joinedTeams, setJoinedTeams] = useState([]);
  const [teamsTodoList, setTeamsTodoList] = useState([]);
  const { currentUser } = useAuth();
  const history = useHistory();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [profileSetter, setProfileSetter] = useState(true);
  const [openMakeSnackBar, setOpenMakeSnackBar] = useState(false);
  const [openJoinSnackBar, setOpenJoinSnackBar] = useState(false);
  const [openDeleteSnackBar, setOpenDeleteSnackBar] = useState(false);
  const [currentTeamName, setCurrentTeamName] = useState("");
  //const [profileImage, setProfileImage] = useState("");
  const [profilePath, setProfilePath] = useState("");
  const [openSnack, setOpenSnack] = useState(false);

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
        comment: "",
        checkedBy: "",
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
          checkedBy: doc.data().checkedBy,
          assignedTo: doc.data().assignedTo,
          todoImage: doc.data().todoImage,
          comment: doc.data().comment,
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

  React.useEffect(() => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("profile")
      .onSnapshot((snapshot) => {
        const profile = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));

        profile.filter((p) => {
          if (p.name !== "") {
            setUserName(p.name);
            setProfileSetter(false);
            setDiscussionLock(false);
          }
        });
        setFirstLoader(false);
      });
  }, []);

  const emptyFunction = () => {};

  return firstLoader ? (
    <p>Loading...</p>
  ) : profileSetter ? (
    <div
      style={{
        width: "100%",
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "rgba(0, 141, 94, 0.595)",
      }}
    >
      To use this feature,
      <br /> Set your profile in Profile section
    </div>
  ) : (
    <div>
      <TeamTodoContainer>
        {!isSmall ? (
          <SidebarTeams UrlTeamName={UrlTeamName} />
        ) : (
          <TeamTodoLeftContainer>
            <TeamTodoLeftLeftBox>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <h3>My Teams</h3>
                <Button
                  classes={{ root: classes.addBtn }}
                  className="addButton1"
                  onClick={() => handleClickMakeTeam()}
                >
                  <AddIcon className="addIcon" />
                </Button>
              </div>

              <MyTeamContainer>
                {teams.map((team) => (
                  <TeamCard
                    sidebarClose={emptyFunction}
                    key={team.id}
                    id={team.id}
                    teamName={team.teamName}
                    UrlTeamName={UrlTeamName}
                    deleteBtn={true}
                    setOpenDeleteSnackBar={setOpenDeleteSnackBar}
                    setCurrentTeamName={setCurrentTeamName}
                  ></TeamCard>
                ))}
              </MyTeamContainer>
            </TeamTodoLeftLeftBox>
            <TeamTodoLeftRightBox>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <h3>Joined Teams</h3>
                <Button
                  classes={{ root: classes.addBtn }}
                  className="addButton1"
                  onClick={() => handleClickJoinTeam()}
                >
                  <AddIcon className="addIcon" />
                </Button>
              </div>
              <MyTeamContainer>
                {joinedTeams.map((team) => (
                  <TeamCard
                    sidebarClose={emptyFunction}
                    key={team.id}
                    id={team.id}
                    teamName={team.teamName}
                    UrlTeamName={UrlTeamName}
                    deleteBtn={true}
                    setOpenDeleteSnackBar={setOpenDeleteSnackBar}
                    setCurrentTeamName={setCurrentTeamName}
                  ></TeamCard>
                ))}
              </MyTeamContainer>
            </TeamTodoLeftRightBox>
          </TeamTodoLeftContainer>
        )}

        <TeamTodoRightContainer>
          {thisIsAdmin ? (
            <TodoRightUpBox>
              <div className="inputField">
                <CreateIcon className="todoIcon" />
                <textarea
                  value={inputTodo}
                  className="todoInput"
                  type="text"
                  placeholder="Write here..."
                  onChange={(e) => handleInputChange(e.target.value)}
                  //onKeyDown={(e) => handleSubmitEnter(e)}
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
                  {/* <CustomTooltip title="Enter deadline" placement="top" arrow> */}
                  <div className="dateBox">
                    <p>Deadline:</p>
                    <ThemeProvider theme={defaultMaterialTheme}>
                      <DatePicker
                        variant="dialog"
                        value={selectedDate}
                        onChange={handleDateChange}
                        style={{
                          width: "100%",
                          textAlign: "center",
                          cursor: "pointer",
                          fontSize: "0.7rem",
                        }}
                        InputProps={{
                          endAdornment: <AlarmIcon className="AlarmIcon" />,
                          disableUnderline: true,
                        }}
                      />
                    </ThemeProvider>
                  </div>
                  {/* </CustomTooltip> */}
                </MuiPickersUtilsProvider>

                <Button
                  disabled={loader}
                  endIcon={<AddIcon className="addIcon" />}
                  className={loader ? "AddButtonDisabled" : "AddButton"}
                  onClick={() => handleSubmit()}
                >
                  ADD
                </Button>
                <CustomTooltip title="Start meeting" placement="down">
                  <a
                    href={`https://slogmeet.web.app/${UrlTeamName}`}
                    className="meetingLink"
                  >
                    <Button disabled={loader} className="slogMeet">
                      <VideoCallIcon />
                    </Button>
                  </a>
                </CustomTooltip>
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
              <h1 style={{ fontSize: "1rem" }}>SLOGGER</h1>
              {UrlTeamName !== undefined && (
                <CustomTooltip title="Join meeting" placement="top">
                  <a
                    href={`https://slogmeet.web.app/${UrlTeamName}`}
                    className="meetingJoinLink"
                  >
                    <Button
                      disabled={loader}
                      className="slogMeet"
                      style={{ width: "10%", transform: "scale(0.7)" }}
                    >
                      <VideoCallIcon />
                    </Button>
                  </a>
                </CustomTooltip>
              )}
            </div>
          )}
          {teamsTodoList.length === 0 ? (
            thisIsAdmin ? (
              <div
                className="teamNoTodoImage"
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
                  style={{
                    height: "15rem",
                    width: "15rem",
                    overflow: "hidden",
                  }}
                />
                <h3
                  style={{
                    color: "rgba(0, 141, 94, 0.695)",
                    overflow: "hidden",
                  }}
                >
                  NO WORK TO DO
                </h3>{" "}
                <h4
                  style={{
                    color: "rgba(0, 141, 94, 0.695)",
                    overflow: "hidden",
                  }}
                >
                  ADD SOME
                </h4>{" "}
                <br />
                <h6
                  style={{
                    color: "rgba(0, 141, 94, 0.695)",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                  onClick={() => history.push("/help")}
                >
                  Need Help?
                </h6>{" "}
              </div>
            ) : deleteTeam ? (
              <div
                className="teamNoTodoImage"
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
                  style={{
                    height: "15rem",
                    width: "15rem",
                    overflow: "hidden",
                  }}
                />
                <h4
                  style={{
                    color: "rgba(0, 141, 94, 0.695)",
                    overflow: "hidden",
                    textAlign: "center",
                  }}
                >
                  THIS TEAM WAS DELETED BY THE ADMIN
                </h4>{" "}
                <br />
                <h6
                  style={{
                    color: "rgba(0, 141, 94, 0.695)",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                  onClick={() => history.push("/help")}
                >
                  Need Help?
                </h6>{" "}
              </div>
            ) : (
              <div
                className="teamNoTodoImage"
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
                  style={{
                    height: "15rem",
                    width: "15rem",
                    overflow: "hidden",
                  }}
                />
                <h4
                  style={{
                    color: "rgba(0, 141, 94, 0.695)",
                    overflow: "hidden",
                    textAlign: "center",
                  }}
                >
                  NO WORK TO DO, WE WILL UPDATE
                </h4>{" "}
                <h5
                  style={{
                    color: "rgba(0, 141, 94, 0.695)",
                    overflow: "hidden",
                    textAlign: "center",
                  }}
                >
                  TILL THEN SIT BACK AND RELAX
                </h5>{" "}
                <br />
                <h6
                  style={{
                    color: "rgba(0, 141, 94, 0.695)",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                  onClick={() => history.push("/help")}
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
              key={todo.id}
              id={todo.id}
              text={todo.todoText}
              date={todo.todoTime}
              checked={todo.checked}
              checkedBy={todo.checkedBy}
              admin={todo.admin}
              urlTeamName={UrlTeamName}
              assigned={todo.assignedTo}
              todoImage={todo.todoImage}
              comment={todo.comment}
              userName={userName}
              profileImage={profileImage}
              setTabValue={setTabValue}
            />
          ))}
        </TeamTodoRightContainer>
      </TeamTodoContainer>
      {openMaker && (
        <AddingTeamModal
          open={openMaker}
          handleClose={handleClose}
          make={make}
          setCurrentTeamName={setCurrentTeamName}
          openSnackbar={make ? setOpenMakeSnackBar : setOpenJoinSnackBar}
        />
      )}
      {openMakeSnackBar && (
        <SnackBar
          open={openMakeSnackBar}
          handleClose={() => setOpenMakeSnackBar(false)}
          text={`Team ${currentTeamName} Created`}
        />
      )}
      {openJoinSnackBar && (
        <SnackBar
          open={openJoinSnackBar}
          handleClose={() => setOpenJoinSnackBar(false)}
          text={`Welcome to team ${currentTeamName}`}
        />
      )}
      {openDeleteSnackBar && (
        <SnackBar
          open={openDeleteSnackBar}
          handleClose={() => setOpenDeleteSnackBar(false)}
          text={`Team ${currentTeamName} deleted`}
        />
      )}
      {openSnack && (
        <SnackBar
          open={openSnack}
          handleClose={() => setOpenSnack(false)}
          text={"Uploading..."}
          material={true}
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
  smTablet: "600px",
});

const TeamTodoContainer = styled.div`
  width: 100%;
  height: 89%;
  position: absolute;
  display: flex;
  ${customMedia.lessThan("smTablet")`
  flex:1;
    flex-direction:column;
    height: 85%;
    width: 97%;
`}
  .addIcon {
    transform: scale(0.7);
  }
`;

const TeamTodoLeftContainer = styled.div`
  flex: 0.45;
  border-right: 2px solid rgba(0, 141, 94, 0.295);
  display: flex;
  overflow: hidden;
  ${customMedia.lessThan("smTablet")`
      flex:0.4;
      border-bottom: 2px solid rgba(0, 141, 94, 0.295);
      margin-bottom:1rem;
  `}
`;

const TeamTodoLeftLeftBox = styled.div`
  flex: 0.5;
  height: 100%;
  width: 100%;
  border-right: 2px solid rgba(0, 141, 94, 0.295);
  display: flex;
  flex-direction: column;
  padding: 0.5rem;

  .addButton1 {
    width: 20% !important;
    color: #fff;
    background-color: rgb(5, 185, 125, 0.8);
    margin: 0.5rem;
    font-size: 0.9rem;
    overflow: hidden;
    ${customMedia.lessThan("smTablet")`
      width:97% !important;
      margin: 0.5rem 1rem;
      margin-left:0rem;
    `}
  }
  .addButton1:hover {
    background-color: rgb(5, 185, 125);
  }
  h3 {
    color: rgb(5, 185, 125, 0.8);
    text-align: end;
    font-size: 0.9rem;
    width: 100%;
    text-transform: uppercase;
    margin: 0.3rem 0;
    ${customMedia.lessThan("smTablet")`
      font-size:10px;
      margin-top:-0.4rem;
    `};
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

  .addButton1 {
    width: 20% !important;
    color: #fff;
    background-color: rgb(5, 185, 125, 0.8);
    margin: 0.5rem;
    font-size: 0.9rem;
    overflow: hidden;
    ${customMedia.lessThan("smTablet")`
      width:97% !important;
      margin: 0.5rem 1rem;
      margin-left:0rem;
    `}
  }
  .addButton1:hover {
    background-color: rgb(5, 185, 125);
  }
  h3 {
    color: rgb(5, 185, 125, 0.8);
    text-align: end;
    width: 100%;
    font-size: 0.9rem;
    text-transform: uppercase;
    margin: 0.3rem 0;
    ${customMedia.lessThan("smTablet")`
      font-size:10px;
      margin-top:-0.4rem;
    `}
  }
`;
const TeamTodoRightContainer = styled.div`
  flex: 0.55;
  overflow-y: scroll;
  padding: 0 1rem;
  ${customMedia.lessThan("smTablet")`
  flex:1;
  
  padding: 0 0.2rem;
`}
  .teamNoTodoImage {
    ${customMedia.lessThan("smTablet")`
    height:70% !important;
    flex: 1;
  `}
  }
  .meetingLink {
    width: 30%;
    margin: 0.2rem 0rem;
    margin-left: 0.2rem;
    text-decoration: none;
    ${customMedia.lessThan("smTablet")`
     width: 50% !important;
     margin:0.1rem 0rem !important;
     margin-left: 0.2rem !important;
    `};
  }
  .meetingJoinLink {
    width: 12%;
    margin: 0.2rem 0.5rem;
    text-decoration: none;
    ${customMedia.lessThan("smTablet")`
     width: 17% !important;
     
    `};
  }
  .slogMeet {
    height: 2rem !important;
    overflow: hidden;
    width: 100%;
    color: #fff;
    background-color: rgb(5, 185, 125, 0.8);
    ${customMedia.lessThan("smTablet")`
    height: 2.1rem !important;
    `};
  }

  .slogMeet:hover {
    background-color: rgb(5, 185, 125);
  }
`;

const TodoRightUpBox = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid rgba(0, 141, 94, 0.295);
  width: 100%;

  ${customMedia.lessThan("smTablet")`
    border:none;
  `}

  .inputField {
    width: 100%;
    height: 2rem;
    background-color: rgba(3, 185, 124, 0.308);
    border-radius: 5px;
    border: none;
    padding: 0.5rem 0;
    margin: 0.5rem 0;
    margin-bottom: 0rem;
    display: flex;
    align-items: center;
    overflow: hidden;
    ${customMedia.lessThan("smTablet")`
         margin:0;
         height: 2rem;
    `};
  }
  .todoInput {
    overflow: hidden;
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    background: transparent;
    color: rgb(0, 90, 60);
    font-size: 0.9rem !important;
    flex: 0.95;
    padding: 0.5rem;
    margin: 1rem 0 !important;
    resize: none;

    ${customMedia.lessThan("smTablet")`
    margin-left:0.5rem;
    font-size: 1rem !important;
    `};
  }
  .todoInput::placeholder {
    color: rgb(3, 185, 124);
    font-size: 0.7rem;
    ${customMedia.lessThan("smTablet")`
      font-size: 1rem;
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
    margin-top:0px;
    `};
  }
  .dateBox {
    width: 95%;
    height: 1.2rem;
    background-color: rgba(3, 185, 124, 0.308);
    border: none;
    border-radius: 5px;
    padding: 0.4rem;
    margin: 0.2rem 0;
    margin-right: 0.2rem;
    font-size: 0.7rem !important;
    display: flex;
    align-items: center;
    cursor: pointer !important;
    overflow: hidden;
    ${customMedia.lessThan("smTablet")`
    padding: 0.5rem 0.5rem;
         margin:0.1rem 0;
         font-size:0.7rem !important;
    `};
    P {
      margin-right: 0.7rem;
      color: rgb(0, 90, 60);
      ${customMedia.lessThan("smTablet")`
        font-size:9px;
    `};
    }
  }
  .AddButton {
    width: 90%;
    font-size: 0.7rem !important;
    height: 2rem !important;
    overflow: hidden;
    color: #fff;
    background-color: rgb(5, 185, 125, 0.8);
    margin: 0.2rem 0;

    ${customMedia.lessThan("smTablet")`
     margin: 0.1rem 0.2rem;
     margin-right:0;
      padding:0;
      height: 2.1rem !important;
    `};
  }

  .AddButton:hover {
    background-color: rgb(5, 185, 125);
  }
  .AddButtonDisabled {
    height: 2rem !important;
    overflow: hidden;
    opacity: 0.7;
    width: 95.5%;
    color: #fff;
    background-color: rgb(5, 185, 125, 0.8);
    margin: 0.2rem;
    ${customMedia.lessThan("smTablet")`
     margin: 0.1rem 0.2rem;
     margin-right:0;
      padding:0;
      height: 2.1rem !important;
    `};
  }
`;
