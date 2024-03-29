import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import {
  createMuiTheme,
  Fade,
  useMediaQuery,
  useTheme,
  withStyles,
} from "@material-ui/core";
import "./style.css";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ThemeProvider } from "styled-components";
import MomentUtils from "@date-io/moment";
import AlarmIcon from "@material-ui/icons/AddAlarm";
import { green } from "@material-ui/core/colors";
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
    MuiDialog: {
      paperWidthSm: {
        width: "300px !important",
      },
    },
    MuiPickersDay: {
      daySelected: {
        backgroundColor: "rgb(2, 88, 60)",
        [":hover"]: {
          backgroundColor: "rgb(2, 88, 60)",
        },
      },
    },
    MuiButton: {
      textPrimary: {
        color: "rgb(2, 88, 60)",
      },
    },
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm")) ? (
    <Slide direction="left" ref={ref} {...props} />
  ) : (
    <Fade direction="" ref={ref} {...props} />
  );
});

export default function AddTeamTodo({
  open,
  handleClose,
  urlTeamName,
  userName,
  setTransitionDirectionUpcoming,
  pri,
  current,
}) {
  const [todoText, setTodoText] = useState("");
  const [selectedStartDate, handleStartDateChange] = useState(new Date());
  const [selectedEndDate, handleEndDateChange] = useState(new Date());
  const [priority, setPriority] = useState(0);
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));

  const PrettoSlider = withStyles({
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
      marginLeft: "1rem",
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
  })(Slider);

  const handleSubmit = () => {
    if (
      todoText !== "" &&
      new Date(selectedStartDate).getTime() <=
        new Date(selectedEndDate).getTime()
    ) {
      db.collection("teams")
        .doc(urlTeamName)
        .collection("teamTodos")
        .add({
          todoText: todoText,
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
          state: current ? "current" : "upcoming",
          priority: priority < 33 ? 1 : priority > 66 ? 3 : 2,
        });
      handleClose();
      setTransitionDirectionUpcoming("down");
    }
  };

  function labelText(value) {
    return priority < 33 ? "Low" : priority > 66 ? "Top" : "Med";
  }

  useEffect(() => {
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
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      fullScreen={!isSmall}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle
        id="alert-dialog-slide-title"
        className="modalTitle"
        style={{ paddingLeft: "30px" }}
      >
        Add Upcoming task
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <textarea
            placeholder="Write..."
            className="todoTextarea"
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)}
          />
          <div style={{ display: isSmall && "flex" }}>
            <div className="dataContainer">
              <h3 className="timeHeading">Start date</h3>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <div className="dateBox">
                  <ThemeProvider theme={defaultMaterialTheme}>
                    <DatePicker
                      variant="dialog"
                      // format="DD/MM/YYYY"
                      value={selectedStartDate}
                      orientation="portrait"
                      onChange={handleStartDateChange}
                      style={{
                        width: "100%",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                      InputProps={{
                        endAdornment: <AlarmIcon className="alarmModalIcon" />,
                        disableUnderline: true,
                      }}
                    />
                  </ThemeProvider>
                </div>
              </MuiPickersUtilsProvider>
            </div>
            <div className="dataContainer" style={{ marginLeft: isSmall && 0 }}>
              <h3 className="timeHeading">End date</h3>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <div className="dateBox">
                  <ThemeProvider theme={defaultMaterialTheme}>
                    <DatePicker
                      variant="dialog"
                      orientation="portrait"
                      value={selectedEndDate}
                      //  format="DD/MM/YYYY"
                      onChange={handleEndDateChange}
                      style={{
                        width: "100%",
                        textAlign: "center",
                        cursor: "pointer",
                      }}
                      InputProps={{
                        endAdornment: <AlarmIcon className="alarmModalIcon" />,
                        disableUnderline: true,
                      }}
                    />
                  </ThemeProvider>
                </div>
              </MuiPickersUtilsProvider>
            </div>
          </div>

          {pri && (
            <>
              <p
                style={{
                  color: "rgb(0, 90, 60)",
                  fontSize: "0.6rem",
                  marginTop: "0.7rem",
                  textAlign: "center",
                }}
              >
                Set priority
              </p>
              <div style={{ width: "90%" }}>
                <PrettoSlider
                  getAriaValueText={labelText}
                  defaultValue={priority}
                  value={priority}
                  valueLabelFormat={labelText}
                  valueLabelDisplay="auto"
                  onChange={(e, data) => {
                    setPriority(data);
                  }}
                />
              </div>
            </>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ paddingRight: "22px" }}>
        <Button
          className="addButtonModal"
          onClick={handleClose}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          className="addButtonModal"
          color="primary"
          onClick={handleSubmit}
        >
          add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
