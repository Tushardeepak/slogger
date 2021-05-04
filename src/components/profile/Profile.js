import {
  AppBar,
  Avatar,
  Box,
  Button,
  createMuiTheme,
  IconButton,
  makeStyles,
  Tab,
  Tabs,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import CreateIcon from "@material-ui/icons/Create";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import SnackBar from "../snackbar/SnackBar";
import "./profile.css";
import SidebarProfile from "../todo/sidebar/SidebarProfile";
import Feedback from "./Feedback.js";
import Endo from "./Endo.js";
import PropTypes from "prop-types";

const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: {
      main: "rgb(2, 88, 60)",
    },
  },
  width: "100%",

  overrides: {
    MuiInputBase: {
      root: {
        overflow: "hidden",
      },
      input: {
        color: "rgb(0, 90, 60)",
        fontSize: "1.2rem",
        cursor: "pointer",
      },
    },
  },
});

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
    padding: 0,
    minHeight: "1rem",
  },
  indicator: {
    backgroundColor: "rgb(5, 185, 125)",
    height: 3,
    borderRadius: "7px",
    width: "9rem",
  },
  label: {
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "0.6rem",
    color: "#565656",
    textTransform: "uppercase",
    paddingTop: "10px",
    borderRadius: "10px 10px 0 0",
  },
  flexContainer: {
    borderBottom: "2px solid rgba(196, 196, 196, 0.5)",
  },
}));

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
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const [value, setValue] = React.useState(0);
  const classes = useStyles();

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
                    bio: bio === "" ? "NoBio" : bio,
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

  return (
    <div className="profilePageContainer">
      {!isSmall ? (
        <SidebarProfile />
      ) : (
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

              <Avatar
                className="avatar"
                alt={name}
                src={profileImage}
                style={{ boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
              />
            </div>

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
      )}
      <div className="profileRightSection">
        <AppBar className={classes.AppBar} position="static">
          <Tabs
            classes={{
              indicator: classes.indicator,
              flexContainer: classes.flexContainer,
            }}
            variant="fullWidth"
            scrollButtons="auto"
            className={classes.Tabs}
            value={value}
            onChange={handleChange}
            aria-label="simple tabs example"
            style={{ position: "relative" }}
          >
            <Tab
              className={classes.label}
              label="Feedbacks"
              {...a11yProps(0)}
            />
            <Tab
              className={classes.label}
              label="Endorsement"
              {...a11yProps(1)}
            />
          </Tabs>
        </AppBar>
        <TabPanel
          value={value}
          index={0}
          style={{ width: "100%", overflowY: "scroll", marginBottom: "0.5rem" }}
        >
          <Feedback />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Endo />
        </TabPanel>
      </div>
    </div>
  );
}

export default Profile;
