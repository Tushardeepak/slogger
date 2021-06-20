import { Avatar, Checkbox } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebase";
import PuffLoader from "react-spinners/PuffLoader";
import MemberProfile from "../../profile/MemberProfile";

function TeamMemberCard({
  id,
  setSelected,
  selected,
  setTabValue,
  handleTeamMembersModalClose,
}) {
  const [member, setMember] = useState({});
  const [loader, setLoader] = useState(false);
  const [openMemberModal, setOpenMemberModal] = useState(false);

  useEffect(() => {
    setLoader(true);
    db.collection("users")
      .doc(id)
      .collection("profile")
      .onSnapshot((snapshot) => {
        const memberDetails = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          email: doc.data().email,
          profileImage: doc.data().profileImage,
        }));

        setMember(memberDetails[0]);
        setLoader(false);
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

  const emptyFunction = () => {};

  return loader ? (
    <PuffLoader loading={loader} color="#2ec592" size={30} />
  ) : (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        margin: "0.5rem 0",
        padding: "0.3rem",
        borderBottom: "1px solid rgb(5, 185, 125,0.2)",
      }}
    >
      <Checkbox
        checked={selected?.includes(id)}
        style={{ color: "rgb(5, 185, 125)" }}
        onChange={(event) => toggle(id, event.target.checked)}
      />
      <Avatar
        src={member.profileImage}
        style={{ marginLeft: "1.5rem", marginRight: "1rem", cursor: "pointer" }}
        onClick={() => setOpenMemberModal(true)}
      />
      <div
        style={{ display: "flex", flexDirection: "column", cursor: "pointer" }}
        onClick={() => setOpenMemberModal(true)}
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
        <p
          style={{
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            color: "grey",
            fontSize: "x-small",
          }}
        >
          {member.email}
        </p>
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

export default TeamMemberCard;
