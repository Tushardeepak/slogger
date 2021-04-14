import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CreateIcon from "@material-ui/icons/Create";
import {
  AppBar,
  Button,
  makeStyles,
  MenuItem,
  Select,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
  withStyles,
} from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
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
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import DonutChart from "./DonutChart";
import firebase from "firebase";
import { generateMedia } from "styled-media-query";
import { useHistory } from "react-router-dom";
import "./heightMedia.css";
import SidebarPersonal from "./sidebar/SidebarPersonal";
import Schedular from "../Schedular/Schedular";
import Slider from "@material-ui/core/Slider";

const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: {
      main: "rgb(2, 88, 60)",
    },
  },
  width: "100%",

  overrides: {
    MuiInputBase: {
      root: {
        overflow: "hidden",
      },
      input: {
        color: "rgb(0, 90, 60)",
        fontSize: "1.2rem",
        cursor: "pointer",
      },
    },
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
    padding: 0,
    minHeight: "1rem",
  },
  indicator: {
    backgroundColor: "rgb(5, 185, 125)",
    height: 3,
    borderRadius: "7px",
    width: "9rem",
  },
  label: {
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "0.6rem",
    color: "#565656",
    textTransform: "uppercase",
    paddingTop: "10px",
    borderRadius: "10px 10px 0 0",
  },
  flexContainer: {
    borderBottom: "2px solid rgba(196, 196, 196, 0.5)",
  },
}));

