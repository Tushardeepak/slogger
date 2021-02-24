import {
  Button,
  useMediaQuery,
  useTheme,
  AppBar,
  Tab,
  Tabs,
  makeStyles,
  Typography,
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import React, { useState } from "react";
import styled from "styled-components";
import { db } from "../../firebase";
import AddingTeamModal from "./Dialog";
import TeamCard from "./TeamCard";
import { useAuth } from "../../context/AuthContext";
import { generateMedia } from "styled-media-query";
import AlarmIcon from "@material-ui/icons/AddAlarm";
import {
  DateTimePicker,
  MuiPickersUtilsProvider,
  DatePicker,
} from "@material-ui/pickers";
import AddIcon from "@material-ui/icons/Add";
import MomentUtils from "@date-io/moment";
import CreateIcon from "@material-ui/icons/Create";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import green from "@material-ui/core/colors/green";
import CustomTooltip from "../CustomTooltip";
import firebase from "firebase";
import "./heightMedia.css";
import profileSetterImage from "../../assets/images/profileSetterImage.svg";
import Chat from "./Chat";
import SendIcon from "@material-ui/icons/Send";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={1}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "transparent",
    width: "100%",
  },
  AppBar: {
    backgroundColor: "transparent !important",
    boxShadow: "none",
    color: "#000",
    marginTop: "-1rem",
    paddingTop: "0.5rem",
  },
  Tabs: {
    display: "flex",
    justifyContent: "space-between",
  },
  indicator: {
    backgroundColor: "rgb(5, 185, 125)",
    height: 3,
    borderRadius: "7px",
    width: "10.2rem",
  },
  label: {
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "0.8rem",
    // lineHeight: "2.3rem",
    color: "#565656",
    textTransform: "uppercase",
    // padding: "1.8rem 4.2rem",
    padding: "0.3rem",
  },
  flexContainer: {
    borderBottom: "2px solid rgba(196, 196, 196, 0.5)",
  },
}));

const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: green,
    width: "100%",
    cursor: "pointer",
  },
});

