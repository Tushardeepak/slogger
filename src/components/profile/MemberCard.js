import { Avatar, Button, Paper } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import CallIcon from "@material-ui/icons/Call";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import StarsIcon from "@material-ui/icons/Stars";
import CancelIcon from "@material-ui/icons/Cancel";
import DeleteIcon from "@material-ui/icons/Delete";
import "./member.css";
import CustomTooltip from "../CustomTooltip";
import { useAuth } from "../../context/AuthContext";

function MemberCard({ id, name, email, profileImage }) {
  const [member, setMember] = useState({});
  const [skillList, setSkillList] = useState([]);
  const [openEndorsement, setOpenEndorsement] = useState(false);
  const [endorsementGiven, setEndorsementGiven] = useState("");
  const [endorsementList, setEndorsementList] = useState([]);
  const { currentUser } = useAuth();

  const handleSubmit = () => {
    if (endorsementGiven !== "") {
      db.collection("users")
        .doc(id)
        .collection("endorsement")
        .doc(currentUser.uid)
        .set({
          GiverName: name,
          GiverEmail: email,
          GiverId: currentUser.uid,
          GiverEndorsement: endorsementGiven,
          GiverProfileImage: profileImage,
        });
      setEndorsementGiven("");
    }
  };

  const handleDelete = () => {
    db.collection("users")
      .doc(id)
      .collection("endorsement")
      .doc(currentUser.uid)
      .delete();
  };

  useEffect(() => {
    db.collection("users")
      .doc(id)
      .collection("profile")
      .onSnapshot((snapshot) => {
        const memberDetails = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          email: doc.data().email,
          profileImage: doc.data().profileImage,
          skills: doc.data().skills,
          contact: doc.data().contact,
          facebook: doc.data().facebook,
          instagram: doc.data().instagram,
          linkedin: doc.data().linkedin,
          github: doc.data().github,
          bio: doc.data().bio,
        }));
        setSkillList(memberDetails[0].skills.split(","));
        setMember(memberDetails[0]);
      });
  }, []);

  useEffect(() => {
    db.collection("users")
      .doc(id)
      .collection("endorsement")
      .onSnapshot((snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          profileImage: doc.data().GiverProfileImage,
          name: doc.data().GiverName,
          email: doc.data().GiverEmail,
          endorsement: doc.data().GiverEndorsement,
          GiverId: doc.data().GiverId,
        }));
        console.log(list);
        setEndorsementList(list);
      });
  }, []);
  return (
    <Paper elevation={3} className="memberContainer">
      <div className="memberTopContainer">
        <div className="memberCircle">
          <Avatar
            className="memberProfileImage"
            alt={member.name}
            src={member.profileImage}
          />
        </div>
        <div className="memberNameContainer">
          <p>
            <PersonIcon className="memberIcon" />
            {member.name}
          </p>
          <p>
            <EmailIcon className="memberIcon" />
            {member.email}
          </p>
          {member.contact !== "NoContact" && (
            <p>
              <CallIcon className="memberIcon" />

              {member.contact}
            </p>
          )}
        </div>
        <div className="memberLinkContainer">
          {member.facebook !== "NoLink" ? (
            <a href={member.facebook}>
              <FacebookIcon className="memberIcon" />
            </a>
          ) : (
            ""
          )}
          {member.instagram !== "NoLink" ? (
            <a href={member.instagram}>
              <InstagramIcon className="memberIcon" />
            </a>
          ) : (
            ""
          )}
          {member.github !== "NoLink" ? (
            <a href={member.github}>
              <GitHubIcon className="memberIcon" />
            </a>
          ) : (
            ""
          )}
          {member.linkedin !== "NoLink" ? (
            <a href={member.linkedin}>
              <LinkedInIcon className="memberIcon" />
            </a>
          ) : (
            ""
          )}
        </div>
      </div>
      {!openEndorsement ? (
        <>
          {skillList[0] !== "NoSkill" && (
            <div className="memberSkillContainer">
              {skillList?.map((skill) => (
                <div className="skill">{skill}</div>
              ))}
            </div>
          )}
          <div className="memberBioContainer">
            {member.bio !== "NoBio" && <p>{member.bio}</p>}
          </div>
          <div className="endorsementBtnContainer">
            <div className="endorsementBtnSpaceBox"></div>
            <CustomTooltip title="Endorsements" arrow placement="left">
              <StarsIcon
                className="endorsementBtn"
                onClick={() => setOpenEndorsement(true)}
              />
            </CustomTooltip>
          </div>{" "}
        </>
      ) : (
        <>
          <div className="endorsementBtnContainer">
            <div className="endorsementBtnSpaceBox"></div>
            <CustomTooltip title="Close" arrow placement="left">
              <CancelIcon
                className="endorsementBtn"
                onClick={() => setOpenEndorsement(false)}
              />
            </CustomTooltip>
          </div>
          <div className="endorsementContainer">
            <div className="endorsementInputContainer">
              <textarea
                value={endorsementGiven}
                onChange={(e) => setEndorsementGiven(e.target.value)}
                className="endorsementTextBox"
                placeholder="Write..."
              ></textarea>

              <Button
                className="endorsementSendBtn"
                onClick={() => handleSubmit()}
              >
                Send
              </Button>
            </div>
            {endorsementList?.map((data) => (
              <Paper elevation={3} className="EndContainer">
                <div className="EndTopContainer">
                  <div className="EndCircle">
                    <Avatar
                      className="EndProfileImage"
                      alt={data.name}
                      src={data.profileImage}
                    />
                  </div>
                  <div className="EndNameContainer">
                    <p>
                      <PersonIcon className="EndIcon" />
                      {data.name}
                    </p>
                    <p>
                      <EmailIcon className="EndIcon" />
                      {data.email}
                    </p>
                  </div>
                  <div className="EndLinkContainer">
                    {data.GiverId === currentUser.uid ? (
                      <DeleteIcon
                        className="memberIcon"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete()}
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div className="EndEndContainer">
                  <p>{data.endorsement}</p>
                </div>
              </Paper>
            ))}
          </div>
        </>
      )}
    </Paper>
  );
}

export default MemberCard;
