import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { useHistory } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import styled from "styled-components";
import { generateMedia } from "styled-media-query";
import TeamCard from "../TeamCard";
import AddingTeamModal from "../Dialog";
import SnackBar from "../../snackbar/SnackBar";
import { db } from "../../../firebase";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    color: "#fff",
    background: "rgba(0, 145, 96, 0.9)",
    boxShadow: "none",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

export default function SidebarTeams({ UrlTeamName }) {
  const [make, setMake] = useState(false);
  const [openMaker, setOpenMaker] = useState(false);
  const [openMakeSnackBar, setOpenMakeSnackBar] = useState(false);
  const [openJoinSnackBar, setOpenJoinSnackBar] = useState(false);
  const [openDeleteSnackBar, setOpenDeleteSnackBar] = useState(false);
  const [openSnack, setOpenSnack] = useState(false);
  const [currentTeamName, setCurrentTeamName] = useState("");
  const [teams, setTeams] = useState([]);
  const [joinedTeams, setJoinedTeams] = useState([]);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const { currentUser, logOut } = useAuth();

  const handleSignOut = async () => {
    await logOut();
    history.push("/signUp");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickMakeTeam = () => {
    setMake(true);
    setOpenMaker(true);
  };

  const handleClickJoinTeam = () => {
    setMake(false);
    setOpenMaker(true);
  };

  const handleCloseMaker = () => {
    setOpenMaker(false);
  };

  React.useEffect(() => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("userTeams")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) => {
        const _teams = snapshot.docs.map((doc) => ({
          id: doc.id,
          teamName: doc.data().teamName,
          admin: doc.data().admin,
        }));
        console.log(_teams);
        setTeams(_teams);
      });
    db.collection("users")
      .doc(currentUser.uid)
      .collection("joinTeams")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) => {
        const _joinedTeams = snapshot.docs.map((doc) => ({
          id: doc.id,
          teamName: doc.data().teamName,
        }));
        console.log(_joinedTeams);
        setJoinedTeams(_joinedTeams);
      });
  }, [UrlTeamName]);

  return (
    <div>
      <Button className="addItemsTeams" onClick={handleClickOpen}>
        {UrlTeamName === undefined ? "Select Team" : `Team: ${UrlTeamName}`}
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Slogger
            </Typography>
            {/* <Button
              autoFocus
              color="inherit"
              onClick={() => history.push("/help")}
            >
              Help
            </Button>
            <Button autoFocus color="inherit" onClick={() => handleSignOut()}>
              Log out
            </Button> */}
          </Toolbar>
        </AppBar>
        <TeamTodoLeftContainer>
          <TeamTodoLeftLeftBox>
            <Button
              className="addButton1"
              onClick={() => handleClickMakeTeam()}
            >
              Make a team
            </Button>
            <h3 style={{ overflow: "hidden" }}>My Teams</h3>
            <MyTeamContainer>
              {teams.map((team) => (
                <TeamCard
                  sidebarClose={handleClose}
                  key={team.id}
                  id={team.id}
                  teamName={team.teamName}
                  UrlTeamName={UrlTeamName}
                  deleteBtn={true}
                  setOpenDeleteSnackBar={setOpenDeleteSnackBar}
                  setCurrentTeamName={setCurrentTeamName}
                ></TeamCard>
              ))}
            </MyTeamContainer>
          </TeamTodoLeftLeftBox>
          <TeamTodoLeftRightBox>
            <Button
              className="addButton1"
              onClick={() => handleClickJoinTeam()}
            >
              Join a team
            </Button>
            <h3 style={{ overflow: "hidden" }}>Joined Teams</h3>
            <MyTeamContainer>
              {joinedTeams.map((team) => (
                <TeamCard
                  sidebarClose={handleClose}
                  key={team.id}
                  id={team.id}
                  teamName={team.teamName}
                  UrlTeamName={UrlTeamName}
                  deleteBtn={true}
                  setOpenDeleteSnackBar={setOpenDeleteSnackBar}
                  setCurrentTeamName={setCurrentTeamName}
                ></TeamCard>
              ))}
            </MyTeamContainer>
          </TeamTodoLeftRightBox>
        </TeamTodoLeftContainer>
        {openMaker && (
          <AddingTeamModal
            open={openMaker}
            handleClose={handleCloseMaker}
            make={make}
            setCurrentTeamName={setCurrentTeamName}
            openSnackbar={make ? setOpenMakeSnackBar : setOpenJoinSnackBar}
          />
        )}
        {openMakeSnackBar && (
          <SnackBar
            open={openMakeSnackBar}
            handleClose={() => setOpenMakeSnackBar(false)}
            text={`Team ${currentTeamName} Created`}
          />
        )}
        {openJoinSnackBar && (
          <SnackBar
            open={openJoinSnackBar}
            handleClose={() => setOpenJoinSnackBar(false)}
            text={`Welcome to team ${currentTeamName}`}
          />
        )}
        {openDeleteSnackBar && (
          <SnackBar
            open={openDeleteSnackBar}
            handleClose={() => openDeleteSnackBar(false)}
            text={`Team ${currentTeamName} deleted`}
          />
        )}
        {openSnack && (
          <SnackBar
            open={openSnack}
            handleClose={() => setOpenSnack(false)}
            text={"Uploading..."}
            material={true}
          />
        )}
      </Dialog>
    </div>
  );
}

const TeamTodoLeftContainer = styled.div`
  flex: 1;
  border-right: 2px solid rgba(0, 141, 94, 0.295);
  display: flex;
  overflow: hidden;
`;

const TeamTodoLeftLeftBox = styled.div`
  flex: 0.5;
  height: 100%;
  width: 100%;
  border-right: 2px solid rgba(0, 141, 94, 0.295);
  display: flex;
  flex-direction: column;
  padding: 0.5rem;

  .addButton1 {
    width: 95.5%;
    color: #fff;
    font-weight: 600;
    background-color: rgb(5, 185, 125);
    margin: 0.5rem;
    overflow: hidden;
  }
  h3 {
    color: rgb(5, 185, 125);
    font-weight: 600;
    text-align: center;
    width: 100%;
    text-transform: uppercase;
    margin: 0.3rem 0;
    font-size: 0.7rem;
  }
`;
const MyTeamContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll !important;
`;

const TeamTodoLeftRightBox = styled.div`
  flex: 0.5;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;

  .addButton1 {
    width: 95.5%;
    color: #fff;
    font-weight: 600;
    background-color: rgb(5, 185, 125);
    margin: 0.5rem;
    overflow: hidden;
  }
  h3 {
    color: rgb(5, 185, 125);
    font-weight: 600;
    text-align: center;
    width: 100%;
    text-transform: uppercase;
    margin: 0.3rem 0;
    font-size: 0.7rem;
  }
`;
