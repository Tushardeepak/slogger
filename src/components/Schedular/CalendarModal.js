import React, { useState } from "react";
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
} from "@material-ui/core";
import "./style.css";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { ThemeProvider } from "styled-components";
import MomentUtils from "@date-io/moment";
import AlarmIcon from "@material-ui/icons/AddAlarm";
import { green } from "@material-ui/core/colors";

const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: green,
    width: "100%",
    cursor: "pointer",
  },
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

const Transition = React.forwardRef(function Transition(props, ref) {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm")) ? (
    <Slide direction="left" ref={ref} {...props} />
  ) : (
    <Fade direction="" ref={ref} {...props} />
  );
});

export default function CalendarModal({
  open,
  handleClose,
  event,
  getAllEvents,
  getChild,
}) {
  const [todoText, setTodoText] = useState(event.title);
  const [selectedStartDate, handleStartDateChange] = useState(event.start);
  const [selectedEndDate, handleEndDateChange] = useState(event.end);
  const [priority, setPriority] = useState(
    event.backgroundColor === "rgba(185, 5, 5, 0.8)"
      ? 3
      : event.backgroundColor === "rgba(185, 86, 5, 0.8)"
      ? 2
      : 1
  );
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));

  const handleSubmit = () => {
    if (
      todoText !== "" &&
      new Date(selectedStartDate).getTime() <=
        new Date(selectedEndDate).getTime()
    ) {
      db.collection("users")
        .doc(currentUser.uid)
        .collection("todos")
        .doc(event._def.publicId)
        .set(
          {
            todoText: todoText,
            todoStartDate: selectedStartDate.toISOString(),
            todoEndDate: selectedEndDate.toISOString(),
            priority: priority,
          },
          { merge: true }
        );

      // getChild(getAllEvents());
      handleClose();
    }
  };
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
        Details
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <textarea
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
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button
              className={priority === 3 ? "selectedTopPriority" : "priority"}
              onClick={() => setPriority(3)}
            >
              Top
            </Button>
            <Button
              className={priority === 2 ? "selectedEarlyPriority" : "priority"}
              onClick={() => setPriority(2)}
            >
              Early
            </Button>
            <Button
              className={priority === 1 ? "selectedPriority" : "priority"}
              onClick={() => setPriority(1)}
            >
              Easy
            </Button>
          </div>
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
          save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
