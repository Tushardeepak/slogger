import React, { useState, useEffect } from "react";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { useHistory } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import styled from "styled-components";
import { ThemeProvider } from "@material-ui/styles";
import { generateMedia } from "styled-media-query";
import TeamCard from "../TeamCard";
import AddingTeamModal from "../Dialog";
import SnackBar from "../../snackbar/SnackBar";
import { db } from "../../../firebase";
import firebase from "firebase";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import AlarmIcon from "@material-ui/icons/AddAlarm";
import AddIcon from "@material-ui/icons/Add";
import green from "@material-ui/core/colors/green";
import CreateIcon from "@material-ui/icons/Create";
import { Slider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    color: "#fff",
    background: "rgba(0, 145, 96, 0.9)",
    boxShadow: "none",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const TransitionTodo = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: green,
    width: "100%",
    cursor: "pointer",
  },
});

export default function SidebarTeams({ UrlTeamName, userName }) {
  const [make, setMake] = useState(false);
  const [openMaker, setOpenMaker] = useState(false);
  const [openMakeSnackBar, setOpenMakeSnackBar] = useState(false);
  const [openJoinSnackBar, setOpenJoinSnackBar] = useState(false);
  const [openDeleteSnackBar, setOpenDeleteSnackBar] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [currentTeamName, setCurrentTeamName] = useState("");
  const [teams, setTeams] = useState([]);
  const [joinedTeams, setJoinedTeams] = useState([]);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openAddTodo, setOpenAddTodo] = useState(false);
  const [selectedStartDate, handleStartDateChange] = useState(new Date());
  const [selectedEndDate, handleEndDateChange] = useState(new Date());
  const [priority, setPriority] = useState(0);
  const [inputTodo, setInputTodo] = useState("");
  const [loader, setLoader] = useState(false);
  const history = useHistory();
  const { currentUser, logOut } = useAuth();

  const handleSignOut = async () => {
    await logOut();
    history.push("/signUp");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickMakeTeam = () => {
    setMake(true);
    setOpenMaker(true);
  };

  const handleClickJoinTeam = () => {
    setMake(false);
    setOpenMaker(true);
  };

  const handleCloseMaker = () => {
    setOpenMaker(false);
  };

  const handleInputChange = (value) => {
    setInputTodo(value);
  };

  const handleCloseAddTodo = () => {
    setOpenAddTodo(false);
  };

  const handleSubmit = () => {
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
          priority: priority < 33 ? 1 : priority > 66 ? 3 : 2,
        });
      setInputTodo("");
      setPriority(0);
      setLoader(false);
      handleCloseAddTodo();
    }
  };

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
          transform: "scale(0.6)",
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

  return (
    <div>
      <div style={{ display: "flex", width: "98%" }}>
        <Button className="addItemsTeams" onClick={handleClickOpen}>
          <p>{UrlTeamName === undefined ? "Select Team" : UrlTeamName}</p>
        </Button>
        <Button className="addItemsTeams" onClick={() => setOpenAddTodo(true)}>
          Add task
        </Button>
      </div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Slogger
            </Typography>
            {/* <Button
              autoFocus
              color="inherit"
              onClick={() => history.push("/help")}
            >
              Help
            </Button>
            <Button autoFocus color="inherit" onClick={() => handleSignOut()}>
              Log out
            </Button> */}
          </Toolbar>
        </AppBar>
        <TeamTodoLeftContainer>
          <TeamTodoLeftLeftBox>
            <Button
              className="addButton1"
              onClick={() => handleClickMakeTeam()}
            >
              Make a team
            </Button>
            {/* <h3 style={{ overflow: "hidden" }}>My Teams</h3> */}
            <MyTeamContainer>
              {teams.map((team) => (
                <TeamCard
                  sidebarClose={handleClose}
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
            <Button
              className="addButton1"
              onClick={() => handleClickJoinTeam()}
            >
              Join a team
            </Button>
            {/* <h3 style={{ overflow: "hidden" }}>Joined Teams</h3> */}
            <MyTeamContainer>
              {joinedTeams.map((team) => (
                <TeamCard
                  sidebarClose={handleClose}
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
        {openMaker && (
          <AddingTeamModal
            open={openMaker}
            handleClose={handleCloseMaker}
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
            handleClose={() => openDeleteSnackBar(false)}
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
      </Dialog>
      <Dialog
        fullScreen
        open={openAddTodo}
        onClose={handleCloseAddTodo}
        TransitionComponent={TransitionTodo}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseAddTodo}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Slogger
            </Typography>
          </Toolbar>
        </AppBar>
        <TodoLeftContainer>
          <TodoLeftUpBox>
            <div className="inputField">
              <CreateIcon className="todoIcon" />
              <input
                value={inputTodo}
                className="todoInputPersonal"
                type="text"
                placeholder="Write here..."
                onChange={(e) => handleInputChange(e.target.value)}
              />
            </div>

            <div>
              <div className="dataContainerSide">
                <h3 className="timeHeading">Start date</h3>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <div className="dateBoxSide">
                    <ThemeProvider theme={defaultMaterialTheme}>
                      <DatePicker
                        variant="dialog"
                        //format="DD/MM/YYYY"
                        value={selectedStartDate}
                        onChange={handleStartDateChange}
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
                </MuiPickersUtilsProvider>
              </div>
              <div className="dataContainerSide">
                <h3 className="timeHeading">End date</h3>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <div className="dateBoxSide">
                    <ThemeProvider theme={defaultMaterialTheme}>
                      <DatePicker
                        variant="dialog"
                        value={selectedEndDate}
                        //  format="DD/MM/YYYY"
                        onChange={handleEndDateChange}
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
                </MuiPickersUtilsProvider>
              </div>
            </div>
            <Button
              disabled={loader}
              endIcon={<AddIcon />}
              className={loader ? "AddButtonDisabled" : "AddButton"}
              onClick={() => handleSubmit()}
            >
              ADD
            </Button>
            <p
              style={{
                color: "rgb(0, 90, 60)",
                fontSize: "0.6rem",
                marginTop: "0.5rem",
                textAlign: "center",
              }}
            >
              Set priority
            </p>
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
          </TodoLeftUpBox>
        </TodoLeftContainer>
      </Dialog>
    </div>
  );
}

const TeamTodoLeftContainer = styled.div`
  flex: 1;
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

  .addButton1 {
    width: 95.5%;
    color: #fff;
    background-color: rgb(5, 185, 125);
    margin: 0.5rem;
    margin-left: 0;
    overflow: hidden;
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

  .addButton1 {
    width: 95.5%;
    color: #fff;
    background-color: rgb(5, 185, 125);
    margin: 0.5rem;
    margin-left: 0;
    overflow: hidden;
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
const TodoLeftContainer = styled.div`
  flex: 1;
  height: 100%;
  width: 94%;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
`;

const TodoLeftUpBox = styled.div`
  flex: 1 !important;
  display: flex;
  flex-direction: column;
  @media (max-height: 400px) {
    flex: 1 !important;
    border: none;
  }

  .inputField {
    width: 90%;
    height: 2rem;
    background-color: rgba(3, 185, 124, 0.308);
    border-radius: 0.5rem;
    border: none;
    padding: 1rem;
    padding-left: 0.5rem;
    margin: 0.5rem;
    margin-bottom: 0;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  input {
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    background: transparent;
    color: rgb(0, 90, 60);
    font-size: 1rem;
    flex: 0.9;
    padding-left: 0.5rem;
    overflow: hidden;
  }
  input::placeholder {
    color: rgb(3, 185, 124);
    font-size: 1rem;
    @media (max-height: 700px) {
      font-size: 0.5rem;
    }
  }
  .todoIcon {
    color: rgb(3, 185, 124);
    font-size: 1.5rem;
    flex: 0.1;
    padding-right: 0.3rem;
    transform: rotateY(180deg) !important;
  }
  .AlarmIcon {
    color: rgb(3, 185, 124);
    font-size: 1.5rem;
    flex: 0.1;
    padding-right: 0.3rem;
    cursor: pointer;
  }
  .dateBox {
    overflow: hidden;
    width: 88%;
    height: 2rem;
    background-color: rgba(3, 185, 124, 0.308);
    border-radius: 1rem;
    border: none;
    padding: 1rem;
    margin: 0.5rem;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  .AddButton {
    width: 95.5%;
    color: #fff;
    font-weight: 600;
    background-color: rgb(5, 185, 125);
    margin: 0.5rem;
    overflow: hidden;
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
    margin: 0.5rem;
  }
`;
