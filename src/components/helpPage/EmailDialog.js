import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import "./style.css";
import emailjs from "emailjs-com";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="" ref={ref} {...props} />;
});

export default function AddingTeamModal({ open, handleClose, setSent }) {
  const [senderEmail, setSenderEmail] = useState("");

  const handleSend = (e) => {
    console.log(e);
    e.preventDefault();
    emailjs
      .sendForm(
        "service_ulq5i1l",
        "template_iaftte2",
        e.target,
        "user_cY9bhdeY9bLLxIaUdplFl"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );

    e.target.reset();
    setSent(true);
    handleClose();
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
        Mail us
      </DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <form
            className="contact-form"
            onSubmit={handleSend}
            style={{
              display: "flex",
              flexDirection: "column",
              width: "30rem",
            }}
          >
            <label>Email</label>
            <input type="email" name="email" className="input" />
            <label>Message</label>
            <textarea name="message" className="input" />
            <input type="submit" value="Send" className="addButton" />
          </form>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
}
