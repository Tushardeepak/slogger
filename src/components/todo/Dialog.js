import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import "./style.css";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import "./heightMedia.css";
import { Fade } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade direction="" ref={ref} {...props} />;
});

export default function AddingTeamModal({
  open,
  handleClose,
  make,
  setCurrentTeamName,
  openSnackbar,
  userName,
}) {
  const [inputTeamName, setInputTeamName] = useState("");
  const [teamList, setTeamList] = useState([]);
  const [alreadyExist, setAlreadyExist] = useState(false);
  const [doesNotExist, setDoesNotExist] = useState(false);
  const [already, setAlready] = useState(1);
  const { currentUser } = useAuth();
  const history = useHistory();

  const handleInputChange = (value) => {
    setInputTeamName(value);
    setAlreadyExist(false);
    setDoesNotExist(false);
  };

  const handleMakeSubmit = () => {
    db.collection("teams").onSnapshot((snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
      }));
      console.log(list);
      var count = 0;
      list.filter((filter) => {
        if (filter.id === inputTeamName) {
          count = count + 1;
        }
      });
      if (count !== 0) {
        setAlreadyExist(true);
      } else {
        makeSubmit();
      }
    });
  };

  const handleJoinSubmit = () => {
    db.collection("teams").onSnapshot((snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
      }));
      console.log(list);
      var count = 0;
      list.filter((filter) => {
        if (filter.id === inputTeamName) {
          count = count + 1;
        }
      });
      if (count !== 0) {
        joinSubmit();
      } else {
        setDoesNotExist(true);
      }
    });
  };

  const joinSubmit = () => {
    db.collection("users").doc(currentUser.uid).collection("joinTeams").add({
      teamName: inputTeamName,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    db.collection("teams").doc(inputTeamName).collection("members").add({
      id: currentUser.uid,
    });
    setCurrentTeamName(inputTeamName);
    history.push(`/home/${inputTeamName}`);
    handleClose();
    openSnackbar(true);
    db.collection("teams").onSnapshot((snapshot) => {
      snapshot.docs.filter(
        (doc) =>
          doc.id === inputTeamName &&
          db
            .collection("users")
            .doc(doc.data().admin)
            .collection("notifications")
            .add({
              memberJoinName: userName,
              notificationType: "teamJoin",
              memberJoinId: currentUser.uid,
              teamName: inputTeamName,
              notiDate: new Date().toISOString(),
              timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
      );
    });
  };

  const addTeamNameToUser = () => {
    db.collection("users").doc(currentUser.uid).collection("userTeams").add({
      teamName: inputTeamName,
      admin: currentUser.uid,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    db.collection("teams").doc(inputTeamName).collection("members").add({
      id: currentUser.uid,
    });
    setCurrentTeamName(inputTeamName);
    history.push(`/home/${inputTeamName}`);
    handleClose();
    openSnackbar(true);
  };

  // const makeTeamCollection = () => {
  //   db.collection("teams").doc(inputTeamName).collection("teamTodos").add({
  //     todoText: "hello",
  //   });
  //   addTeamNameToUser();
  // };

  const makeSubmit = () => {
    db.collection("teams").doc(inputTeamName).set(
      {
        admin: currentUser.uid,
        teamDeleted: false,
      },
      { merge: true }
    );
    addTeamNameToUser();

    // makeTeamCollection();
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title" className="title">
        {make ? "Make your team" : "Join a team"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {alreadyExist ? (
            <p
              style={{
                textAlign: "center",
                color: "red",
                textTransform: "uppercase",
              }}
            >
              This name already exits
            </p>
          ) : (
            ""
          )}
          {doesNotExist ? (
            <p
              style={{
                textAlign: "center",
                color: "red",
                textTransform: "uppercase",
              }}
            >
              No team found
            </p>
          ) : (
            ""
          )}
          <div className="inputFieldModal">
            <input
              className="inputModal"
              value={inputTeamName}
              type="text"
              placeholder={make ? "Give team name..." : "Write team name..."}
              onChange={(e) => handleInputChange(e.target.value)}
            ></input>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          className="addButtonModal"
          onClick={handleClose}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          className="addButtonModal"
          onClick={make ? () => handleMakeSubmit() : () => handleJoinSubmit()}
          color="primary"
        >
          {make ? "Make" : "join"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