function Discussion({ UrlTeamName }) {
  const [teams, setTeams] = useState([]);
  const [joinedTeams, setJoinedTeams] = useState([]);
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const classes = useStyles();
  const [sendTerm, setSendTerm] = useState("");
  const [chatList, setChatList] = useState([]);
  const [profileSetter, setProfileSetter] = useState(true);
  const [name, setName] = useState("");
  const [skill, setSkill] = useState("");
  const [email, setEmail] = useState("");
  const [otherContact, setOtherContact] = useState("");
  const [userName, setUserName] = useState("");
  const [profileError, setProfileError] = useState(false);
  const [loader, setLoader] = useState(true);
  const [deleteTeam, setDeleteTeam] = useState(false);
  const [admin, setAdmin] = useState("");

  const handleSubmitEnter = async (event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      handleSend();
    }
  };

  const handleSend = async () => {
    const date = new Date();
    if (sendTerm !== "") {
      db.collection("teams").doc(UrlTeamName).collection("discussion").add({
        discussionText: sendTerm,
        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
        senderId: currentUser.uid,
        senderName: userName,
        discussionTime: date.toISOString(),
      });
      setSendTerm("");
    }
  };

  const handleSaveProfile = () => {
    if (name !== "" && email !== "") {
      setProfileError(false);
      db.collection("users").doc(currentUser.uid).collection("profile").add({
        name: name,
        email: email,
        other: otherContact,
        skill: skill,
      });
    } else {
      setProfileError(true);
    }
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

  React.useEffect(() => {
    db.collection("teams")
      .doc(UrlTeamName)
      .collection("discussion")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          senderId: doc.data().senderId,
          senderName: doc.data().senderName,
          discussionText: doc.data().discussionText,
          discussionTime: doc.data().discussionTime,
        }));
        setChatList(list);
      });
  }, [UrlTeamName]);

  React.useEffect(() => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("profile")
      .onSnapshot((snapshot) => {
        const profile = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        profile.filter((p) => {
          if (p.name !== "") {
            setUserName(p.name);
            setProfileSetter(false);
            setLoader(false);
          }
        });
      });
  }, []);

  React.useEffect(() => {
    db.collection("teams").onSnapshot((snapshot) => {
      const tempTeamList = snapshot.docs.map((doc) => ({
        id: doc.id,
        admin: doc.data().admin,
        teamDeleted: doc.data().teamDeleted,
      }));
      tempTeamList.filter((team) => {
        if (team.id === UrlTeamName) {
          setDeleteTeam(team.teamDeleted);
          setAdmin(team.admin);
        }
      });
    });
  }, [UrlTeamName]);

  return loader ? (
    <p>Loading...</p>
  ) : profileSetter ? (
    <div
      style={{
        width: "100%",
        height: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="profileContainer">
        <div className="profileImageBox">
          <img className="profileSetterImage" src={profileSetterImage} />
          <p className="profileHeading">
            To use this feature <br /> Please set your profile first.
          </p>
          <Button className="addButton" onClick={() => handleSaveProfile()}>
            Save
          </Button>
        </div>

        <div className="profileBox">
          <div className="inputFieldProfile">
            <label className="profileLabel">Name:</label>
            <input
              value={name}
              className="todoInputProfile"
              type="text"
              placeholder="..."
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="inputFieldProfile">
            <label className="profileLabel">Email:</label>
            <input
              value={email}
              className="todoInputProfile"
              type="text"
              placeholder="..."
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="inputFieldProfile">
            <label className="profileLabel">Other:</label>
            <input
              value={otherContact}
              className="todoInputProfile"
              type="text"
              placeholder="..."
              onChange={(e) => setOtherContact(e.target.value)}
            />
          </div>

          <div className="inputFieldProfile">
            <label className="profileLabel">Skill:</label>
            <input
              value={skill}
              className="todoInputProfile"
              type="text"
              placeholder="..."
              onChange={(e) => setSkill(e.target.value)}
            />
          </div>
          {profileError ? (
            <p style={{ color: "red" }}>Fill Name and Email correctly</p>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  ) : (
    <div>
      <TeamTodoContainer>
        <TeamTodoLeftContainer>
          <TeamTodoLeftLeftBox>
            <h3 style={{ overflow: "hidden" }}>My Teams</h3>
            <MyTeamContainer>
              {teams.map((team) => (
                <TeamCard
                  key={team.id}
                  id={team.id}
                  teamName={team.teamName}
                  UrlTeamName={UrlTeamName}
                ></TeamCard>
              ))}
            </MyTeamContainer>
          </TeamTodoLeftLeftBox>
          <TeamTodoLeftRightBox>
            <h3 style={{ overflow: "hidden" }}>Joined Teams</h3>
            <MyTeamContainer>
              {joinedTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  id={team.id}
                  teamName={team.teamName}
                  UrlTeamName={UrlTeamName}
                ></TeamCard>
              ))}
            </MyTeamContainer>
          </TeamTodoLeftRightBox>
        </TeamTodoLeftContainer>
        {/* ::::::::::::::::: */}
        {UrlTeamName === undefined ? (
          <TeamTodoRightContainer
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "rgba(0, 141, 94)",
              marginBottom: 0,
            }}
          >
            Select a team to start discussion
          </TeamTodoRightContainer>
        ) : deleteTeam ? (
          <TeamTodoRightContainer
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "rgba(0, 141, 94)",
              marginBottom: 0,
            }}
          >
            This team was deleted by the admin
          </TeamTodoRightContainer>
        ) : (
          <TeamTodoRightContainer>
            {chatList.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "rgba(0, 141, 94)",
                  width: "100%",
                  height: "100%",
                }}
              >
                No messages...
              </div>
            ) : (
              chatList.map((chat) => (
                <Chat
                  text={chat.discussionText}
                  date={chat.discussionTime}
                  name={chat.senderName}
                  senderId={chat.senderId}
                  admin={admin}
                />
              ))
            )}

            <TodoRightDownBox>
              <input
                value={sendTerm}
                type="text"
                style={{
                  flex: "0.85",
                  border: "none",
                  background: "none",
                  padding: "0 0.5rem",
                  height: "2rem",
                  outline: "none",
                  borderBottom: "2px solid rgb(5, 185, 125)",
                  margin: "0.5rem",
                  color: "rgb(3, 185, 124)",
                  fontSize: "1rem",
                }}
                onKeyDown={(e) => handleSubmitEnter(e)}
                onChange={(e) => setSendTerm(e.target.value)}
                placeholder="Type..."
              />
              <Button
                endIcon={<SendIcon />}
                style={{
                  background: "rgb(5, 185, 125)",
                  flex: "0.15",
                  color: "#fff",
                  height: "2rem",
                  marginRight: "0.5rem",
                  overflow: "hidden",
                }}
                onClick={handleSend}
              >
                Send
              </Button>
            </TodoRightDownBox>
          </TeamTodoRightContainer>
        )}

        {/* ::::::::::::::::: */}
      </TeamTodoContainer>
    </div>
  );
}

