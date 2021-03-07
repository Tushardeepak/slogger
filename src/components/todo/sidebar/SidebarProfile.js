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
import "./sidebar.css";
import { useHistory } from "react-router";
import { useAuth } from "../../../context/AuthContext";
import CreateIcon from "@material-ui/icons/Create";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import { db, storage } from "../../../firebase";
import { Avatar, Paper } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import EmailIcon from "@material-ui/icons/Email";
import DeleteIcon from "@material-ui/icons/Delete";
import SnackBar from "../../snackbar/SnackBar";

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

export default function SidebarProfile() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const { currentUser, logOut } = useAuth();
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
    <div>
      <Button className="addItemsProfile" onClick={handleClickOpen}>
        My profile
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
        <div className="sidebarProfileMyProfile">
          <div className="sidebarProfileTopBar">
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

            <Button
              className="sidebarProfileProfileEdit"
              onClick={() => handleSaveProfile()}
            >
              {profileSetter ? "done" : "edit"}
            </Button>
          </div>
          <div className="sidebarProfileInputBox">
            <label>Name:</label>
            <input
              disabled={!profileSetter}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="sidebarProfileInput"
              placeholder="Full name..."
            />
          </div>
          <div className="sidebarProfileInputBox">
            <label>Email:</label>
            <input
              disabled={!profileSetter}
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="sidebarProfileInput"
              placeholder="Email given on slogger..."
            />
          </div>
          <div className="sidebarProfileInputBox">
            <label>Contact:</label>
            <input
              disabled={!profileSetter}
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="sidebarProfileInput"
              placeholder="Phone number..."
            />
          </div>
          <div className="sidebarProfileInputBox" style={{ height: "auto" }}>
            <label>Bio:</label>
            <textarea
              style={{
                resize: "none",
                padding: "7px",
              }}
              rows="5"
              cols="5"
              disabled={!profileSetter}
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="sidebarProfileInput"
              placeholder="Say something about yourself..."
            />
          </div>
          {profileSetter ? (
            <>
              <div className="sidebarProfileInputBox">
                <label>Skills:</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="sidebarProfileInput"
                  placeholder="Skills with comma separated..."
                />
              </div>
              <div className="sidebarProfileInputBox">
                <label>Facebook Link:</label>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="sidebarProfileInput"
                  placeholder="Give your profile page URL..."
                />
              </div>
              <div className="sidebarProfileInputBox">
                <label>Instagram Link:</label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="sidebarProfileInput"
                  placeholder="Give your profile page URL..."
                />
              </div>
              <div className="sidebarProfileInputBox">
                <label>Github Link:</label>
                <input
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="sidebarProfileInput"
                  placeholder="Give your profile page URL..."
                />
              </div>
              <div className="sidebarProfileInputBox">
                <label>Linkedin Link:</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="sidebarProfileInput"
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
                <Paper elevation={3} className="sidebarEndContainer">
                  <div className="sidebarEndTopContainer">
                    <div className="sidebarEndCircle">
                      <Avatar
                        className="sidebarEndProfileImage"
                        alt={data.name}
                        src={data.profileImage}
                      />
                    </div>
                    <div className="sidebarEndNameContainer">
                      <p>
                        <PersonIcon className="sidebarEndIcon" />
                        {data.name}
                      </p>
                      <p>
                        <EmailIcon className="sidebarEndIcon" />
                        {data.email}
                      </p>
                    </div>
                    <div className="sidebarEndLinkContainer">
                      <DeleteIcon
                        className="memberIcon"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDelete(data.GiverId)}
                      />
                    </div>
                  </div>

                  <div
                    className="sidebarEndEndContainer"
                    style={{ color: "#40856e" }}
                  >
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
      </Dialog>
    </div>
  );
}
