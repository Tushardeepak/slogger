import React from "react";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import moment from "moment";
import { generateMedia } from "styled-media-query";
import {
  Avatar,
  Button,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import DeleteSweepIcon from "@material-ui/icons/DeleteSweep";
import MemberProfile from "../profile/MemberProfile";

const useStyles = makeStyles((theme) => ({
  timeBtnChat: {
    minWidth: "30%",
  },
}));

function Chat({
  id,
  senderId,
  text,
  date,
  name,
  admin,
  senderProfileImage,
  help,
  UrlTeamName,
  teamTodoText,
  teamTodoImage,
  setTabValue,
  setDiscussionTabValue,
  personalChat,
}) {
  const { currentUser } = useAuth();
  var timeDifference = new Date().getTimezoneOffset();
  var date = moment(date).subtract(1, "h");
  var dateComponent = date.utc().format("DD-MM-YYYY");
  var timeComponent = date.utc().utcOffset(timeDifference).format("HH:mm");
  var hours = new Date(date).getHours();
  var ampm = hours >= 12 ? "pm" : "am";

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const classes = useStyles();
  const [showImage, setShowImage] = React.useState(true);
  const [openMemberProfile, setOpenMemberProfile] = React.useState(false);

  const handleDeleteChat = () => {
    if (UrlTeamName.split("-")[0] === "chats") {
      db.collection("personalChats")
        .doc(UrlTeamName.split("-")[1])
        .collection("myChats")
        .doc(id)
        .delete();
    } else {
      db.collection("teams")
        .doc(UrlTeamName)
        .collection("discussion")
        .doc(id)
        .delete();
    }
  };

  const checkImage = () => {
    fetch(teamTodoImage).then((res) => {
      if (res.status === 404) {
        setShowImage(false);
      }
    });
  };

  React.useEffect(() => {
    checkImage();
  }, []);

  return (
    <TodoMainCard>
      {senderId === currentUser.uid ? (
        <>
          {currentUser.uid === senderId ? (
            ""
          ) : (
            <p className="senderName">
              {name}
              {senderId === admin ? " (Admin)" : ""}{" "}
            </p>
          )}
          <TodoTextBox>
            <p
              style={{
                color: "rgba(0, 99, 66, 0.868)",
                fontWeight: 400,
                width: "100%",
                wordBreak: "break-word",
                verticalAlign: "center",
                height: "auto",
                fontSize: "small",
                margin: "0.2rem 0",
                fontFamily: "Times New Roman",
              }}
            >
              {text}
            </p>
            <div className="chatTimeBox">
              <div className="chatTimeSpace">
                {help && (
                  <Button
                    classes={{ root: classes.timeBtnChat }}
                    disabled
                    className="helpNeeded"
                  >
                    {!isSmall ? "H" : "Help Needed"}
                  </Button>
                )}
              </div>
              <p className="messageTime">
                {" "}
                {dateComponent}
                {" - "}
                {timeComponent} {ampm}
              </p>
              <DeleteSweepIcon
                className="chatDeleteBtn"
                onClick={handleDeleteChat}
              />
            </div>
          </TodoTextBox>
        </>
      ) : (
        <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
          {!personalChat && (
            <Avatar
              src={senderProfileImage}
              alt={name}
              className="senderAvatar"
              onClick={() => setOpenMemberProfile(true)}
            />
          )}
          <div
            style={{ display: "flex", flexDirection: "column", width: "100%" }}
          >
            {currentUser.uid === senderId || personalChat ? (
              ""
            ) : (
              <p className="senderName">{name}</p>
            )}
            <TodoTextBoxReceived>
              <p
                style={{
                  color: "rgba(0, 99, 66, 0.868)",
                  fontWeight: 400,
                  width: "100%",
                  wordBreak: "break-word",
                  verticalAlign: "center",
                  height: "auto",
                  fontSize: "small",
                  margin: "0.2rem 0",
                  fontFamily: "Times New Roman",
                }}
              >
                {text}
              </p>
              <div className="chatTimeBox">
                <div className="chatTimeSpace">
                  {help && (
                    <Button
                      classes={{ root: classes.timeBtnChat }}
                      disabled
                      className="helpNeeded"
                    >
                      {!isSmall ? "H" : "Help Needed"}
                    </Button>
                  )}
                </div>
                <p className="messageTime">
                  {" "}
                  {dateComponent}
                  {" - "}
                  {timeComponent} {ampm}
                </p>
              </div>
            </TodoTextBoxReceived>
          </div>
        </div>
      )}
      {help ? (
        senderId === currentUser.uid ? (
          <TeamTodoChatBox>
            <p>
              <span style={{ color: "rgba(0, 99, 66, 0.7)" }}>Task:</span>{" "}
              {teamTodoText}
            </p>
            {showImage && teamTodoImage !== "" && (
              <a
                href={teamTodoImage}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <img
                  src={teamTodoImage}
                  style={{
                    width: "96%",
                    height: "80%",
                    marginLeft: "2%",
                    marginBottom: "1%",
                    objectFit: "contain",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                />
              </a>
            )}
          </TeamTodoChatBox>
        ) : (
          <TeamTodoChatReceivedBox>
            <p>
              <span style={{ color: "rgba(0, 99, 66, 0.7)" }}>Task:</span>{" "}
              {teamTodoText}
            </p>
            <img
              src={teamTodoImage}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "5px",
              }}
            />
          </TeamTodoChatReceivedBox>
        )
      ) : (
        ""
      )}
      {openMemberProfile && (
        <MemberProfile
          open={openMemberProfile}
          handleClose={() => setOpenMemberProfile(false)}
          id={senderId}
          setTabValue={setTabValue}
          setDiscussionTabValue={setDiscussionTabValue}
          handleTeamMembersModalClose={() => {}}
        />
      )}
    </TodoMainCard>
  );
}

export default Chat;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "600px",
});