function PersonalTodo() {
  const [selectedStartDate, handleStartDateChange] = useState(new Date());
  const [selectedEndDate, handleEndDateChange] = useState(new Date());
  const [inputTodo, setInputTodo] = useState("");
  const [filter, setFilter] = useState("All (Day)");
  const [priorityFilter, setPriorityFilter] = useState("All (Priority)");
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [todoList, setTodoList] = useState([]);
  const [todoLength, setTodoLength] = useState(0);
  const [priority, setPriority] = useState(0);
  const history = useHistory();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));

  const { currentUser } = useAuth();

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

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
      db.collection("users")
        .doc(currentUser.uid)
        .collection("todos")
        .add({
          todoText: inputTodo,
          todoStartDate: selectedStartDate.toISOString(),
          todoEndDate: selectedEndDate.toISOString(),
          checked: false,
          priority: priority < 33 ? 1 : priority > 66 ? 3 : 2,
          teamTodoText: "",
          teamName: "",
          help: false,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      setInputTodo("");
      setLoader(false);
      setPriority(0);
      handleStartDateChange(new Date());
      handleEndDateChange(new Date());
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
      db.collection("users")
        .doc(currentUser.uid)
        .collection("todos")
        .add({
          todoText: inputTodo,
          todoStartDate: selectedStartDate.toISOString(),
          todoEndDate: selectedEndDate.toISOString(),
          checked: false,
          priority: priority < 33 ? 1 : priority > 66 ? 3 : 2,
          teamTodoText: "",
          teamName: "",
          help: false,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      setInputTodo("");
      setLoader(false);
      setPriority(0);
      handleStartDateChange(new Date());
      handleEndDateChange(new Date());
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
          todoStartDate: doc.data().todoStartDate,
          todoEndDate: doc.data().todoEndDate,
          checked: doc.data().checked,
          priority: doc.data().priority,
          teamTodoText: doc.data().teamTodoText,
          todoTeamName: doc.data().teamName,
          help: doc.data().help,
        }));
        console.log(list);
        setTodoList(list);
        handleTodoLength(list);
      });
  }, []);

  function labelText(value) {
    return priority < 33 ? "Low" : priority > 66 ? "Top" : "Med";
  }

  useEffect(() => {
    handleEndDateChange(selectedStartDate);
  }, [selectedStartDate]);

  useEffect(() => {
    if (
      new Date(selectedEndDate).getTime() <
      new Date(selectedStartDate).getTime()
    ) {
      handleEndDateChange(selectedStartDate);
    }
  }, [selectedEndDate]);

  return (
    <TodoContainer>
      {!isSmall ? (
        <SidebarPersonal />
      ) : (
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
                onKeyDown={(e) => handleSubmitEnter(e)}
              />
            </div>

            <div style={{ display: "flex" }}>
              <div className="dataContainer">
                <h3 className="timeHeading">Start date</h3>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <div className="dateBox">
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
              <div className="dataContainer" style={{ marginLeft: 0 }}>
                <h3 className="timeHeading">End date</h3>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <div className="dateBox">
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
              }}
            >
              Set priority
            </p>
            <div style={{ width: "90%" }}>
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
      )}

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

            <Tab
              className={classes.label}
              label="SCHEDULAR"
              {...a11yProps(3)}
              style={{
                backgroundColor: "rgb(2, 92, 62)",
                color: "#fff",
              }}
            />
          </Tabs>
        </AppBar>
        <div style={{ display: "flex" }}>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            disableUnderline
            style={{
              height: "2rem",
              marginTop: "0.5rem",
              marginBottom: "0.2rem",
              background: "#d1faec",
              borderRadius: 10,
              width: "13%",
              padding: "2px 10px",
              textAlign: "center",
              color: "#2ec592",
              fontSize: "0.7rem",
            }}
          >
            <MenuItem
              style={{
                color: "#2ec592",
                fontSize: "0.7rem",
              }}
              value="All (Day)"
            >
              All (Day)
            </MenuItem>
            <MenuItem
              style={{
                color: "#2ec592",
                fontSize: "0.7rem",
              }}
              value="Today"
            >
              Today
            </MenuItem>
            <MenuItem
              style={{
                color: "#2ec592",
                fontSize: "0.7rem",
              }}
              value="Missed"
            >
              Missed
            </MenuItem>
          </Select>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            disableUnderline
            style={{
              height: "2rem",
              marginTop: "0.5rem",
              marginBottom: "0.2rem",
              marginLeft: "1rem",
              background: "#d1faec",
              borderRadius: 10,
              width: "13%",
              padding: "2px 10px",
              textAlign: "center",
              color: "#2ec592",
              fontSize: "0.7rem",
            }}
          >
            <MenuItem
              style={{
                color: "#2ec592",
                fontSize: "0.7rem",
              }}
              value="All (Priority)"
            >
              All (Priority)
            </MenuItem>
            <MenuItem
              style={{
                color: "#2ec592",
                fontSize: "0.7rem",
              }}
              value="Top priority"
            >
              Top priority
            </MenuItem>
            <MenuItem
              style={{
                color: "#2ec592",
                fontSize: "0.7rem",
              }}
              value="Mid priority"
            >
              Mid priority
            </MenuItem>
            <MenuItem
              style={{
                color: "#2ec592",
                fontSize: "0.7rem",
              }}
              value="Low priority"
            >
              Low priority
            </MenuItem>
          </Select>
        </div>
        <TabPanel
          style={{
            width: "100%",
            overflowY: "scroll",
            marginBottom: "0.5rem",
          }}
          value={value}
          index={0}
        >
          {todoList.length !== 0 ? (
            todoList
              .filter((list) => {
                if (filter === "All (Day)") {
                  return list;
                }
                if (filter === "Today") {
                  if (
                    new Date(list.todoEndDate).toString().substring(0, 15) ===
                    new Date().toString().substring(0, 15)
                  ) {
                    return list;
                  }
                }
                if (filter === "Missed") {
                  if (
                    new Date().getTime() -
                      new Date(list.todoEndDate).getTime() >
                      86400000 &&
                    !list.checked
                  ) {
                    return list;
                  }
                }
              })
              .filter((list) => {
                if (priorityFilter === "All (Priority)") {
                  return list;
                }
                if (priorityFilter === "Top priority") {
                  if (list.priority === 3) {
                    return list;
                  }
                }
                if (priorityFilter === "Mid priority") {
                  if (list.priority === 2) {
                    return list;
                  }
                }
                if (priorityFilter === "Low priority") {
                  if (list.priority === 1) {
                    return list;
                  }
                }
              })
              .map((todo) => (
                <TodoCard
                  key={todo.id}
                  id={todo.id}
                  text={todo.todoText}
                  todoStartDate={todo.todoStartDate}
                  todoEndDate={todo.todoEndDate}
                  checked={todo.checked}
                  priority={todo.priority}
                  teamTodoText={todo.teamTodoText}
                  todoTeamName={todo.todoTeamName}
                  help={todo.help}
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
          style={{ width: "100%", overflowY: "scroll", marginBottom: "0.5rem" }}
        >
          {todoList
            .filter((check) => {
              if (check.checked === true) {
                return check;
              }
            })
            .filter((list) => {
              if (filter === "All (Day)") {
                return list;
              }
              if (filter === "Today") {
                if (
                  new Date(list.todoEndDate).toString().substring(0, 15) ===
                  new Date().toString().substring(0, 15)
                ) {
                  return list;
                }
              }
              if (filter === "Missed") {
                if (
                  new Date().getTime() - new Date(list.todoEndDate).getTime() >
                    86400000 &&
                  !list.checked
                ) {
                  return list;
                }
              }
            })
            .filter((list) => {
              if (priorityFilter === "All (Priority)") {
                return list;
              }
              if (priorityFilter === "Top priority") {
                if (list.priority === 3) {
                  return list;
                }
              }
              if (priorityFilter === "Mid priority") {
                if (list.priority === 2) {
                  return list;
                }
              }
              if (priorityFilter === "Low priority") {
                if (list.priority === 1) {
                  return list;
                }
              }
            })
            .map((todo) => (
              <TodoCard
                key={todo.id}
                id={todo.id}
                text={todo.todoText}
                todoStartDate={todo.todoStartDate}
                todoEndDate={todo.todoEndDate}
                checked={todo.checked}
                priority={todo.priority}
                teamTodoText={todo.teamTodoText}
                todoTeamName={todo.todoTeamName}
                help={todo.help}
              />
            ))}
        </TabPanel>
        <TabPanel
          value={value}
          index={2}
          style={{ width: "100%", overflowY: "scroll", marginBottom: "0.5rem" }}
        >
          {todoList
            .filter((check) => {
              if (check.checked === false) {
                return check;
              }
            })
            .filter((list) => {
              if (filter === "All (Day)") {
                return list;
              }
              if (filter === "Today") {
                if (
                  new Date(list.todoEndDate).toString().substring(0, 15) ===
                  new Date().toString().substring(0, 15)
                ) {
                  return list;
                }
              }
              if (filter === "Missed") {
                if (
                  new Date().getTime() - new Date(list.todoEndDate).getTime() >
                    86400000 &&
                  !list.checked
                ) {
                  return list;
                }
              }
            })
            .filter((list) => {
              if (priorityFilter === "All (Priority)") {
                return list;
              }
              if (priorityFilter === "Top priority") {
                if (list.priority === 3) {
                  return list;
                }
              }
              if (priorityFilter === "Mid priority") {
                if (list.priority === 2) {
                  return list;
                }
              }
              if (priorityFilter === "Low priority") {
                if (list.priority === 1) {
                  return list;
                }
              }
            })
            .map((todo) => (
              <TodoCard
                key={todo.id}
                id={todo.id}
                text={todo.todoText}
                todoStartDate={todo.todoStartDate}
                todoEndDate={todo.todoEndDate}
                checked={todo.checked}
                priority={todo.priority}
                teamTodoText={todo.teamTodoText}
                todoTeamName={todo.todoTeamName}
                help={todo.help}
              />
            ))}
        </TabPanel>
        <TabPanel style={{ width: "100%" }} value={value} index={3}>
          <Schedular todoList={todoList} setPersonalTabValue={setValue} />
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
  smTablet: "600px",
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
  width: 100%;
  height: 89%;
  position: absolute;
  display: flex;
  overflow: hidden;
  ${customMedia.lessThan("smTablet")`
      flex-direction:column;
      height: 85%;
      width: 97%;
  `};
`;

const TodoLeftContainer = styled.div`
  //flex: 0.31;
  height: 100%;
  width: 31%;
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
  //flex: 0.5 !important;
  width: 100%;
  border-bottom: 2px solid rgba(0, 141, 94, 0.295);
  display: flex;
  flex-direction: column;
  align-items: center;
  ${customMedia.lessThan("smTablet")`
 // flex: 0.5;
    border:none;
  `};

  .inputField {
    width: 90%;
    height: 2rem;
    background-color: rgba(3, 185, 124, 0.308);
    border-radius: 0.5rem;
    border: none;
    padding: 1rem;
    padding-left: 0.5rem;
    margin: 0.5rem;
    display: flex;
    align-items: center;
    overflow: hidden;
    ${customMedia.lessThan("smTablet")`
    margin:0;
      // width: 87%;
      // height:7rem;
      //    padding:0.5rem 1rem;
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
    font-size: 2rem !important;
    flex: 0.15;
    padding-right: 0.3rem;
    cursor: pointer;
    ${customMedia.lessThan("smTablet")`
    margin-top:-0px;
    `};
  }
  .timeHeading {
    flex: 0.5;
    font-size: 0.7rem;
    color: rgb(0, 90, 60);
    font-weight: 300;
    margin-left: 1rem;
    @media (max-height: 400px) {
      font-size: 3rem;
    }
  }
  .dataContainer {
    background-color: rgba(3, 185, 124, 0.308);
    border-radius: 0.5rem;
    width: 50%;
    margin: 0rem 0.5rem;
    padding-top: 0.5rem;
  }
  .dateBox {
    overflow: hidden;
    width: 90%;
    height: 1rem;
    border: none;
    padding: 0.5rem 0.7rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    ${customMedia.lessThan("smTablet")`
    padding: 1.2rem 0.9rem;
         margin:0.5rem 0;
    `};
  }
  .AddButton {
    width: 96%;
    color: #fff;
    background-color: rgb(5, 185, 125, 0.8);
    margin: 0.5rem;
    margin-bottom: 0;
    overflow: hidden;
    ${customMedia.lessThan("smTablet")`
     margin: 0rem;
     height:2rem;
    `};
  }
  .AddButton:hover {
    background-color: rgb(5, 185, 125);
  }
  .AddButtonDisabled {
    opacity: 0.7;
    width: 95.5%;
    color: #fff;
    background-color: rgb(5, 185, 125);
    margin: 0.5rem;
    margin-bottom: 0;
  }
`;
const TodoLeftDownBox = styled.div`
  overflow: hidden;
  // flex: 0.5 !important;
  ${customMedia.lessThan("smTablet")`
  //flex: 1;
    `};
`;

const TodoRightContainer = styled.div`
  // flex: 0.69;
  height: 100%;
  width: 69%;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  overflow-y: scroll !important;
  ${customMedia.lessThan("smTablet")`
       padding:0;
       width: 100%;
    `};
`;
