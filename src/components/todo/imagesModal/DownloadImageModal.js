import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Fade } from "@material-ui/core";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import DeleteIcon from "@material-ui/icons/Delete";
import { useAuth } from "../../../context/AuthContext";
import { db, storage } from "../../../firebase";
import firebase from "firebase";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade direction="up" ref={ref} {...props} />;
});

export default function DownloadImageModal({
  open,
  handleClose,
  link,
  senderId,
  imageId,
  urlTeamName,
  id,
  imageList,
  handleCloseImageModal,
  setImageList,
  todoText,
  userName,
  profileImage,
  setTabValue,
}) {
  const { currentUser } = useAuth();
  const [sure, setSure] = useState(false);
  const [error, setError] = useState(false);
  const [imageChatText, setImageChatText] = useState("");

  const handleDeleteImage = async () => {
    var desertRef = storage.refFromURL(link);
    desertRef
      .delete()
      .then(function () {
        console.log("File deleted successfully");
      })
      .catch(function (error) {
        console.log(error);
      });

    db.collection("teams")
      .doc(urlTeamName)
      .collection("teamTodos")
      .doc(id)
      .collection("teamTodoImages")
      .doc(imageId)
      .delete();

    let _list = [...imageList];
    setImageList(_list.filter((img) => imageId !== img.id));
    if (imageList.length === 1) {
      handleCloseImageModal();
    }
    handleClose();
  };

  const sentToDiscussion = () => {
    if (imageChatText !== "") {
      db.collection("teams").doc(urlTeamName).collection("discussion").add({
        discussionText: imageChatText,
        teamTodoText: todoText,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        senderId: currentUser.uid,
        senderProfileImage: profileImage,
        senderName: userName,
        discussionTime: new Date().toISOString(),
        help: true,
        teamTodoImage: link,
      });
      setTabValue(2);
      handleClose();
    } else {
      setError(true);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent style={{ color: "#019966" }}>Actions</DialogContent>
        <DialogContent>
          {currentUser.uid === senderId && !sure && (
            <Button
              endIcon={
                <DeleteIcon
                  style={{ color: "#fff", transform: "scale(0.7)" }}
                />
              }
              className="uploadView"
              style={{
                overflow: "hidden",
                fontSize: "0.7rem",
                height: "1.5rem",
                color: "#fff",
                backgroundColor: "#019966",
                marginTop: "1rem",
                marginRight: "1rem",
              }}
              onClick={() => setSure(true)}
            >
              Delete Image
            </Button>
          )}

          {sure && (
            <Button
              className="uploadView"
              style={{
                overflow: "hidden",
                fontSize: "0.7rem",
                height: "1.5rem",
                color: "#fff",
                backgroundColor: "#019966",
                marginTop: "1rem",
              }}
              onClick={() => setSure(false)}
            >
              back
            </Button>
          )}
          {sure && (
            <Button
              className="uploadView"
              style={{
                overflow: "hidden",
                fontSize: "0.7rem",
                height: "1.5rem",
                color: "#fff",
                backgroundColor: "#019966",
                marginTop: "1rem",
                marginLeft: "1rem",
              }}
              onClick={handleDeleteImage}
            >
              sure ?
            </Button>
          )}

          {!sure && (
            <a href={link} target="_blank" style={{ textDecoration: "none" }}>
              <Button
                endIcon={
                  <OpenInNewIcon
                    style={{ color: "#fff", transform: "scale(0.7)" }}
                  />
                }
                className="uploadView"
                style={{
                  overflow: "hidden",
                  fontSize: "0.7rem",
                  height: "1.5rem",
                  color: "#fff",
                  backgroundColor: "#019966",
                  marginTop: "1rem",
                }}
              >
                Open in new tab
              </Button>
            </a>
          )}
        </DialogContent>
        <DialogContent style={{ color: "#019966" }}>
          Ask in chat
          {error && (
            <p style={{ color: "rgba(185, 5, 5, 0.7)", fontSize: "10px" }}>
              *Please add some description or title
            </p>
          )}
          <textarea
            defaultValue={imageChatText}
            className="helperTextBox"
            placeholder="Add some description..."
            onChange={(e) => {
              setError(false);
              setImageChatText(e.target.value);
            }}
          />
        </DialogContent>
        <DialogContent style={{ display: "flex" }}>
          <div style={{ flex: 1 }}></div>
          <Button
            className="uploadView"
            style={{
              overflow: "hidden",
              fontSize: "0.7rem",
              height: "1.5rem",
              color: "#fff",
              backgroundColor: "#019966",
              marginRight: "0.5rem",
            }}
            onClick={sentToDiscussion}
          >
            Ask
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
