import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import "./style.css";
import "./heightMedia.css";
import { db, storage } from "../../firebase";
import SnackBar from "../snackbar/SnackBar";
import { Fade, useMediaQuery, useTheme } from "@material-ui/core";
import firebase from "firebase";
import DoneIcon from "@material-ui/icons/Done";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

const Transition = React.forwardRef(function Transition(props, ref) {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("sm")) ? (
    <Slide direction="left" ref={ref} {...props} />
  ) : (
    <Fade direction="" ref={ref} {...props} />
  );
});

export default function Material({
  open,
  handleClose,
  id,
  todoImage,
  admin,
  currentUser,
  comment,
  urlTeamName,
  checkedBy,
  todoText,
  todoEndDate,
  userName,
  profileImage,
  setTabValue,
}) {
  const [editComment, setEditComment] = useState(comment);
  const [done, setDone] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [added, setAdded] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [openSmallTextBox, setOpenSmallTextBox] = useState(false);
  const [personal, setPersonal] = useState(false);
  const [discussion, setDiscussion] = useState(false);
  const [helperText, setHelperText] = useState("");
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));

  const setText = (e) => {
    setEditComment(e.target.value);
    setDone(true);
  };

  const handleSet = () => {
    setDone(true);
    db.collection("teams").doc(urlTeamName).collection("teamTodos").doc(id).set(
      {
        comment: editComment,
      },
      { merge: true }
    );
    setEditComment("");
  };

  const onSelectFile = async (event) => {
    setOpenSnack(true);
    try {
      const image = event.target.files[0];
      const uploadTask = await storage
        .ref(`todoImages/${image.name}`)
        .put(image);
      storage
        .ref("todoImages")
        .child(image.name)
        .getDownloadURL()
        .then((url) => {
          console.log(url);
          db.collection("teams")
            .doc(urlTeamName)
            .collection("teamTodos")
            .doc(id)
            .set(
              {
                todoImage: url,
              },
              { merge: true }
            );
        });
    } catch (error) {
      console.log(error);
    }

    setOpenSnack(false);
  };

  const addToPersonal = () => {
    console.log(todoText);
    db.collection("users").doc(currentUser.uid).collection("todos").add({
      todoText: helperText,
      teamTodoText: todoText,
      teamName: urlTeamName,
      todoStartDate: new Date().toISOString(),
      todoEndDate: todoEndDate,
      checked: false,
      priority: 3,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      help: true,
    });
    setAdded(true);
    setTabValue(0);
  };

  const sentToDiscussion = () => {
    db.collection("teams").doc(urlTeamName).collection("discussion").add({
      discussionText: helperText,
      teamTodoText: todoText,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      senderId: currentUser.uid,
      senderProfileImage: profileImage,
      senderName: userName,
      discussionTime: new Date().toISOString(),
      help: true,
    });
    setSent(true);
    setTabValue(2);
  };

  const handleAddTo = () => {
    if (helperText.length !== 0 && helperText !== "" && helperText !== " ") {
      if (personal) {
        addToPersonal();
      } else if (discussion) {
        sentToDiscussion();
      }
    } else {
      setError(true);
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      fullScreen={!isSmall}
      onClose={handleClose}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title" className="title">
        Details
        {checkedBy !== "" && (
          <p style={{ fontSize: "small" }}>
            <span style={{ fontWeight: 600 }}>Completed By:</span> {checkedBy}
          </p>
        )}
      </DialogTitle>

      <DialogContent>
        <DialogContentText
          id="alert-dialog-slide-description"
          style={{
            display: "flex",
            flexDirection: "column",
            overflowX: "hidden",
          }}
        >
          <div style={{ width: "100%", marginBottom: "0.5rem" }}>
            <textarea
              defaultValue={todoText}
              className="TodoTextBox"
              disabled
            />
            {error && (
              <p style={{ color: "rgba(185, 5, 5, 0.7)", fontSize: "10px" }}>
                *Please add some description or title
              </p>
            )}
            {!openSmallTextBox && (
              <div style={{ flex: 1, width: "100%" }}>
                <Button
                  className="uploadView"
                  style={{
                    overflow: "hidden",
                    fontSize: "0.5rem",
                    height: "1.5rem",
                    color: "#fff",
                    backgroundColor: "rgb(5, 185, 125, 0.8)",
                    marginBottom: "1rem",
                  }}
                  onClick={() => {
                    setPersonal(true);
                    setDiscussion(false);
                    setOpenSmallTextBox(true);
                  }}
                >
                  {added ? "Added" : "Add this to personal"}
                </Button>
                <Button
                  className="uploadView"
                  style={{
                    overflow: "hidden",
                    fontSize: "0.5rem",
                    height: "1.5rem",
                    color: "#fff",
                    backgroundColor: "rgb(5, 185, 125, 0.8)",
                    marginBottom: "1rem",
                    marginLeft: "1rem",
                  }}
                  onClick={() => {
                    setDiscussion(true);
                    setPersonal(false);
                    setOpenSmallTextBox(true);
                  }}
                >
                  {sent ? "Sent" : "Ask in group"}
                </Button>
              </div>
            )}
            {openSmallTextBox && (
              <div className="helperBox">
                <textarea
                  defaultValue={helperText}
                  className="helperTextBox"
                  placeholder="Add something more..."
                  onChange={(e) => {
                    setError(false);
                    setHelperText(e.target.value);
                  }}
                />
                <DialogActions>
                  <Button
                    onClick={() => {
                      setError(false);
                      setOpenSmallTextBox(false);
                    }}
                    className="uploadView"
                    style={{
                      overflow: "hidden",
                      fontSize: "0.5rem",
                      height: "1.5rem",
                      color: "#fff",
                      width: "10%",
                      backgroundColor: "rgb(5, 185, 125, 0.8)",
                      marginBottom: "1rem",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    endIcon={
                      <ArrowForwardIcon
                        style={{ color: "#fff", transform: "scale(0.7)" }}
                      />
                    }
                    className="uploadView"
                    style={{
                      overflow: "hidden",
                      fontSize: "0.5rem",
                      height: "1.5rem",
                      color: "#fff",
                      width: "10%",
                      backgroundColor: "rgb(5, 185, 125, 0.8)",
                      marginBottom: "1rem",
                    }}
                    onClick={handleAddTo}
                  >
                    Send
                  </Button>
                </DialogActions>
              </div>
            )}
            {!openSmallTextBox && (
              <>
                <div className="materialMainBox">
                  {admin === currentUser.uid ? (
                    <div style={{ marginRight: "0.5rem" }}>
                      {" "}
                      <input
                        hidden
                        id="profile-image-file"
                        type="file"
                        accept="image/*"
                        onChange={(e) => onSelectFile(e, id)}
                      />
                      <Button
                        className="uploadView"
                        style={{
                          overflow: "hidden",
                          fontSize: "0.5rem",
                          height: "1.5rem",
                          color: "#fff",
                          backgroundColor: "rgb(5, 185, 125, 0.8)",
                          marginBottom: "0.5rem",
                        }}
                        onClick={() => {
                          document.getElementById("profile-image-file").click();
                        }}
                      >
                        Upload Image
                      </Button>
                    </div>
                  ) : (
                    ""
                    // <div style={{ flex: "0.5" }}>
                    //   {todoImage !== "" ? (
                    //     <a
                    //       href={todoImage}
                    //       download
                    //       target="_blank"
                    //       style={{ textDecoration: "none" }}
                    //     >
                    //       <Button
                    //         style={{
                    //           width: "95%",
                    //           fontSize: "0.7rem",
                    //           height: "1.5rem",
                    //           color: "#fff",
                    //           fontWeight: 600,
                    //           backgroundColor: "rgb(5, 185, 125)",

                    //           marginBottom: "0.5rem",
                    //         }}
                    //       >
                    //         Download Image
                    //       </Button>
                    //     </a>
                    //   ) : (
                    //     ""
                    //   )}
                    // </div>
                  )}

                  <div>
                    {todoImage !== "" ? (
                      <a
                        href={todoImage}
                        target="_blank"
                        style={{ textDecoration: "none" }}
                      >
                        <Button
                          className="uploadView"
                          style={{
                            overflow: "hidden",
                            fontSize: "0.5rem",
                            height: "1.5rem",
                            color: "#fff",
                            backgroundColor: "rgb(5, 185, 125, 0.8)",

                            marginBottom: "0.5rem",
                          }}
                        >
                          View Image
                        </Button>
                      </a>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {!openSmallTextBox && (
            <>
              <textarea
                defaultValue={editComment}
                className="commentTextBox"
                placeholder="Add more to explain..."
                onChange={(e) => setText(e)}
              />
              <Button
                className="uploadView"
                style={{
                  overflow: "hidden",
                  width: "10%",
                  fontSize: "0.7rem",
                  height: "1.5rem",
                  color: "#fff",
                  backgroundColor: "rgb(5, 185, 125, 0.8)",
                  marginTop: "0.5rem",
                }}
                onClick={() => handleSet()}
              >
                {done ? "Done" : "Add"}
              </Button>
            </>
          )}
        </DialogContentText>
      </DialogContent>
      {openSnack && (
        <SnackBar
          open={openSnack}
          handleClose={() => setOpenSnack(false)}
          text={"Uploading..."}
          material={true}
        />
      )}
      <DialogActions>
        <Button
          className="closeMaterialModal"
          onClick={handleClose}
          color="primary"
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
