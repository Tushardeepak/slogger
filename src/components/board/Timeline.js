import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { Chrono } from "react-chrono";
import "./style.css";
import MomentUtils from "@date-io/moment";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import {
  Button,
  createMuiTheme,
  Slide,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import DateRangeIcon from "@material-ui/icons/DateRange";
import { db } from "../../firebase";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import TimelineEdit from "./TimelineEdit";
import SidebarTimeline from "../todo/sidebar/SIdebarTimeline";
import { generateMedia } from "styled-media-query";

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

function Timeline({ urlTeamName }) {
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
    <TimelineContainer>
      {!isSmall ? (
        <SidebarTimeline urlTeamName={urlTeamName} />
      ) : (
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
      )}
      {isSmall && <TimelineSpace></TimelineSpace>}
      <TimelineRight>
        <Chrono
          items={sort ? items : items2}
          mode="VERTICAL_ALTERNATING"
          slideShow
          slideItemDuration={4000}
          allowDynamicUpdate={true}
        />
      </TimelineRight>
      {isSmall && <TimelineSpace></TimelineSpace>}
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
    </TimelineContainer>
  );
}

export default Timeline;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "600px",
});

const TimelineContainer = styled.div`
  width: 97.5%;
  height: 93%;
  position: absolute;
  display: flex;
  ${customMedia.lessThan("smTablet")`
      flex-direction:column;
      width: 92.5%;
  `};
`;

const TimelineLeft = styled.div`
  width: 100%;
  height: 100%;
  flex: 3;
  border-right: 2px solid rgba(0, 141, 94, 0.295);
`;

const TimelineRight = styled.div`
  width: 100%;
  height: 100%;
  flex: 6;
  position: relative;
  z-index: 100;
  ${customMedia.lessThan("smTablet")`
   flex: 0.9;
    height: 93%;
  `};
  @media (max-height: 600px) {
    height: 85% !important;
  }
`;

const TimelineSpace = styled.div`
  flex: 0.5;
`;
