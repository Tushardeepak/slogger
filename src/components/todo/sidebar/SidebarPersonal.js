import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import "./sidebar.css";
import { useAuth } from "../../../context/AuthContext";
import { useHistory } from "react-router";
import CreateIcon from "@material-ui/icons/Create";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import AlarmIcon from "@material-ui/icons/AddAlarm";
import AddIcon from "@material-ui/icons/Add";
import { db } from "../../../firebase";
import firebase from "firebase";
import DonutChart from "../DonutChart";
import green from "@material-ui/core/colors/green";
import styled from "styled-components";

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

const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: green,
    width: "100%",
    cursor: "pointer",
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export default function SidebarPersonal() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const { currentUser, logOut } = useAuth();
  const history = useHistory();
  const [selectedDate, handleDateChange] = useState(new Date());
  const [inputTodo, setInputTodo] = useState("");
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [todoLength, setTodoLength] = useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSignOut = async () => {
    await logOut();
    history.push("/signUp");
  };
  const handleInputChange = (value) => {
    setInputTodo(value);
    setError(false);
  };

  const handleSubmit = async () => {
    if (inputTodo !== "") {
      setLoader(true);
      db.collection("users").doc(currentUser.uid).collection("todos").add({
        todoText: inputTodo,
        todoDate: selectedDate.toISOString(),
        checked: false,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setInputTodo("");
      setLoader(false);
    } else {
      setError(true);
    }
  };

  const handleTodoLength = (list) => {
    const l = list.length;
    setTodoLength(l);
  };

  React.useEffect(() => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("todos")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          todoText: doc.data().todoText,
          todoDate: doc.data().todoDate,
          checked: doc.data().checked,
        }));
        console.log(list);
        handleTodoLength(list);
      });
  }, []);

  return (
    <div>
      <Button className="addItemsPersonal" onClick={handleClickOpen}>
        Add Items +
      </Button>
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
        <TodoLeftContainer>
          <TodoLeftUpBox>
            <div className="inputField inputFieldPersonal">
              <CreateIcon className="todoIcon" />
              <input
                value={inputTodo}
                className="todoInputPersonal"
                type="text"
                placeholder="Write here..."
                onChange={(e) => handleInputChange(e.target.value)}
              />
            </div>
            <MuiPickersUtilsProvider utils={MomentUtils}>
              <div className="dateBox">
                <ThemeProvider theme={defaultMaterialTheme}>
                  <DateTimePicker
                    variant="inline"
                    // label="Add time"
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
            </MuiPickersUtilsProvider>
            <Button
              disabled={loader}
              endIcon={<AddIcon />}
              className={loader ? "AddButtonDisabled" : "AddButton"}
              onClick={() => handleSubmit()}
            >
              ADD
            </Button>
          </TodoLeftUpBox>
          <TodoLeftDownBox>
            {todoLength !== 0 ? (
              <DonutChart todoLength={todoLength} />
            ) : (
              <h3
                style={{
                  fontWeight: 600,
                  padding: "1rem",
                  color: "rgba(0, 141, 94, 0.695)",
                }}
              >
                NO ITEMS
              </h3>
            )}
          </TodoLeftDownBox>
        </TodoLeftContainer>
      </Dialog>
    </div>
  );
}

const TodoLeftContainer = styled.div`
  flex: 1;
  height: 100%;
  width: 94%;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
`;

const TodoLeftUpBox = styled.div`
  flex: 0.4 !important;
  border-bottom: 2px solid rgba(0, 141, 94, 0.295);
  display: flex;
  flex-direction: column;

  .inputField {
    width: 90%;
    height: 2rem;
    background-color: rgba(3, 185, 124, 0.308);
    border-radius: 1rem;
    border: none;
    padding: 1rem;
    padding-left: 0.5rem;
    margin: 0.5rem;
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
const TodoLeftDownBox = styled.div`
  overflow: hidden;
  flex: 0.5 !important;
`;