import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { generateMedia } from "styled-media-query";
import styled from "styled-components";
import NavBar from "../navBar/NavBar";
import videoFaq from "../../assets/videos/faqVideo.mp4";
import { useAuth } from "../../context/AuthContext";
import { Button, useMediaQuery } from "@material-ui/core";
import EmailDialog from "./EmailDialog";
import EmailIcon from "@material-ui/icons/Email";
import SnackBar from "../snackbar/SnackBar";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    overflow: "scroll",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

function HelpPage() {
  const classes = useStyles();
  const { resetPassword, logOut } = useAuth();
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState("");
  const [openEmail, setOpenEmail] = useState(false);
  const [sent, setSent] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const history = useHistory();

  const handleChange = (set, value) => {
    set(value);
    setError(false);
  };
  const handleClose = () => {
    setOpenEmail(false);
  };

  const handleSignOut = async () => {
    await logOut();
    history.push("/signUp");
  };

  const handlePasswordChange = async () => {
    if (email === "") {
      setError(true);
    } else {
      try {
        setLoader(true);
        await resetPassword(email);
        setEmail("");
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div>
      <HelpPageContainer>
        {!isSmall ? (
          <div
            style={{
              width: "92%",
              height: "56px",
              color: "#fff",
              background: "rgba(0, 145, 96, 0.9)",
              paddingLeft: "15px",
              paddingRight: "15px",
              display: "flex",
              alignItems: "center",
              position: "absolute",
              top: 0,
              zIndex: 100,
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
            }}
          >
            <Typography variant="h6" className={classes.title}>
              Slogger
            </Typography>
            <Button
              autoFocus
              color="inherit"
              onClick={() => history.push("/home")}
            >
              Home
            </Button>
            <Button autoFocus color="inherit" onClick={() => handleSignOut()}>
              Log out
            </Button>
          </div>
        ) : (
          <NavBar page={1} home={true} />
        )}

        <HelpPageLeftBox>
          <video autoPlay loop muted className="helpVideo">
            <source src={videoFaq} type="video/mp4"></source>
          </video>
        </HelpPageLeftBox>
        <HelpPageRightBox>
          <div
            style={{
              width: "100%",
              height: "80vh",
              overflowX: "hidden",
              overflowY: "scroll",
              padding: "0 2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {" "}
            <Button
              className="mail"
              style={{
                background: "rgb(0, 180, 120)",
                color: "#fff",
                width: "30%",
                marginTop: "2rem",
                marginBottom: "1rem",
                overflow: "hidden",
              }}
              onClick={() => setOpenEmail(true)}
              startIcon={<EmailIcon />}
            >
              Mail us
            </Button>
            <div className={classes.root}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  style={{
                    background: "rgb(0, 90, 60, 0.2)",
                    overflow: "hidden",
                  }}
                >
                  <Typography className={classes.heading}>
                    Change Password
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  style={{
                    background: "rgb(0, 90, 60)",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography>Type your email:</Typography>
                  <InputContainer>
                    <input
                      type="email"
                      required
                      placeholder="Email..."
                      onChange={(e) => handleChange(setEmail, e.target.value)}
                    />
                  </InputContainer>
                  <Button
                    disabled={loader}
                    style={{
                      background: "rgb(0, 180, 120)",
                      color: "#fff",
                      width: "30%",
                    }}
                    onClick={handlePasswordChange}
                  >
                    {loader ? "Check Mail" : "Reset"}
                  </Button>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  style={{
                    background: "rgb(0, 90, 60, 0.2)",
                    overflow: "hidden",
                  }}
                >
                  <Typography className={classes.heading}>
                    How to use: Personal Section
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  style={{
                    background: "rgb(0, 90, 60)",
                    color: "white",
                  }}
                >
                  <Typography>
                    1) Write the todo which you want to add then add a time to
                    it.
                    <br />
                    2) You can all mark the todo completed by clicking on the
                    checkbox in starting of every todo.
                    <br />
                    3) You can see completed todos and not completed todos in
                    their respective sections.
                    <br />
                    4) A Donut chart is also visible at bottom left corner, It
                    tell how much work is their and also show the percentage of
                    work completed by you.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  style={{
                    background: "rgb(0, 90, 60, 0.2)",
                    overflow: "hidden",
                  }}
                >
                  <Typography className={classes.heading}>
                    How to use: Team Section
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  style={{
                    background: "rgb(0, 90, 60)",
                    color: "white",
                  }}
                >
                  <Typography>
                    1) Create or Join a team, while creating make sure the you
                    have unique team name.
                    <br />
                    2) Add todos to your team, the todo will get appear on every
                    teammate page.
                    <br />
                    3) You can also assign you teammate's name to a particular
                    todo.
                    <br />
                    4) You can also add images to any particular todo, by this
                    you can explain the work more easily.
                    <br />
                    5) If the work is done mark it complete, this check will
                    appear on every teammate page.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  style={{
                    background: "rgb(0, 90, 60, 0.2)",
                    overflow: "hidden",
                  }}
                >
                  <Typography className={classes.heading}>
                    How to use: Discussion Section
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  style={{
                    background: " rgb(0, 90, 60)",
                    color: "white",
                  }}
                >
                  <Typography>
                    1) Select the team.
                    <br />
                    2) Start typing the message in th input box at bottom right.
                    <br />
                    3) Your messages can be seen by every member of that
                    particular team.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  style={{
                    background: "rgb(0, 90, 60, 0.2)",
                    overflow: "hidden",
                  }}
                >
                  <Typography className={classes.heading}>
                    How to use: Profile Section
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  style={{
                    background: " rgb(0, 90, 60)",
                    color: "white",
                  }}
                >
                  <Typography>
                    1) First setup your profile.
                    <br />
                    2) On the right side you can select a team to get its all
                    members details.
                    <br />
                    3) You can also endorse any group member once for their good
                    work.
                    <br />
                    4) Your endorsements can be seen at the last of your profile
                    in left.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  style={{
                    background: "rgb(0, 90, 60, 0.2)",
                    overflow: "hidden",
                  }}
                >
                  <Typography className={classes.heading}>
                    Not able to see team todos
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  style={{
                    background: "rgb(0, 90, 60)",
                    color: "white",
                  }}
                >
                  <Typography>
                    1) Check your internet connection.
                    <br />
                    2) Talk to team leader, may be the team was deleted.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  style={{
                    background: "rgb(0, 90, 60, 0.2)",
                    overflow: "hidden",
                  }}
                >
                  <Typography className={classes.heading}>
                    Raise an issue
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  style={{
                    background: "rgb(0, 90, 60)",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography>To raise an issue please go to</Typography>

                  <a href="https://github.com/Tushardeepak/slogger-official">
                    https://github.com/Tushardeepak
                  </a>

                  <Typography>
                    Create issue, give details and images.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                  style={{
                    background: "rgb(0, 90, 60, 0.2)",
                    overflow: "hidden",
                  }}
                >
                  <Typography className={classes.heading}>
                    Legal Rights
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  style={{
                    background: "rgb(0, 90, 60)",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography>All rights of Slogger belong to</Typography>

                  <a href="https://github.com/Tushardeepak">
                    https://github.com/Tushardeepak
                  </a>

                  <Typography>Feel free to contact/collaborate.</Typography>
                </AccordionDetails>
              </Accordion>
            </div>
          </div>
        </HelpPageRightBox>
      </HelpPageContainer>
      {openEmail && (
        <EmailDialog
          open={openEmail}
          handleClose={handleClose}
          setSent={setSent}
        />
      )}
      {sent && (
        <SnackBar
          open={sent}
          handleClose={() => setSent(false)}
          text={"Mail Sent, Thank You!"}
        />
      )}
    </div>
  );
}

export default HelpPage;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "600px",
});

const HelpPageContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  overflow: hidden !important;
`;
const HelpPageLeftBox = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;

  .helpVideo {
    margin-top: 2rem;
    object-fit: contain;
    height: 80vh;
    ${customMedia.lessThan("smTablet")`
      display:none;
  `}
  }
`;
const HelpPageRightBox = styled.div`
  width: 50%;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden !important;

  ${customMedia.lessThan("smTablet")`
      width: 100%;
  `}

  a {
    text-decoration: none;
    color: #fff;
    cursor: pointer;
    padding: "1rem 0";
  }
`;
const InputContainer = styled.div`
  margin: 0.7rem 0;

  input {
    width: 90%;
    background: rgb(0, 180, 120);
    color: #fff;
    outline: none;
    border: none;
    height: 2.5rem;
    padding: 0 0.5rem;
    font-size: 0.9rem;
    border-radius: 3px;
  }
  input::placeholder {
    color: #fff;
    font-size: 0.8rem;
  }
`;
