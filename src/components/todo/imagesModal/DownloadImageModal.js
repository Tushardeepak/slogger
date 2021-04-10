import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Fade } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade direction="up" ref={ref} {...props} />;
});

export default function DownloadImageModal({ open, handleClose, link }) {
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
        <DialogTitle id="alert-dialog-slide-title">
          {"Use Google's location service?"}
        </DialogTitle>

        <DialogActions>
          <a href={link} download style={{ textDecoration: "none" }}>
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
            >
              Download
            </Button>
          </a>
          <a href={link} target="_blank" style={{ textDecoration: "none" }}>
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
            >
              Open in new tab
            </Button>
          </a>
        </DialogActions>
      </Dialog>
    </div>
  );
}
