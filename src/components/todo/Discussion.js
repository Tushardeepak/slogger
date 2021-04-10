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
import React, { useRef, useState } from "react";
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
import SidebarTeams from "./sidebar/SidebarTeams";

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

function Discussion({ UrlTeamName, userName, profileImage }) {
  const [teams, setTeams] = useState([]);
  const [joinedTeams, setJoinedTeams] = useState([]);
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const classes = useStyles();
  const [sendTerm, setSendTerm] = useState("");
  const [chatList, setChatList] = useState([]);
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
        senderProfileImage: profileImage,
        senderName: userName,
        discussionTime: date.toISOString(),
        help: false,
        teamTodoText: "",
      });
      setSendTerm("");
      executeScroll();
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
          senderProfileImage: doc.data().senderProfileImage,
          teamTodoText: doc.data().teamTodoText,
          help: doc.data().help,
        }));
        setChatList(list);
      });
  }, [UrlTeamName]);

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

  const executeScroll = () => {
    document
      .getElementById("scrollToThisDiv")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  };

  React.useEffect(() => {
    if (UrlTeamName !== undefined && !deleteTeam) {
      executeScroll();
    }
  }, [chatList.length]);

  const emptyFunction = () => {};

  return (
    <div>
      <TeamTodoContainer>
        {!isSmall ? (
          <SidebarTeams UrlTeamName={UrlTeamName} />
        ) : (
          <TeamTodoLeftContainer>
            <TeamTodoLeftLeftBox>
              <h3 style={{ overflow: "hidden" }}>My Teams</h3>
              <MyTeamContainer>
                {teams.map((team) => (
                  <TeamCard
                    sidebarClose={emptyFunction}
                    key={team.id}
                    id={team.id}
                    teamName={team.teamName}
                    UrlTeamName={UrlTeamName}
                    discussion={true}
                  ></TeamCard>
                ))}
              </MyTeamContainer>
            </TeamTodoLeftLeftBox>
            <TeamTodoLeftRightBox>
              <h3 style={{ overflow: "hidden" }}>Joined Teams</h3>
              <MyTeamContainer>
                {joinedTeams.map((team) => (
                  <TeamCard
                    sidebarClose={emptyFunction}
                    key={team.id}
                    id={team.id}
                    teamName={team.teamName}
                    UrlTeamName={UrlTeamName}
                    discussion={true}
                  ></TeamCard>
                ))}
              </MyTeamContainer>
            </TeamTodoLeftRightBox>
          </TeamTodoLeftContainer>
        )}
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
              [...chatList]
                .reverse()
                .map((chat) => (
                  <Chat
                    key={chat.id}
                    id={chat.id}
                    UrlTeamName={UrlTeamName}
                    senderProfileImage={chat.senderProfileImage}
                    text={chat.discussionText}
                    date={chat.discussionTime}
                    name={chat.senderName}
                    senderId={chat.senderId}
                    admin={admin}
                    help={chat.help}
                    teamTodoText={chat.teamTodoText}
                  />
                ))
            )}
            <div
              id="scrollToThisDiv"
              style={{ height: "3rem", width: "100%" }}
            ></div>
            <TodoRightDownBox>
              <textarea
                value={sendTerm}
                type="text"
                // onKeyDown={(e) => handleSubmitEnter(e)}
                onChange={(e) => setSendTerm(e.target.value)}
                placeholder="Type..."
              />
              <Button
                // endIcon={<SendIcon />}
                style={{
                  background: "rgb(5, 185, 125)",
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
  smTablet: "600px",
});

const TeamTodoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 90%;
  position: absolute;
  display: flex;
  ${customMedia.lessThan("smTablet")`
    flex:1;
      flex-direction:column;
      height: 93%;
      margin-left:-0.1rem;
      width: 99%;
  `}
`;

const TeamTodoLeftContainer = styled.div`
  flex: 0.45;
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
    color: rgb(5, 185, 125, 0.8);
    font-weight: 600;
    text-align: center;
    font-size: 0.9rem;
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
    color: rgb(5, 185, 125, 0.8);
    font-weight: 600;
    text-align: center;
    width: 100%;
    font-size: 0.9rem;
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
  flex: 0.55;
  overflow-y: scroll;
  padding: 0 1rem;
  margin-bottom: 3.5rem;
  margin-top: 0.5rem;

  @media (max-height: 500px) {
    flex: 0.85 !important;
  }

  ${customMedia.lessThan("smTablet")`
  margin:0 0.5rem;
  padding:0;
    margin-top: 0.5rem;
    margin-bottom: 4rem;
    flex:1;
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
  right: 2rem;
  display: flex;
  align-items: center;
  border-radius: 5px;
  margin: 0.2rem 0;
  margin-bottom: 0;
  width: 52%;
  background-color: rgb(206, 252, 236);
  /* @media (max-height: 650px) {
    bottom: 0.8rem;
  } */
  @media (max-height: 570px) {
    bottom: 1.5rem;
  }
  @media (max-height: 450px) {
    bottom: 2rem;
  }
  @media (max-height: 350px) {
    bottom: 2.2rem;
  }

  textarea {
    resize: none;
    flex: 1;
    border: none;
    background: none;
    padding: 0 0.5rem;
    height: 2rem;
    outline: none;
    border-bottom: 2px solid rgb(5, 185, 125);
    margin: 0.5rem;
    color: rgb(5, 185, 125);
    font-size: 0.8rem;
    @media (max-width: 600px) {
      font-size: 1.1rem !important;
    }
    /* @media (max-height: 500px) {
      height: 3rem !important;
    } */
  }

  textarea::placeholder {
    color: rgb(5, 185, 125);
    font-size: 0.8rem;
    ${customMedia.lessThan("smTablet")`
      font-size: 1rem;
    `};
  }

  ${customMedia.lessThan("smTablet")`
    border:none;
    width: 100% !important;
    //bottom: 0;
    margin-right:-1.7rem !important;
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
