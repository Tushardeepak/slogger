import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useMediaQuery, useTheme, Zoom } from "@material-ui/core";
import { db } from "../../../firebase";
import selectTeam from "../../../assets/images/selectTeam.svg";
import TeamMemberCard from "./TeamMemberCard";
import { useAuth } from "../../../context/AuthContext";
import firebase from "firebase";
import emailjs from "emailjs-com";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Zoom direction="up" ref={ref} {...props} />;
});

export default function TeamMembers({
  open,
  handleClose,
  urlTeamName,
  todoId,
  assigned,
  userName,
  todo,
  endDate,
}) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const [allMemberIdList, setAllMemberIdList] = useState([]);
  const [allSelectedMemberList, setAllSelectedMemberList] = useState([]);
  const [selected, setSelected] = useState(assigned.map((mem) => mem.memberId));
  const { currentUser } = useAuth();

  const getAllMembers = () => {
    db.collection("teams")
      .doc(urlTeamName)
      .collection("members")
      .onSnapshot((snapshot) => {
        const memberIdList = snapshot.docs.map((doc) => ({
          id: doc.data().id,
        }));
        console.log(memberIdList);
        setAllMemberIdList(memberIdList);
      });
  };

  useEffect(() => {
    getAllMembers();
  }, []);

  const handleSubmit = () => {
    var _list = [];
    if (selected.length !== 0) {
      selected.forEach((selectedId) => {
        db.collection("users")
          .doc(selectedId)
          .collection("profile")
          .onSnapshot((snapshot) => {
            const profile = snapshot.docs.map((doc) => ({
              id: doc.id,
              memberId: selectedId,
              name: doc.data().name,
              profileImage: doc.data().profileImage,
              email: doc.data().email,
            }));
            _list.push(profile[0]);

            window.Email.send({
              Host: "smtp.gmail.com",
              Username: "withslogger@gmail.com",
              Password: "slogger2220",
              To: profile[0].email,
              From: "withslogger@gmail.com",
              Subject: `Task assigned - ${urlTeamName}/SLOGGER[${new Date().getTime()}]`,
              Body: `You have been assigned a task: <br /><br />${todo}<br /><br /><b>ASSIGNED BY: ${userName} (${urlTeamName})<br />DEADLINE: ${endDate?.substring(
                8,
                10
              )}
              ${"/"}
              ${endDate?.substring(5, 7)}
              ${"/"}
              ${endDate?.substring(
                0,
                4
              )} </b><br /><br /><br />Thank you,<br />Slogger`,
            }).then(console.log("Mail sent to assignees"));

            db.collection("teams")
              .doc(urlTeamName)
              .collection("teamTodos")
              .doc(todoId)
              .set(
                {
                  assignedTo: [..._list],
                },
                { merge: true }
              );
          });

        db.collection("users").doc(selectedId).collection("notifications").add({
          todoId: todoId,
          assignedByName: userName,
          notificationType: "taskAssigned",
          assignedById: currentUser.uid,
          teamName: urlTeamName,
          todo: todo,
          endDate: endDate,
          notiDate: new Date().toISOString(),
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      });
      setAllSelectedMemberList(_list);
    } else {
      db.collection("teams")
        .doc(urlTeamName)
        .collection("teamTodos")
        .doc(todoId)
        .set(
          {
            assignedTo: [],
          },
          { merge: true }
        );
    }
    handleClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        fullScreen={!isSmall}
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          id="alert-dialog-slide-title"
          className="title"
          style={{ marginTop: !isSmall && "2rem" }}
        >
          {"Select Assignees"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "450px",
                height: !isSmall ? "500px" : "200px",
                overflowY: "scroll",
              }}
            >
              {!allMemberIdList.length === 0 ? (
                <img
                  src={selectTeam}
                  style={{
                    height: "5rem",
                    width: "5rem",
                    objectFit: "contain",
                    margin: "2rem",
                  }}
                />
              ) : (
                allMemberIdList?.map((memberId) => (
                  <TeamMemberCard
                    key={memberId.id}
                    id={memberId.id}
                    setSelected={setSelected}
                    selected={selected}
                  />
                ))
              )}
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleClose()}
            className="uploadView"
            style={{
              overflow: "hidden",
              fontSize: "0.7rem",
              height: "1.5rem",
              color: "#fff",
              width: "10%",
              backgroundColor: "rgb(5, 185, 125, 0.8)",
              marginRight: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            cancel
          </Button>
          <Button
            onClick={() => handleSubmit()}
            className="uploadView"
            style={{
              overflow: "hidden",
              fontSize: "0.7rem",
              height: "1.5rem",
              color: "#fff",
              width: "10%",
              backgroundColor: "rgb(5, 185, 125, 0.8)",
              marginRight: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