const TodoMainCard = styled.div`
  margin: 0.2rem 0rem;
  width: 100%;
  height: 3rem;
  min-height: 3rem;
  display: flex;
  flex-direction: column;
  word-break: "break-word";
  height: auto;
`;

const TodoTextBox = styled.div`
  background-color: rgb(231, 250, 243);
  border-radius: 10px 0px 10px 10px;
  margin: 2px 0;
  margin-right: 5px;
  margin-left: 35%;
  width: 60%;
  z-index: 20;
  padding: 0.2rem 0.5rem;
  word-break: "break-word";
  height: auto;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
`;

const TodoTextBoxReceived = styled.div`
  background-color: rgb(231, 250, 243);
  border-radius: 0px 10px 10px 10px;
  margin: 2px;
  width: 60%;
  z-index: 20;
  padding: 0.2rem 0.5rem;
  word-break: "break-word";
  height: auto;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
`;
const TodoActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  flex: 0.05;
  width: 100%;
  height: auto;
  padding: 0.2rem 0.5rem;
  background-color: rgba(0, 99, 66, 0.868);
  border-radius: 30px 0px 0px 30px;
  border-left: 2px solid rgba(0, 99, 66, 0.768);

  ${customMedia.lessThan("smTablet")`
      flex: 0.09;
    `};

  .delete {
    cursor: pointer;
    ${customMedia.lessThan("smTablet")`
      transform:scale(0.8);
    `};
  }
`;

const TeamTodoChatBox = styled.div`
  height: auto;
  min-height: 3rem;
  background-color: rgba(0, 99, 66, 0.5);
  margin-right: 5px;
  margin-left: 30%;
  width: 60%;
  margin-top: -1rem;
  border-radius: 10px 0px 10px 10px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

  p {
    color: #fff;
    margin: 0.2rem 0.5rem;
    margin-top: 1rem;
    font-size: 0.7rem;
  }
`;
const TeamTodoChatReceivedBox = styled.div`
  height: auto;
  min-height: 3rem;
  background-color: rgba(0, 99, 66, 0.5);
  width: 60%;
  margin-left: 10%;
  margin-top: -1rem;
  border-radius: 0px 10px 10px 10px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

  p {
    color: #fff;
    margin: 0.2rem 0.5rem;
    margin-top: 1rem;
    font-size: 0.7rem;
  }
`;
