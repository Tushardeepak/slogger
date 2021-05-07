import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import { Badge, IconButton, useMediaQuery, useTheme } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import "./notification.css";
import ClearIcon from "@material-ui/icons/Clear";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import moment from "moment";
import FeedbackModal from "./FeedbackModal";
import { useHistory } from "react-router";
import MemberProfile from "../profile/MemberProfile";

const useStyles = makeStyles({
  list: {
    width: 350,
    "@media (max-width:600px)": {
      width: "100vw",
    },
  },
  fullList: {
    width: "auto",
  },
  drawerBackground: {
    background: "rgba(8, 121, 83, 0.542)",
    backdropFilter: "blur(3px) !important",
  },
});

export default function Notification({ setTabValue }) {
  const classes = useStyles();
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const { currentUser } = useAuth();
  const [notiList, setNotiList] = useState([]);
  const [openFeedback, setOpenFeedback] = useState(false);
  const [openMemberModal, setOpenMemberModal] = useState(false);
  const [currMemberId, setCurrMemberId] = useState("");
  const [currCompletedById, setCurrCompletedById] = useState("");
  const [currCompletedByName, setCurrCompletedByName] = useState("");
  const [currTodo, setCurrTodo] = useState("");
  const [currTeam, setCurrTeam] = useState("");
  const [readList, setReadList] = useState(0);
  const history = useHistory();

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const getNotificationList = () => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("notifications")
      .orderBy("timeStamp", "desc")
      .limit(30)
      .onSnapshot((snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          todoId: doc.data().todoId,
          assignedByName: doc.data().assignedByName,
          notificationType: doc.data().notificationType,
          assignedById: doc.data().assignedById,
          teamName: doc.data().teamName,
          date: doc.data().notiDate,
          endDate: doc.data().endDate,
          todo: doc.data().todo,
          completedByName: doc.data().completedByName,
          completedById: doc.data().completedById,
          memberJoinName: doc.data().memberJoinName,
          memberJoinId: doc.data().memberJoinId,
          read: doc.data().read,
        }));
        const read = list.filter((l) => l.read === true);
        setReadList(read);
        setNotiList(list);
      });
  };

  useEffect(() => {
    getNotificationList();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      getNotificationList();
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handlePushTeamName = (teamName, id) => {
    history.push(`/home/${teamName}`);
    setTabValue(1);
    db.collection("users")
      .doc(currentUser.uid)
      .collection("notifications")
      .doc(id)
      .set(
        {
          read: true,
        },
        { merge: true }
      );
    toggleDrawer(anchor, false);
  };

  const handleMemberOpen = (MemberId, id) => {
    setCurrMemberId(MemberId);
    setOpenMemberModal(true);
    db.collection("users")
      .doc(currentUser.uid)
      .collection("notifications")
      .doc(id)
      .set(
        {
          read: true,
        },
        { merge: true }
      );
    toggleDrawer(anchor, false);
  };

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      <List className="notificationListContainer">
        {!isSmall && (
          <p
            style={{
              padding: "1rem",
              fontSize: "small",
              color: "rgb(1, 63, 42)",
            }}
          >
            {"swipe to close"}
          </p>
        )}
        {notiList.length === 0 && (
          <div
            style={{
              height: "100vh",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgb(1, 63, 42)",
            }}
          >
            <p>No Notifications</p>
          </div>
        )}
        {notiList?.map((noti) => (
          <>
            {noti.notificationType === "taskAssigned" && (
              <div
                key={noti.id}
                className="notiContainer"
                onClick={() => handlePushTeamName(noti.teamName, noti.id)}
              >
                <div className="notiHead">
                  <p className={noti.read ? "notiRead" : "notiBadge"}>
                    Task assigned
                  </p>
                  <p className="notiDate">
                    {noti.date?.substring(8, 10)}
                    {"/"}
                    {noti.date?.substring(5, 7)}
                    {"/"}
                    {noti.date?.substring(0, 4)}
                  </p>
                </div>
                <p className="task">{noti.todo}</p>
                <div className="footerNoti">
                  <div className="footerName">
                    <p>By: {noti.assignedByName}</p>
                    <p>{noti.teamName}</p>
                  </div>
                  <div className="endDateBox">
                    <p className="taskBadge">End time</p>
                    <p className="endDate">
                      {noti.endDate?.substring(8, 10)}
                      {"/"}
                      {noti.endDate?.substring(5, 7)}
                      {"/"}
                      {noti.endDate?.substring(0, 4)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {noti.notificationType === "taskCompleted" && (
              <div
                key={noti.id}
                className="notiContainer"
                onClick={() => handlePushTeamName(noti.teamName, noti.id)}
              >
                <div className="notiHead">
                  <p className={noti.read ? "notiRead" : "notiBadgeCompleted"}>
                    Task completed
                  </p>
                  <p className="notiDate">
                    {noti.date?.substring(8, 10)}
                    {"/"}
                    {noti.date?.substring(5, 7)}
                    {"/"}
                    {noti.date?.substring(0, 4)}
                  </p>
                </div>
                <p className="task">{noti.todo}</p>
                <div className="footerNoti">
                  <div className="footerName">
                    <p>By: {noti.completedByName}</p>
                    <p>{noti.teamName}</p>
                  </div>
                  <div className="endDateBox">
                    <Button
                      className="feedBackBtn"
                      onClick={() => {
                        setCurrCompletedById(noti.completedById);
                        setCurrCompletedByName(noti.completedByName);
                        setCurrTodo(noti.todo);
                        setCurrTeam(noti.teamName);
                        setOpenFeedback(true);
                      }}
                    >
                      Give feedback
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {noti.notificationType === "teamJoin" && (
              <div
                key={noti.id}
                className="notiContainer"
                onClick={() => handleMemberOpen(noti.memberJoinId, noti.id)}
              >
                <div className="notiHead">
                  <p className={noti.read ? "notiRead" : "notiBadgeJoin"}>
                    Team join
                  </p>
                  <p className="notiDate">
                    {noti.date?.substring(8, 10)}
                    {"/"}
                    {noti.date?.substring(5, 7)}
                    {"/"}
                    {noti.date?.substring(0, 4)}
                  </p>
                </div>
                <p className="task">
                  {noti.memberJoinName} has joined your team.
                </p>
                <div className="footerNoti">
                  <div className="footerName">
                    <p>{noti.teamName}</p>
                  </div>
                  <div className="endDateBox"></div>
                </div>
              </div>
            )}
          </>
        ))}
      </List>
      {openFeedback && (
        <FeedbackModal
          open={openFeedback}
          handleClose={() => setOpenFeedback(false)}
          feedbackToName={currCompletedByName}
          feedbackToId={currCompletedById}
          task={currTodo}
          teamName={currTeam}
        />
      )}
      {openMemberModal && (
        <MemberProfile
          open={openMemberModal}
          handleClose={() => setOpenMemberModal(false)}
          id={currMemberId}
        />
      )}
    </div>
  );
  const anchor = "right";

  return (
    <div>
      <React.Fragment key={anchor}>
        {notiList.length - readList.length >= 0 && (
          <IconButton
            style={{ height: "2rem", width: "2rem" }}
            onClick={toggleDrawer(anchor, true)}
            className="notificationIconBtn"
          >
            <Badge badgeContent={notiList.length - readList.length} showZero>
              <NotificationsIcon className="notificationBell" />
            </Badge>
          </IconButton>
        )}

        <SwipeableDrawer
          anchor={anchor}
          open={state[anchor]}
          onClose={toggleDrawer(anchor, false)}
          onOpen={toggleDrawer(anchor, true)}
          classes={{ paperAnchorRight: classes.drawerBackground }}
        >
          {list(anchor)}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
