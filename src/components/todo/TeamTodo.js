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
import Slider from "@material-ui/core/Slider";
import ListIcon from "@material-ui/icons/List";
import DateRangeIcon from "@material-ui/icons/DateRange";
import TeamSchedular from "../Schedular/TeamSchedular";
import ClearIcon from "@material-ui/icons/Clear";
import PuffLoader from "react-spinners/PuffLoader";
import selectTeam from "../../assets/images/selectTeam.svg";

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
  const [selectedStartDate, handleStartDateChange] = useState(new Date());
  const [selectedEndDate, handleEndDateChange] = useState(new Date());
  const [inputTodo, setInputTodo] = useState("");
  const [userName, setUserName] = useState("");
  const [thisIsAdmin, setThisIsAdmin] = useState(false);
  const [deleteTeam, setDeleteTeam] = useState(false);
  const [error, setError] = useState(false);
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
  const [openSchedular, setOpenSchedular] = useState(false);
  const [currentTeamName, setCurrentTeamName] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState("down");
  const [priority, setPriority] = useState(0);
  const [priorityFilter, setPriorityFilter] = useState(4);

  const PrettoSlider = createMuiTheme({
    overrides: {
      MuiSlider: {
        root: {
          color:
            priority < 33
              ? "rgb(1, 112, 75)"
              : priority > 66
              ? "rgba(185, 5, 5)"
              : "rgba(185, 86, 5)",
          height: 8,
          transition: "all 0.5s ease-in-out",
          transform: "scale(0.7)",
        },

        thumb: {
          height: 24,
          width: 24,
          backgroundColor: "#fff",
          border: "2px solid currentColor",
          marginTop: -8,
          marginLeft: -12,
          "&:focus, &:hover, &$active": {
            boxShadow: "inherit",
          },
        },
        active: {},
        valueLabel: {
          left: "calc(-50% + 4px)",
        },
        track: {
          height: 8,
          borderRadius: 4,
        },
        rail: {
          height: 8,
          borderRadius: 4,
        },
      },
    },
  });

  function labelText(value) {
    return priority < 33 ? "Low" : priority > 66 ? "Top" : "Med";
  }

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
    setTransitionDirection("down");
    if (inputTodo !== "") {
      db.collection("teams")
        .doc(UrlTeamName)
        .collection("teamTodos")
        .add({
          todoText: inputTodo,
          todoEndTime: selectedEndDate.toISOString(),
          todoStartTime: selectedStartDate.toISOString(),
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          admin: currentUser.uid,
          checked: false,
          assignedTo: [],
          todoImage: "",
          comment: "",
          checkedBy: "",
          assignedBy: userName,
          assignedById: currentUser.uid,
          state: "current",
          priority: priority < 33 ? 1 : priority > 66 ? 3 : 2,
        });
      setInputTodo("");
      handleStartDateChange(new Date());
      handleEndDateChange(new Date());
      setPriority(0);
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
          todoStartTime: doc.data().todoStartTime,
          todoEndTime: doc.data().todoEndTime,
          checked: doc.data().checked,
          checkedBy: doc.data().checkedBy,
          assignedTo: doc.data().assignedTo,
          assignedBy: doc.data().assignedBy,
          todoImage: doc.data().todoImage,
          comment: doc.data().comment,
          priority: doc.data().priority,
          assignedById: doc.data().assignedById,
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
    setTransitionDirection("down");
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

  React.useEffect(() => {
    if (
      new Date(selectedEndDate).getTime() <
      new Date(selectedStartDate).getTime()
    ) {
      handleEndDateChange(selectedStartDate);
    }
    // if (new Date(selectedStartDate).getTime() < new Date().getTime()) {
    //   handleStartDateChange(new Date());
    // }
  }, [selectedEndDate]);

  const emptyFunction = () => {};

  return firstLoader ? (
    <div
      style={{
        width: "100%",
        height: "50vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        color: "#2ec592",
      }}
    >
      <PuffLoader loading={firstLoader} color="#2ec592" />
      <p style={{ marginTop: "1rem", marginLeft: "0.5rem", fontSize: "small" }}>
        Loading
      </p>
    </div>
  ) : profileSetter ? (
    <div
      style={{
        width: "100%",
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        color: "rgba(0, 141, 94, 0.595)",
      }}
    >
      To use this feature,
      <br /> Set your profile in Profile section
      <Button
        className="uploadView"
        style={{
          padding: "0.5rem",
          marginTop: "1rem",
          fontSize: "0.8rem",
          height: "1.2rem",
          color: "#fff",
          backgroundColor: "rgb(5, 185, 125,0.9)",
          marginBottom: "0.2rem",
          textTransform: "none",
        }}
        onClick={() => setTabValue(4)}
      >
        Go to profile
      </Button>
    </div>
  ) : (
    <div>
      <TeamTodoContainer>
        {!isSmall ? (
          <SidebarTeams UrlTeamName={UrlTeamName} userName={userName} />
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

        <TeamTodoMiniActionContainer className="toolbarForAbove1000">
          {UrlTeamName !== undefined && (
            <>
              <CustomTooltip title="Start meeting" placement="right" arrow>
                <a
                  href={`https://slogmeet.web.app/${UrlTeamName}`}
                  className="meetingLink"
                  target="_blank"
                >
                  <VideoCallIcon className="slogMeet" disabled={loader} />
                </a>
              </CustomTooltip>
              <CustomTooltip
                arrow
                title={
                  priorityFilter === 3
                    ? "High"
                    : priorityFilter === 2
                    ? "Mid"
                    : priorityFilter === 4
                    ? "Filter"
                    : "Low"
                }
                placement="right"
              >
                <div
                  style={{
                    backgroundColor:
                      priorityFilter === 3
                        ? "rgba(185, 5, 5, 0.8)"
                        : priorityFilter === 2
                        ? "rgba(185, 86, 5, 0.8)"
                        : priorityFilter === 4
                        ? "rgb(5, 185, 125, 0.8)"
                        : "rgba(0, 99, 66, 0.8)",
                  }}
                  className="meetingLink"
                  onClick={() => {
                    if (priorityFilter === 1) setPriorityFilter(2);
                    if (priorityFilter === 2) setPriorityFilter(3);
                    if (priorityFilter === 3) setPriorityFilter(4);
                    if (priorityFilter === 4) setPriorityFilter(1);
                  }}
                >
                  <ListIcon className="slogMeet" />
                </div>
              </CustomTooltip>
              <CustomTooltip title="Schedular" placement="right" arrow>
                <div
                  className="meetingLink"
                  onClick={() => setOpenSchedular(!openSchedular)}
                  style={{
                    background: openSchedular
                      ? "rgba(0, 99, 66, 0.8)"
                      : "rgb(5, 185, 125, 0.8)",
                  }}
                >
                  {openSchedular ? (
                    <ClearIcon className="slogMeet" />
                  ) : (
                    <DateRangeIcon className="slogMeet" />
                  )}
                </div>
              </CustomTooltip>
            </>
          )}
        </TeamTodoMiniActionContainer>

        {openSchedular ? (
          <TeamTodoRightContainer style={{ overflowY: "scroll" }}>
            <TeamSchedular
              todoList={teamsTodoList}
              urlTeamName={UrlTeamName}
              setOpenSchedular={setOpenSchedular}
            />
          </TeamTodoRightContainer>
        ) : (
          <TeamTodoRightContainer>
            {isSmall && UrlTeamName !== undefined && (
              <>
                <TeamTodoMiniActionContainer className="toolbarForBelow1000">
                  <CustomTooltip title="Start meeting" placement="right">
                    <a
                      href={`https://slogmeet.web.app/${UrlTeamName}`}
                      className="meetingLink"
                      target="_blank"
                    >
                      <VideoCallIcon className="slogMeet" disabled={loader} />
                    </a>
                  </CustomTooltip>
                  <CustomTooltip
                    title={
                      priorityFilter === 3
                        ? "High"
                        : priorityFilter === 2
                        ? "Mid"
                        : priorityFilter === 4
                        ? "Filter"
                        : "Low"
                    }
                    placement="top"
                  >
                    <div
                      style={{
                        backgroundColor:
                          priorityFilter === 3
                            ? "rgba(185, 5, 5, 0.8)"
                            : priorityFilter === 2
                            ? "rgba(185, 86, 5, 0.8)"
                            : priorityFilter === 4
                            ? "rgb(5, 185, 125, 0.8)"
                            : "rgba(0, 99, 66, 0.8)",
                      }}
                      className="meetingLink"
                      onClick={() => {
                        setTransitionDirection("down");
                        if (priorityFilter === 1) setPriorityFilter(2);
                        if (priorityFilter === 2) setPriorityFilter(3);
                        if (priorityFilter === 3) setPriorityFilter(4);
                        if (priorityFilter === 4) setPriorityFilter(1);
                      }}
                    >
                      <ListIcon className="slogMeet" />
                    </div>
                  </CustomTooltip>
                  <CustomTooltip title="Schedular" placement="top">
                    <div
                      className="meetingLink"
                      onClick={() => setOpenSchedular(!openSchedular)}
                      style={{
                        background: openSchedular
                          ? "rgba(0, 99, 66, 0.8)"
                          : "rgb(5, 185, 125, 0.8)",
                      }}
                    >
                      {openSchedular ? (
                        <ClearIcon className="slogMeet" />
                      ) : (
                        <DateRangeIcon className="slogMeet" />
                      )}
                    </div>
                  </CustomTooltip>
                </TeamTodoMiniActionContainer>
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
                    <div className="priorityBox">
                      <ThemeProvider theme={PrettoSlider}>
                        <Slider
                          getAriaValueText={labelText}
                          defaultValue={priority}
                          value={priority}
                          valueLabelFormat={labelText}
                          valueLabelDisplay="auto"
                          onChange={(e, data) => {
                            setPriority(data);
                          }}
                        />
                      </ThemeProvider>
                    </div>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      {/* <CustomTooltip title="Enter deadline" placement="top" arrow> */}
                      <div className="dateBox" style={{ marginRight: 0 }}>
                        <p>Start:</p>
                        <ThemeProvider theme={defaultMaterialTheme}>
                          <DatePicker
                            variant="dialog"
                            value={selectedStartDate}
                            onChange={handleStartDateChange}
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
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      {/* <CustomTooltip title="Enter deadline" placement="top" arrow> */}
                      <div className="dateBox">
                        <p>End:</p>
                        <ThemeProvider theme={defaultMaterialTheme}>
                          <DatePicker
                            variant="dialog"
                            value={selectedEndDate}
                            onChange={handleEndDateChange}
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
                  </div>
                </TodoRightUpBox>
              </>
            )}
            {UrlTeamName === undefined && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  paddingTop: "7rem",
                }}
              >
                <img
                  src={selectTeam}
                  style={{ height: "10rem", width: "10rem" }}
                />

                <p
                  className="uploadView"
                  style={{
                    marginTop: "1rem",
                    fontSize: "0.8rem",
                    color: "rgb(5, 185, 125,0.9)",
                    marginBottom: "0.2rem",
                  }}
                >
                  Select a team to view
                </p>
              </div>
            )}
            {teamsTodoList.length === 0 && UrlTeamName !== undefined ? (
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
            {teamsTodoList.length !== 0 && (
              <div className="rightDownContainer">
                {teamsTodoList
                  .filter((list) => {
                    if (priorityFilter === 4) {
                      return list;
                    }
                    if (priorityFilter === 3) {
                      if (list.priority === 3) {
                        return list;
                      }
                    }
                    if (priorityFilter === 2) {
                      if (list.priority === 2) {
                        return list;
                      }
                    }
                    if (priorityFilter === 1) {
                      if (list.priority === 1) {
                        return list;
                      }
                    }
                  })
                  .filter((list) => {
                    if (list.state !== "upcoming" && list.checked === false) {
                      return list;
                    }
                  })
                  .map((todo) => (
                    <TeamTodoCard
                      key={todo.id}
                      id={todo.id}
                      text={todo.todoText}
                      startDate={todo.todoStartTime}
                      endDate={todo.todoEndTime}
                      checked={todo.checked}
                      checkedBy={todo.checkedBy}
                      admin={todo.admin}
                      urlTeamName={UrlTeamName}
                      assigned={todo.assignedTo}
                      assignedBy={todo.assignedBy}
                      todoImage={todo.todoImage}
                      comment={todo.comment}
                      priority={todo.priority}
                      assignedById={todo.assignedById}
                      userName={userName}
                      profileImage={profileImage}
                      setTabValue={setTabValue}
                      setTransitionDirection={setTransitionDirection}
                      transitionDirection={transitionDirection}
                      setOpenSchedular={setOpenSchedular}
                    />
                  ))}
              </div>
            )}
          </TeamTodoRightContainer>
        )}
      </TeamTodoContainer>
      {openMaker && (
        <AddingTeamModal
          open={openMaker}
          handleClose={handleClose}
          make={make}
          setCurrentTeamName={setCurrentTeamName}
          openSnackbar={make ? setOpenMakeSnackBar : setOpenJoinSnackBar}
          userName={userName}
        />
      )}
      {openMakeSnackBar && (
        <SnackBar
          open={openMakeSnackBar}
          handleClose={() => setOpenMakeSnackBar(false)}
          text={`${currentTeamName} Created`}
        />
      )}
      {openJoinSnackBar && (
        <SnackBar
          open={openJoinSnackBar}
          handleClose={() => setOpenJoinSnackBar(false)}
          text={`Welcome to ${currentTeamName}`}
        />
      )}
      {openDeleteSnackBar && (
        <SnackBar
          open={openDeleteSnackBar}
          handleClose={() => setOpenDeleteSnackBar(false)}
          text={`${currentTeamName} deleted`}
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
  tablet: "1000px",
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
  flex: 0.4;
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

const TeamTodoMiniActionContainer = styled.div`
  margin: 0.5rem 0rem;
  padding: 0 0.3rem;
  /* box-shadow: rgba(3, 185, 124, 0.308) 0px 1px 4px; */
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* background-color: rgba(3, 185, 124, 0.08); */

  .meetingLink {
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(5, 185, 125, 0.8);
    border-radius: 0 200% 200% 200%;
    padding: 0.5rem;
    box-shadow: rgba(3, 185, 124, 0.308) 0px 1px 4px;
    cursor: pointer;
    ${customMedia.lessThan("smTablet")`
      margin-top: 0rem;
      padding: 0.4rem;
    `}
  }

  .slogMeet {
    height: 1.5rem !important;
    width: 1.5rem !important;
    overflow: hidden;
    width: 100%;
    color: #fff;
    ${customMedia.lessThan("smTablet")`
       height: 1.2rem !important;
    width: 1.2rem !important;
    `}
  }
`;
const TeamTodoRightContainer = styled.div`
  flex: 0.6;
  padding-right: 1rem;

  ${customMedia.lessThan("tablet")`
  margin-left: 0.5rem;
`}
  ${customMedia.lessThan("smTablet")`
  flex:1;
`}
  .rightDownContainer {
    padding: 0 0.1rem;
    width: 99%;
    height: 77% !important;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  .teamNoTodoImage {
    ${customMedia.lessThan("smTablet")`
    height:70% !important;
    flex: 1;
  `}
  }
  @media (max-width: 600px) {
    .rightDownContainer {
      height: 55% !important;
    }
  }
  @media (min-height: 800px) {
    .rightDownContainer {
      height: 79% !important;
    }
  }
`;

const TodoRightUpBox = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 2px solid rgba(0, 141, 94, 0.295);
  width: 99%;

  ${customMedia.lessThan("smTablet")`
    border:none;
  `}

  .inputField {
    width: 100%;
    height: 2.5rem;
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
  .priorityBox {
    background-color: rgba(3, 185, 124, 0.308);
    width: 60%;
    height: 2rem;
    margin: 0.2rem 0;
    border-radius: 5px;
  }
  .dateBox {
    width: 80%;
    height: 1.2rem;
    background-color: rgba(3, 185, 124, 0.308);
    border: none;
    border-radius: 5px;
    padding: 0.4rem;
    margin: 0.2rem 0.2rem;
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
    p {
      margin-right: 0.7rem;
      color: rgb(0, 90, 60);
      ${customMedia.lessThan("smTablet")`
        font-size:9px;
    `};
    }
  }
  .AddButton {
    width: 40%;
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
