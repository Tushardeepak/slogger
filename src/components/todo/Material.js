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
}) {
  const [editComment, setEditComment] = useState(comment);
  const [done, setDone] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [added, setAdded] = useState(false);
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
    // console.log(todoText);
    // console.log(new Date().toISOString());
    // console.log(todoEndDate);

    db.collection("users").doc(currentUser.uid).collection("todos").add({
      todoText: todoText,
      todoStartDate: new Date().toISOString(),
      todoEndDate: todoEndDate,
      checked: false,
      priority: 3,
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setAdded(true);
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
            <div style={{ flex: 1, width: "100%" }}>
              <Button
                endIcon={
                  added && (
                    <DoneIcon
                      style={{ color: "#fff", transform: "scale(0.8)" }}
                    />
                  )
                }
                className="uploadView"
                style={{
                  overflow: "hidden",
                  fontSize: "0.5rem",
                  height: "1.5rem",
                  color: "#fff",
                  backgroundColor: "rgb(5, 185, 125, 0.8)",
                  marginBottom: "1rem",
                }}
                onClick={addToPersonal}
              >
                {added ? "Added" : "Add this to personal"}
              </Button>
            </div>
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
          </div>
          <textarea
            defaultValue={editComment}
            className="commentTextBox"
            placeholder="Add something..."
            rows="5"
            cols="50"
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
