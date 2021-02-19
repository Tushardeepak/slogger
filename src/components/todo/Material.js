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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="" ref={ref} {...props} />;
});

export default function Material({
  open,
  handleClose,
  id,
  todoImage,
  admin,
  currentUser,
}) {
  const onSelectFile = async (event) => {
    // try {
    //   const image = event.target.files[0];
    //   const uploadTask = await storage
    //     .ref(`todoImages/${image.name}`)
    //     .put(image);
    //   storage
    //     .ref("todoImages")
    //     .child(image.name)
    //     .getDownloadURL()
    //     .then((url) => {
    //       console.log(url);
    //       db.collection("teams")
    //         .doc(urlTeamName)
    //         .collection("teamTodos")
    //         .doc(id)
    //         .set(
    //           {
    //             todoImage: url,
    //           },
    //           { merge: true }
    //         );
    //     });
    // } catch (error) {
    //   console.log(error);
    // }
    console.log(id);
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
        Material
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <div style={{ display: "flex" }}>
            {admin === currentUser.uid ? (
              <div style={{ margin: "0 0.5rem" }}>
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
                    width: "10rem",
                    fontSize: "0.7rem",
                    height: "1.5rem",
                    color: "#fff",
                    fontWeight: 600,
                    backgroundColor: "rgb(5, 185, 125)",
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

            <div style={{ margin: "0 0.5rem" }}>
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
                      width: "10rem",
                      fontSize: "0.7rem",
                      height: "1.5rem",
                      color: "#fff",
                      fontWeight: 600,
                      backgroundColor: "rgb(5, 185, 125)",

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
      </DialogActions>
    </Dialog>
  );
}
