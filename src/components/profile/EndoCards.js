import { Avatar, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import PuffLoader from "react-spinners/PuffLoader";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import DeleteIcon from "@material-ui/icons/Delete";

function EndoCards({
  giverId,
  giverEndorsement,
  memberId,
  feedback,
  task,
  id,
  teamName,
}) {
  const [member, setMember] = useState({});
  const [loader, setLoader] = useState(false);
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    setLoader(true);
    db.collection("users")
      .doc(giverId)
      .collection("profile")
      .onSnapshot((snapshot) => {
        const memberDetails = snapshot.docs.map((doc) => ({
          name: doc.data().name,
          email: doc.data().email,
          profileImage: doc.data().profileImage,
        }));
        setMember(memberDetails[0]);
        setLoader(false);
      });
  }, []);

  const handleDelete = () => {
    if (feedback) {
      db.collection("users")
        .doc(currentUser.uid)
        .collection("feedback")
        .doc(id)
        .delete();
    } else {
      db.collection("users")
        .doc(memberId)
        .collection("endorsement")
        .doc(currentUser.uid)
        .delete();
    }
  };

  return loader ? (
    <PuffLoader loading={loader} color="#2ec592" size={30} />
  ) : (
    <div
      style={{
        margin: isSmall ? "0.5rem 2rem" : "0.5rem",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        padding: "0.5rem",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0.3rem",
        }}
      >
        <Avatar
          src={member.profileImage}
          style={{
            marginRight: "1rem",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              color: "rgb(4, 110, 75)",
            }}
          >
            {member.name}
          </p>
          <p
            style={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              color: "rgb(4, 110, 75,0.8)",
              fontSize: "xx-small",
            }}
          >
            {feedback ? teamName : member.email}
          </p>
        </div>
        <div style={{ flex: 1 }}></div>
        {giverId === currentUser.uid && (
          <DeleteIcon
            style={{
              transform: "scale(0.7)",
              cursor: "pointer",
              color: "grey",
            }}
            onClick={() => handleDelete()}
          />
        )}
      </div>
      {feedback && (
        <p
          style={{
            fontSize: "0.7rem",
            padding: "0.5rem",
            margin: "0.2rem 0",
            borderRadius: "10px",
            background: "rgb(182, 181, 181,0.3)",
            marginRight: "2rem",
            color: "grey",
            wordBreak: "break-word",
          }}
        >
          {task}
        </p>
      )}
      <p style={{ fontSize: "0.7rem" }}>{giverEndorsement}</p>
    </div>
  );
}

export default EndoCards;
