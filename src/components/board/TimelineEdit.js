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

export default function TimelineEdit({
  open,
  handleClose,
  del,
  urlTeamName,
  id,
  date,
  content,
  setTransitionIn,
}) {
  const [todoText, setTodoText] = useState(content);
  const [selectedStartDate, handleStartDateChange] = useState(new Date(date));
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleSubmit = () => {
    if (todoText !== "") {
      const date = selectedStartDate.toISOString();
      let m = new Date(date).getMonth();
      let x = new Date(date).getDate();
      if (x < 10) {
        x = "0" + x;
      }
      const year = new Date(date).getFullYear();
      db.collection("teams")
        .doc(urlTeamName)
        .collection("timeline")
        .doc(id)
        .set(
          {
            cardDetailedText: todoText,
            title: monthNames[m] + " " + x + "," + " " + year,
            timeStamp: selectedStartDate.toISOString(),
          },
          { merge: true }
        );
      handleClose();
    }
  };

  const handleDelete = () => {
    db.collection("teams")
      .doc(urlTeamName)
      .collection("teamTodos")
      .doc(id)
      .delete();

    handleClose();
    setTransitionIn(false);
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
        {del ? "Are you sure?" : "Edit card"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {del ? (
            ""
          ) : (
            <>
              <textarea
                placeholder="Write..."
                className="todoTextarea"
                value={todoText}
                onChange={(e) => setTodoText(e.target.value)}
                style={{ height: "5rem" }}
              />
              <div style={{ display: isSmall && "flex" }}>
                <div className="dataContainer">
                  <h3 className="timeHeading">Date</h3>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <div className="dateBox">
                      <ThemeProvider theme={defaultMaterialTheme}>
                        <DatePicker
                          variant="dialog"
                          format="MMMM DD, YYYY"
                          value={selectedStartDate}
                          orientation="portrait"
                          onChange={handleStartDateChange}
                          style={{
                            width: "100%",
                            textAlign: "center",
                            cursor: "pointer",
                          }}
                          InputProps={{
                            endAdornment: (
                              <AlarmIcon className="alarmModalIcon" />
                            ),
                            disableUnderline: true,
                          }}
                        />
                      </ThemeProvider>
                    </div>
                  </MuiPickersUtilsProvider>
                </div>
                <div style={{ flex: 1 }}></div>
                <div style={{ display: "flex" }}>
                  {" "}
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
                </div>
              </div>
            </>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions style={{ paddingRight: "22px" }}>
        {del && (
          <>
            {" "}
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
              onClick={handleDelete}
            >
              delete
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
