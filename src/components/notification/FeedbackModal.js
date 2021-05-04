import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import firebase from "firebase";
import { Fade } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade direction="" ref={ref} {...props} />;
});

export default function FeedbackModal({
  open,
  handleClose,
  feedbackToName,
  feedbackToId,
  task,
  teamName,
}) {
  const [feedbackText, setFeedbackText] = useState("");
  const { currentUser } = useAuth();

  const handleSend = () => {
    if (feedbackText !== "") {
      db.collection("users").doc(feedbackToId).collection("feedback").add({
        giverId: currentUser.uid,
        giverFeedback: feedbackText,
        task: task,
        teamName: teamName,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      handleClose();
    }
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
        Feedback to {feedbackToName}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <p
            style={{
              fontSize: "small",
              color: "rgb(182, 181, 181)",
              margin: "0.2rem 0.5rem",
            }}
          >
            {`For: ${task}`}
          </p>
          <div
            className="inputFieldModal"
            style={{ height: "7rem", paddingRight: 0 }}
          >
            <textarea
              className="inputModal"
              value={feedbackText}
              type="text"
              placeholder="Write"
              onChange={(e) => setFeedbackText(e.target.value)}
              style={{ height: "7rem", resize: "none", width: "100%" }}
            ></textarea>
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
        <Button className="addButtonModal" onClick={handleSend} color="primary">
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}
