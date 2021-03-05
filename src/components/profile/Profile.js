import {
  Avatar,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Select,
} from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import SecurityIcon from "@material-ui/icons/Security";
import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import SnackBar from "../snackbar/SnackBar";
import "./profile.css";
import MemberCard from "./MemberCard";
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import DeleteIcon from "@material-ui/icons/Delete";

function Profile() {
  const [profileImage, setProfileImage] = useState("");
  const [profilePath, setProfilePath] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const [profileError, setProfileError] = useState(false);
  const [profileSetter, setProfileSetter] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [skills, setSkills] = useState("");
  const [skillList, setSkillList] = useState([]);
  const [bio, setBio] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [teams, setTeams] = useState([]);
  const [allMemberIdList, setAllMemberIdList] = useState([]);
  const [team, handleChangeTeam] = React.useState("");
  const [endorsementList, setEndorsementList] = useState([]);
  const { currentUser } = useAuth();

  const handleSaveProfile = () => {
    const _skillList = skills.split(",");
    setSkillList(_skillList);

    setProfileSetter(!profileSetter);

    if (profileSetter) {
      if (name !== "" && email !== "") {
        setProfileError(false);
        db.collection("users")
          .doc(currentUser.uid)
          .collection("profile")
          .onSnapshot((snapshot) => {
            if (snapshot.docs.length === 0) {
              db.collection("users")
                .doc(currentUser.uid)
                .collection("profile")
                .add({
                  name: name,
                  email: email,
                  contact: contact,
                  bio: bio,
                  skills: skills,
                  facebook: facebook,
                  instagram: instagram,
                  github: github,
                  linkedin: linkedin,
                  profileImage: profileImage,
                });
            } else {
              const prevProfile = snapshot.docs.map((doc) => ({
                id: doc.id,
              }));

              db.collection("users")
                .doc(currentUser.uid)
                .collection("profile")
                .doc(prevProfile[0].id)
                .set(
                  {
                    name: name,
                    email: email,
                    bio: bio === "" ? "NoContact" : bio,
                    contact: contact === "" ? "NoContact" : contact,
                    skills: skills === "" ? "NoSkill" : skills,
                    facebook: facebook === "" ? "NoLink" : facebook,
                    instagram: instagram === "" ? "NoLink" : instagram,
                    github: github === "" ? "NoLink" : github,
                    linkedin: linkedin === "" ? "NoLink" : linkedin,
                    profileImage: profileImage === "" ? "NoLink" : profileImage,
                  },
                  { merge: true }
                );
            }
          });
      } else {
        setProfileError(true);
      }
    } else {
      console.log("Not");
    }
  };

  const onSelectFile = async (event) => {
    var path = (window.URL || window.webkitURL).createObjectURL(
      event.target.files[0]
    );
    setProfilePath(path.slice(5));
    setOpenSnack(true);
    try {
      const image = event.target.files[0];
      const uploadTask = await storage
        .ref(`profileImages/${image.name}`)
        .put(image);
      storage
        .ref("profileImages")
        .child(image.name)
        .getDownloadURL()
        .then((url) => {
          console.log(url);
          setProfileImage(url);
        });
    } catch (error) {
      console.log(error);
    }
    setOpenSnack(false);
  };

  const handleDelete = (id) => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("endorsement")
      .doc(id)
      .delete();
  };

  const getAllMembers = (selectedTeamName) => {
    db.collection("teams")
      .doc(selectedTeamName)
      .collection("members")
      .onSnapshot((snapshot) => {
        const memberIdList = snapshot.docs.map((doc) => ({
          id: doc.data().id,
        }));

        setAllMemberIdList(memberIdList);
      });
  };

  useEffect(() => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("profile")
      .onSnapshot((snapshot) => {
        if (snapshot.docs.length === 0) {
          console.log("New User");
        } else {
          const profile = snapshot.docs.map((doc) => ({
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
          setProfileImage(profile[0].profileImage);
          setName(profile[0].name);
          setEmail(profile[0].email);
          setSkills(profile[0].skills);
          setContact(profile[0].contact);
          setFacebook(profile[0].facebook);
          setInstagram(profile[0].instagram);
          setBio(profile[0].bio);
          setGithub(profile[0].github);
          setLinkedin(profile[0].linkedin);
          setSkillList(profile[0].skills.split(","));
        }
      });
  }, []);

  React.useEffect(() => {
    var _teams = [];
    db.collection("users")
      .doc(currentUser.uid)
      .collection("userTeams")
      .orderBy("timeStamp", "desc")
      .onSnapshot((snapshot) => {
        _teams = snapshot.docs.map((doc) => ({
          id: doc.id,
          teamName: doc.data().teamName,
          admin: doc.data().admin,
        }));
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
        setTeams([..._teams, ..._joinedTeams]);
      });
  }, []);

  useEffect(() => {
    db.collection("users")
      .doc(currentUser.uid)
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
    <div className="profilePageContainer">
      <div className="profilePageMyProfile">
        <div className="profilePageTopBar">
          <div className="avatarBox">
            <input
              hidden
              id="profile-image-file"
              type="file"
              accept="image/*"
              onChange={(e) => onSelectFile(e)}
            />
            {profileSetter ? (
              <IconButton
                className="avatarEdit"
                onClick={() => {
                  document.getElementById("profile-image-file").click();
                }}
              >
                <CreateIcon />
              </IconButton>
            ) : (
              ""
            )}

            <Avatar className="avatar" alt={name} src={profileImage} />
          </div>
          {/* <div className="profilePageBadgeBox">
            <div className="profilePageBadges">
              <SecurityIcon className="profilePageSingleBadge gold" />
              {"(2)"}
            </div>
            <div className="profilePageBadges mid">
              <SecurityIcon className="profilePageSingleBadge silver" />
              {"(2)"}
            </div>
            <div className="profilePageBadges">
              <SecurityIcon className="profilePageSingleBadge brozn" />
              {"(2)"}
            </div>
          </div> */}
          <Button
            className="profilePageProfileEdit"
            onClick={() => handleSaveProfile()}
          >
            {profileSetter ? "done" : "edit"}
          </Button>
        </div>
        <div className="profilePageInputBox">
          <label>Name:</label>
          <input
            disabled={!profileSetter}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="profilePageInput"
            placeholder="Full name..."
          />
        </div>
        <div className="profilePageInputBox">
          <label>Email:</label>
          <input
            disabled={!profileSetter}
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="profilePageInput"
            placeholder="Email given on slogger..."
          />
        </div>
        <div className="profilePageInputBox">
          <label>Contact:</label>
          <input
            disabled={!profileSetter}
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="profilePageInput"
            placeholder="Phone number..."
          />
        </div>
        <div className="profilePageInputBox" style={{ height: "auto" }}>
          <label>Bio:</label>
          <textarea
            style={{ resize: "none", padding: "7px" }}
            rows="5"
            cols="5"
            disabled={!profileSetter}
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="profilePageInput"
            placeholder="Say something about yourself..."
          />
        </div>
        {profileSetter ? (
          <>
            <div className="profilePageInputBox">
              <label>Skills:</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="profilePageInput"
                placeholder="Skills with comma separated..."
              />
            </div>
            <div className="profilePageInputBox">
              <label>Facebook Link:</label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className="profilePageInput"
                placeholder="Give your profile page URL..."
              />
            </div>
            <div className="profilePageInputBox">
              <label>Instagram Link:</label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="profilePageInput"
                placeholder="Give your profile page URL..."
              />
            </div>
            <div className="profilePageInputBox">
              <label>Github Link:</label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="profilePageInput"
                placeholder="Give your profile page URL..."
              />
            </div>
            <div className="profilePageInputBox">
              <label>Linkedin Link:</label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="profilePageInput"
                placeholder="Give your profile page URL..."
              />
            </div>
          </>
        ) : (
          <div className="skillListAndLinkBox">
            {skillList.length !== 0 ? (
              <div className="skillContainer">
                <p>Skills: </p>
                <div className="skillBox">
                  {skillList?.map((skill) => (
                    <div className="skill">{skill}</div>
                  ))}
                </div>
              </div>
            ) : (
              ""
            )}

            <div className="linkContainer">
              {facebook === "" || facebook === "NoLink" ? (
                ""
              ) : (
                <a href={facebook}>
                  <FacebookIcon className="linkIcon" />
                </a>
              )}
              {instagram === "" || instagram === "NoLink" ? (
                ""
              ) : (
                <a href={instagram}>
                  <InstagramIcon className="linkIcon" />
                </a>
              )}
              {github === "" || github === "NoLink" ? (
                ""
              ) : (
                <a href={github}>
                  <GitHubIcon className="linkIcon" />
                </a>
              )}
              {linkedin === "" || linkedin === "NoLink" ? (
                ""
              ) : (
                <a href={linkedin}>
                  <LinkedInIcon className="linkIcon" />
                </a>
              )}
            </div>
            <p className="endorsementHeading">My Endorsements</p>
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
                    <DeleteIcon
                      className="memberIcon"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleDelete(data.GiverId)}
                    />
                  </div>
                </div>

                <div className="EndEndContainer" style={{ color: "#40856e" }}>
                  <p>{data.endorsement}</p>
                </div>
              </Paper>
            ))}
          </div>
        )}
        {openSnack && (
          <SnackBar
            open={openSnack}
            handleClose={() => setOpenSnack(false)}
            text={"Uploading..."}
            material={true}
          />
        )}
      </div>
      <div className="otherProfileSection">
        <p>Select Team :</p>
        <Select
          value={team}
          onChange={(e) => handleChangeTeam(e.target.value)}
          disableUnderline
          style={{
            background: "#d1faec",
            borderRadius: 10,
            width: "100%",
            padding: "5px 10px",
          }}
        >
          {teams?.map((team) => (
            <MenuItem
              key={team.id}
              value={team.teamName}
              style={{
                color: "#2ec592",
              }}
              onClick={() => getAllMembers(team.teamName)}
            >
              {team.teamName}
            </MenuItem>
          ))}
        </Select>
        {/* <MemberCard /> */}
        {allMemberIdList?.map((memberId) =>
          memberId.id === currentUser.uid ? (
            ""
          ) : (
            <MemberCard
              id={memberId.id}
              name={name}
              email={email}
              profileImage={profileImage}
            />
          )
        )}
      </div>
    </div>
  );
}

export default Profile;