export default Discussion;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "740px",
});

const TeamTodoContainer = styled.div`
  position: relative;
  width: 98.5%;
  height: 87%;
  position: absolute;
  display: flex;
  ${customMedia.lessThan("smTablet")`
    flex:0.7;
      flex-direction:column;
  `}
`;

const TeamTodoLeftContainer = styled.div`
  flex: 0.5;
  border-right: 2px solid rgba(0, 141, 94, 0.295);
  display: flex;
  overflow: hidden;
  ${customMedia.lessThan("smTablet")`
        flex:0.4;
        border-bottom: 2px solid rgba(0, 141, 94, 0.295);
        margin-bottom:1rem;
    `}
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
    ${customMedia.lessThan("smTablet")`
        width:97% !important;
        margin: 0.5rem 1rem;
        margin-left:0rem;
      `}
  }
  h3 {
    color: rgb(5, 185, 125);
    font-weight: 600;
    text-align: center;
    width: 100%;
    text-transform: uppercase;
    margin: 0.3rem 0;
    ${customMedia.lessThan("smTablet")`
        font-size:10px;
        margin-top:-0.4rem;
      `}
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
    ${customMedia.lessThan("smTablet")`
        width:97% !important;
        margin: 0.5rem 1rem;
        margin-left:0rem;
      `}
  }
  h3 {
    color: rgb(5, 185, 125);
    font-weight: 600;
    text-align: center;
    width: 100%;
    text-transform: uppercase;
    margin: 0.3rem 0;
    ${customMedia.lessThan("smTablet")`
        font-size:10px;
        margin-top:-0.4rem;
      `}
  }
`;
const TeamTodoRightContainer = styled.div`
  border-radius: 20px;
  margin: 0 0.5rem;
  background: rgb(29, 143, 2, 0.13);
  flex: 0.5;
  overflow-y: scroll;
  padding: 0 1rem;
  margin-bottom: 4rem;
  ${customMedia.lessThan("smTablet")`
    margin-bottom: 1rem !important;
  `}
  .teamNoTodoImage {
    ${customMedia.lessThan("smTablet")`
    height:100% !important;
  `}
  }
`;

const TodoRightDownBox = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  border-radius: 10px;
  margin: 0.2rem 0;
  width: 48%;
  background-color: rgb(3, 185, 124, 0.2);

  ${customMedia.lessThan("smTablet")`
    border:none;
    width: 90% !important;
    transform:scale(0.9);
  `}
`;
const ChatScreen = styled.div`
  flex: 0.9;
  overflow-y: scroll !important;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
`;
const ChatInput = styled.div`
  flex: 0.1;
  display: flex;
  background-color: rgba(5, 185, 125, 0.281);
  border-radius: 10px;
  width: 100%;
  align-items: center;
  height: 3.5rem;
  overflow: hidden;
`;