import React, { useEffect, useState } from "react";
import "./contactUs.css";
import contactUs from "../../assets/images/contactMail.svg";
import { Button } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router";

function ContactUs() {
  const history = useHistory();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [send, setSend] = useState(false);

  useEffect(() => {
    if (name !== "" && contact !== "" && message !== "") {
      setSend(true);
    }
  }, [name, contact, message]);

  const sendBtn = () => {
    window.Email.send({
      Host: "smtp.gmail.com",
      Username: "withslogger@gmail.com",
      Password: "slogger2220",
      To: "withslogger@gmail.com",
      From: contact,
      Subject: `From Contact us Page`,
      Body: message,
    }).then(() => {
      console.log("Mail sent");
      setName("");
      setContact("");
      setMessage("");
    });
  };
  return (
    <div className="contactUsPage">
      <div className="contactUsPageBox">
        <p className="contactUsPageHead">
          <ArrowBackIcon
            className="contactUsPageHeadIcon"
            onClick={() => history.goBack()}
          />
          Contact us
        </p>
        <div className="contactPageForm">
          <input
            className="contactInput"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="contactInput"
            placeholder="Email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
          <textarea
            className="contactArea"
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            disabled={!send}
            className="contactSend"
            style={{ opacity: !send && 0.5 }}
            onClick={() => sendBtn()}
          >
            Send
          </Button>
        </div>
      </div>
      <img src={contactUs} className="contactUsImage" />
    </div>
  );
}

export default ContactUs;
