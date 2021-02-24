import React, { useState } from "react";
import styled from "styled-components";
import CreateIcon from "@material-ui/icons/Create";
import {
  AppBar,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Tab,
  Tabs,
} from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import AddIcon from "@material-ui/icons/Add";
import MomentUtils from "@date-io/moment";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import green from "@material-ui/core/colors/green";
import AlarmIcon from "@material-ui/icons/AddAlarm";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import TodoCard from "./TodoCard";
import noTodoImg from "../../assets/images/noTodo.svg";
import TeamTodo from "./TeamTodo";
import News from "./SlogPage";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import HashLoader from "react-spinners";
import DonutChart from "./DonutChart";
import firebase from "firebase";
import { generateMedia } from "styled-media-query";
import { useHistory } from "react-router-dom";
import "./heightMedia.css";

const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: green,
    width: "100%",
    cursor: "pointer",
  },
});

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
}));

function PersonalTodo() {
  const [selectedDate, handleDateChange] = useState(new Date());
  const [inputTodo, setInputTodo] = useState("");
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [todoLength, setTodoLength] = useState(0);
  const history = useHistory();

  const { currentUser } = useAuth();

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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

  const handleSubmitEnter = async (event) => {
    if (
      (inputTodo !== "" && event.code === "Enter") ||
      event.code === "NumpadEnter"
    ) {
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
        setTodoList(list);
        handleTodoLength(list);
      });
  }, []);

  return (
    <TodoContainer>
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
              onKeyDown={(e) => handleSubmitEnter(e)}
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

      <TodoRightContainer>
        <AppBar className={classes.AppBar} position="static">
          <Tabs
            classes={{
              indicator: classes.indicator,
              flexContainer: classes.flexContainer,
            }}
            variant="fullWidth"
            scrollButtons="auto"
            className={classes.Tabs}
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            style={{ position: "relative" }}
          >
            <Tab className={classes.label} label="ALL" {...a11yProps(0)} />
            <Tab
              className={classes.label}
              label="CHECKED"
              {...a11yProps(1)}
              disabled={todoList.length === 0 ? true : false}
            />
            <Tab
              className={classes.label}
              label="UNCHECKED"
              {...a11yProps(2)}
              disabled={todoList.length === 0 ? true : false}
            />
          </Tabs>
        </AppBar>
        <TabPanel
          style={{ width: "100%", overflowY: "scroll", marginBottom: "1.5rem" }}
          value={value}
          index={0}
        >
          {todoList.length !== 0 ? (
            todoList.map((todo) => (
              <TodoCard
                id={todo.id}
                text={todo.todoText}
                date={todo.todoDate}
                checked={todo.checked}
              />
            ))
          ) : (
            <NoTodo>
              <img src={noTodoImg} className="noTodo"></img>
              <h3
                style={{
                  fontWeight: 600,
                  padding: "1rem",
                  color: "rgba(0, 141, 94, 0.695)",
                }}
              >
                NO ITEMS
              </h3>
              <h5
                style={{
                  fontWeight: 600,
                  color: "rgba(0, 141, 94, 0.695)",
                  cursor: "pointer",
                }}
                onClick={() => history.push("/help")}
              >
                Need Help?
              </h5>
            </NoTodo>
          )}
        </TabPanel>
        <TabPanel
          value={value}
          index={1}
          style={{ width: "100%", overflowY: "scroll", marginBottom: "1.5rem" }}
        >
          {todoList
            .filter((check) => {
              if (check.checked === true) {
                return check;
              }
            })
            .map((todo) => (
              <TodoCard
                id={todo.id}
                text={todo.todoText}
                date={todo.todoDate}
                checked={todo.checked}
              />
            ))}
        </TabPanel>
        <TabPanel
          value={value}
          index={2}
          style={{ width: "100%", overflowY: "scroll", marginBottom: "1.5rem" }}
        >
          {todoList
            .filter((check) => {
              if (check.checked === false) {
                return check;
              }
            })
            .map((todo) => (
              <TodoCard
                id={todo.id}
                text={todo.todoText}
                date={todo.todoDate}
                checked={todo.checked}
              />
            ))}
        </TabPanel>
      </TodoRightContainer>
    </TodoContainer>
  );
}

export default PersonalTodo;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "740px",
});

const NoTodo = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
  .noTodo {
    object-fit: contain;
    height: 40%;
    width: 50%;
  }
`;

const TodoContainer = styled.div`
  width: 98.5%;
  height: 87%;
  position: absolute;
  display: flex;
  overflow: hidden;

  ${customMedia.lessThan("smTablet")`
      flex-direction:column;
    `};
`;

const TodoLeftContainer = styled.div`
  flex: 0.35;
  height: 100%;
  width: 100%;
  border-right: 2px solid rgba(0, 141, 94, 0.295);
  display: flex;
  flex-direction: column;
  padding: 0.5rem;

  ${customMedia.lessThan("smTablet")`
  flex: 0.45;
         padding: 0rem;
         margin:0;
         border:none;
    `};
`;

const TodoLeftUpBox = styled.div`
  flex: 0.5 !important;
  border-bottom: 2px solid rgba(0, 141, 94, 0.295);
  display: flex;
  flex-direction: column;

  ${customMedia.lessThan("smTablet")`
  flex: 0.5;
    border:none;
  `};

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
    font-size: 1rem;
    flex: 0.9;
    padding-left: 0.5rem;
    overflow: hidden;

    ${customMedia.lessThan("smTablet")`
      font-size:0.7rem;
    `};
  }
  input::placeholder {
    color: rgb(3, 185, 124);
    font-size: 1rem;
    @media (max-height: 700px) {
      font-size: 0.5rem;
    }
    ${customMedia.lessThan("smTablet")`
      font-size:0.7rem;
    `};
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
    ${customMedia.lessThan("smTablet")`
    margin-top:-0px;
    `};
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
    ${customMedia.lessThan("smTablet")`
    padding: 1.2rem 0.9rem;
         margin:0.5rem 0;
    `};
  }
  .AddButton {
    width: 95.5%;
    color: #fff;
    font-weight: 600;
    background-color: rgb(5, 185, 125);
    margin: 0.5rem;
    overflow: hidden;
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
    margin: 0.5rem;
  }
`;
const TodoLeftDownBox = styled.div`
  overflow: hidden;
  flex: 0.5 !important;
  ${customMedia.lessThan("smTablet")`
  flex: 0.5;
    `};
`;

const TodoRightContainer = styled.div`
  flex: 0.65;
  height: 100%;
  width: 100%;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  overflow-y: scroll !important;

  ${customMedia.lessThan("smTablet")`
  margin-top:-1rem;
       padding:0;
    `};
`;
