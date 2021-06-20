import { Avatar, Checkbox } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import PuffLoader from "react-spinners/PuffLoader";
import MemberProfile from "../../profile/MemberProfile";
import { useHistory } from "react-router";
import { useAuth } from "../../../context/AuthContext";

function ChatMemberCard({
  id,
  chatId,
  setSelected,
  selected,
  setTabValue,
  handleTeamMembersModalClose,
  UrlTeamName,
}) {
  const [member, setMember] = useState({});
  const [chatDetails, setChatDetails] = useState({});
  const [loader, setLoader] = useState(false);
  const [openMemberModal, setOpenMemberModal] = useState(false);
  const history = useHistory();
  const { currentUser } = useAuth();

  useEffect(() => {
    setLoader(true);
    db.collection("users")
      .doc(id)
      .collection("profile")
      .onSnapshot((snapshot) => {
        const memberDetails = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          profileImage: doc.data().profileImage,
        }));

        setMember(memberDetails[0]);
        setLoader(false);
      });
  }, []);

  useEffect(() => {
    db.collection("personalChats")
      .doc(chatId)
      .collection("myChats")
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
          teamTodoImage: doc.data().teamTodoImage,
          read: doc.data().read,
        }));
        setChatDetails(list[0]);
        if (list[0] != undefined) {
          if (
            list[0].senderId !== currentUser.uid &&
            chatId === UrlTeamName?.split("-")[1]
          ) {
            db.collection("personalChats")
              .doc(chatId)
              .collection("myChats")
              .doc(list[0].id)
              .set(
                {
                  read: true,
                },
                { merge: true }
              );
          }
        }
      });
  }, []);

  const toggle = (memberId, checked) => {
    if (checked) {
      setSelected([...selected, memberId]);
    } else {
      let _checkList = [...selected];
      setSelected(_checkList.filter((check) => check !== memberId));
    }
  };

  useEffect(() => {
    if (UrlTeamName !== undefined) {
    }
  }, []);

  const emptyFunction = () => {};

  return loader ? (
    <PuffLoader loading={loader} color="#2ec592" size={30} />
  ) : (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "3rem",
        padding: "0.3rem",
        borderBottom: "1px solid rgb(5, 185, 125,0.2)",
        position: "relative",
        fontWeight:
          chatDetails !== undefined
            ? chatDetails?.senderId !== currentUser.uid &&
              !chatDetails?.read &&
              800
            : 400,
        background:
          UrlTeamName != undefined
            ? UrlTeamName?.split("-")[1] === chatId && "rgba(4, 110, 75, 0.1)"
            : "#fff",
      }}
    >
      {/* <Checkbox
        checked={selected?.includes(id)}
        style={{ color: "rgb(5, 185, 125)" }}
        onChange={(event) => toggle(id, event.target.checked)}
      /> */}
      <Avatar
        src={member.profileImage}
        style={{ marginLeft: "1.5rem", marginRight: "1rem", cursor: "pointer" }}
        onClick={() => setOpenMemberModal(true)}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          width: "100%",
        }}
        onClick={() => history.push(`/home/chats-${chatId}`)}
      >
        <p
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            color: "grey",
          }}
        >
          {member.name}
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <p
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              color: "grey",
              fontSize: "x-small",
              width: "50%",
            }}
          >
            {chatDetails !== undefined
              ? chatDetails.senderId !== currentUser.uid
                ? `${chatDetails.discussionText}`
                : `You: ${chatDetails.discussionText}`
              : ""}
          </p>
          <p
            style={{
              color: "grey",
              fontSize: "x-small",
              right: "0.5rem",
              bottom: "0.5rem",
              position: "absolute",
            }}
          >
            {chatDetails !== undefined
              ? new Date(chatDetails.discussionTime).toString().substring(4, 15)
              : ""}
          </p>
        </div>
      </div>
      {openMemberModal && (
        <MemberProfile
          open={openMemberModal}
          handleClose={() => setOpenMemberModal(false)}
          id={id}
          setTabValue={setTabValue}
          setDiscussionTabValue={emptyFunction}
          handleTeamMembersModalClose={handleTeamMembersModalClose}
        />
      )}
    </div>
  );
}

export default ChatMemberCard;
