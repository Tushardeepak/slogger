import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import "./sidebar.css";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import DateRangeIcon from "@material-ui/icons/DateRange";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import styled from "styled-components";
import TimelineEdit from "../../board/TimelineEdit";
import { db } from "../../../firebase";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

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

export default function SidebarTimeline({ urlTeamName }) {
  const [open, setOpen] = React.useState(false);
  const [timelineText, setTimelineText] = useState("");
  const [selectedStartDate, handleStartDateChange] = useState(new Date());
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [currId, setCurrId] = useState("");
  const [currCardDetailedText, setCurrCardDetailedText] = useState("");
  const [currTimeStamp, setCurrTimeStamp] = useState("");
  const [items, setItems] = useState([]);
  const [items2, setItems2] = useState([]);
  const [sort, setSort] = useState(true);
  const [transitionIn, setTransitionIn] = useState(true);
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
    if (timelineText !== "") {
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
        .add({
          cardDetailedText: timelineText,
          title: monthNames[m] + " " + x + "," + " " + year,
          timeStamp: selectedStartDate.toISOString(),
        });
      setTransitionIn(true);
      setTimelineText("");
      handleStartDateChange(new Date());
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (sort) {
      db.collection("teams")
        .doc(urlTeamName)
        .collection("timeline")
        .orderBy("timeStamp", "asc")
        .onSnapshot((snapshot) => {
          const list = snapshot.docs.map((doc) => ({
            cardDetailedText: doc.data().cardDetailedText,
            title: doc.data().title,
            timeStamp: doc.data().timeStamp,
            id: doc.id,
          }));
          setItems(list);
        });
    } else {
      db.collection("teams")
        .doc(urlTeamName)
        .collection("timeline")
        .orderBy("timeStamp", "desc")
        .onSnapshot((snapshot) => {
          const list = snapshot.docs.map((doc) => ({
            cardDetailedText: doc.data().cardDetailedText,
            title: doc.data().title,
            id: doc.id,
            timeStamp: doc.data().timeStamp,
          }));
          setItems2(list);
        });
    }
  }, [sort]);

  return (
    <div>
      <Button className="addItemsPersonal" onClick={handleClickOpen}>
        Add Card
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <TimelineLeft>
          <textarea
            placeholder="Write..."
            className="timelineTextarea"
            value={timelineText}
            onChange={(e) => setTimelineText(e.target.value)}
          />
          <div className="dataContainerTimeline">
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
                        <DateRangeIcon
                          className="alarmModalIcon"
                          style={{ marginBottom: "0.5rem" }}
                        />
                      ),
                      disableUnderline: true,
                    }}
                  />
                </ThemeProvider>
              </div>
            </MuiPickersUtilsProvider>
          </div>
          <div style={{ display: "flex", width: "96%", marginTop: "0.3rem" }}>
            <Button
              style={{ marginRight: "0.3rem", flex: 0.7 }}
              className="addButtonTimeline"
              color="primary"
              onClick={handleSubmit}
            >
              add
            </Button>
            <Button
              style={{ flex: 0.3 }}
              className="addButtonTimeline"
              color="primary"
              onClick={() => setSort(!sort)}
            >
              {sort ? "Reverse" : "undo"}
            </Button>
          </div>
          <div className="editTimelineContainer">
            {sort
              ? items?.map((item) => (
                  <Slide
                    in={transitionIn}
                    timeout={400}
                    key={item.id}
                    direction="down"
                  >
                    <div key={item.id} className="timelineContentBox">
                      <p className="timelineText">{item.title}</p>
                      <EditIcon
                        className="timelineEditIcons"
                        onClick={() => {
                          setCurrId(item.id);
                          setCurrTimeStamp(item.timeStamp);
                          setCurrCardDetailedText(item.cardDetailedText);
                          setOpenEdit(true);
                        }}
                      />
                      <DeleteIcon
                        className="timelineEditIcons"
                        onClick={() => {
                          setCurrId(item.id);
                          setCurrTimeStamp(item.timeStamp);
                          setCurrCardDetailedText(item.cardDetailedText);
                          setOpenDelete(true);
                        }}
                      />
                    </div>
                  </Slide>
                ))
              : items2?.map((item) => (
                  <Slide
                    in={transitionIn}
                    timeout={400}
                    key={item.id}
                    direction="down"
                  >
                    <div className="timelineContentBox">
                      <p className="timelineText">{item.title}</p>
                      <EditIcon
                        className="timelineEditIcons"
                        onClick={() => {
                          setCurrId(item.id);
                          setCurrTimeStamp(item.timeStamp);
                          setCurrCardDetailedText(item.cardDetailedText);
                          setOpenEdit(true);
                        }}
                      />
                      <DeleteIcon
                        className="timelineEditIcons"
                        onClick={() => {
                          setCurrId(item.id);
                          setCurrTimeStamp(item.timeStamp);
                          setCurrCardDetailedText(item.cardDetailedText);
                          setOpenDelete(true);
                        }}
                      />
                    </div>
                  </Slide>
                ))}
          </div>
        </TimelineLeft>
        {openEdit && (
          <TimelineEdit
            open={openEdit}
            handleClose={() => setOpenEdit(false)}
            del={false}
            urlTeamName={urlTeamName}
            id={currId}
            date={currTimeStamp}
            content={currCardDetailedText}
            setTransitionIn={setTransitionIn}
          />
        )}
        {openDelete && (
          <TimelineEdit
            open={openDelete}
            handleClose={() => setOpenDelete(false)}
            del={true}
            urlTeamName={urlTeamName}
            id={currId}
            date={currTimeStamp}
            content={currCardDetailedText}
            setTransitionIn={setTransitionIn}
          />
        )}
      </Dialog>
    </div>
  );
}

const TimelineLeft = styled.div`
  width: 95.5%;
  height: 100%;
  flex: 1;
  border-right: 2px solid rgba(0, 141, 94, 0.295);
  padding: 1rem;
  @media (max-height: 400px) {
  }
`;
