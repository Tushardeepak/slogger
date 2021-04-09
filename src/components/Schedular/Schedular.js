import React, { useEffect, useRef, useState } from "react";
import { Calendar as FCalendar } from "@fullcalendar/core";
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./style.css";
import CalendarModal from "./CalendarModal";

function Schedular(props) {
  const calendarRef = useRef(null);
  const [event, setEvent] = useState([]);
  const [openCalendarModal, setOpenCalendarModal] = useState(false);
  const day = 60 * 60 * 24 * 1000;

  const getAllEvents = () => {
    return props.todoList?.map((todo) => {
      if (todo.priority === 3) {
        return {
          id: todo.id,
          title: todo.todoText,
          start: new Date(new Date(todo.todoStartDate).getTime() + day)
            .toISOString()
            .replace(/T.*$/, ""),
          end: new Date(new Date(todo.todoEndDate).getTime() + day * 2)
            .toISOString()
            .replace(/T.*$/, ""),
          backgroundColor: "rgba(185, 5, 5, 0.8)",
          display: "block",
          teamName: todo.todoTeamName,
        };
      }
      if (todo.priority === 2) {
        return {
          id: todo.id,
          title: todo.todoText,
          start: new Date(new Date(todo.todoStartDate).getTime() + day)
            .toISOString()
            .replace(/T.*$/, ""),
          end: new Date(new Date(todo.todoEndDate).getTime() + day * 2)
            .toISOString()
            .replace(/T.*$/, ""),
          backgroundColor: "rgba(185, 86, 5, 0.8)",
          display: "block",
          teamName: todo.todoTeamName,
        };
      }
      if (todo.priority === 1) {
        return {
          id: todo.id,
          title: todo.todoText,
          start: new Date(new Date(todo.todoStartDate).getTime() + day)
            .toISOString()
            .replace(/T.*$/, ""),
          end: new Date(new Date(todo.todoEndDate).getTime() + day * 2)
            .toISOString()
            .replace(/T.*$/, ""),
          backgroundColor: "rgba(0, 99, 66, 0.8)",
          display: "block",
          teamName: todo.todoTeamName,
        };
      }
    });
  };

  useEffect(() => {
    getChild(getAllEvents());
    console.log(getAllEvents());
  }, []);

  const getChild = (data) => {
    var calendarEl = document.getElementById("calendar");
    var calendar = new FCalendar(calendarEl, {
      aspectRatio: 1.8,
      weekends: true,
      contentWidth: "100%",
      height: "auto",
      themeSystem: "bootstrap",
      plugins: [listPlugin, dayGridPlugin, timeGridPlugin, interactionPlugin],

      headerToolbar: {
        left: "prev,next,today",
        center: "title",
        right: "listYear,dayGridMonth",
        ...props.options,
      },
      views: {
        listYear: { buttonText: "Schedule" },
        dayGridMonth: { buttonText: "Month" },
      },
      eventClick: function (info) {
        modalFunction(info.event);

        console.log(info.event);
      },

      defaultView: "listWeek",
      editable: false,
      selectable: false,
      selectMirror: false,
      dayMaxEvents: false,
      customButtons: "",
      initialEvents: data,
      navLinks: true,
      initialView: props.initialView,
    });
    console.log(calendar.getOption("aspectRatio"));
    calendar.render();
    calendarRef.current = calendar;
  };
  const modalFunction = (e) => {
    setEvent(e);
    setOpenCalendarModal(true);
  };

  return (
    <div className="schedularContainer">
      <div className="demo-app">
        <div className="demo-app-main">
          <div id="calendar"></div>
        </div>
      </div>
      {openCalendarModal && (
        <CalendarModal
          open={CalendarModal}
          handleClose={() => setOpenCalendarModal(false)}
          event={event}
          getAllEvents={getAllEvents}
          getChild={getChild}
        />
      )}
    </div>
  );
}

export default Schedular;
