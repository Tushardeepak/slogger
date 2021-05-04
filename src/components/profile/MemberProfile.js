import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Avatar, Fade, useMediaQuery, useTheme } from "@material-ui/core";
import { db } from "../../firebase";
import FacebookIcon from "@material-ui/icons/Facebook";
import InstagramIcon from "@material-ui/icons/Instagram";
import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import "./memberProfile.css";
import { useAuth } from "../../context/AuthContext";
import EndoCards from "./EndoCards";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade direction="up" ref={ref} {...props} />;
});

export default function MemberProfile({ open, handleClose, id }) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const [profileImage, setProfileImage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [skillList, setSkillList] = useState([]);
  const [bio, setBio] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [endoText, setEndoText] = useState("");
  const [allEndoIdList, setAllEndoIdList] = useState([]);
  const { currentUser } = useAuth();

  const handleSubmit = () => {
    if (endoText !== "") {
      db.collection("users")
        .doc(id)
        .collection("endorsement")
        .doc(currentUser.uid)
        .set({
          giverId: currentUser.uid,
          giverEndorsement: endoText,
        });
      setEndoText("");
    }
  };

  const getAllMembers = () => {
    db.collection("users")
      .doc(id)
      .collection("endorsement")
      .onSnapshot((snapshot) => {
        const endoIdList = snapshot.docs.map((doc) => ({
          giverId: doc.data().giverId,
          giverEndorsement: doc.data().giverEndorsement,
        }));
        setAllEndoIdList(endoIdList);
      });
  };

  useEffect(() => {
    getAllMembers();
  }, []);

  useEffect(() => {
    db.collection("users")
      .doc(id)
      .collection("profile")
      .onSnapshot((snapshot) => {
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
        setContact(profile[0].contact);
        setFacebook(profile[0].facebook);
        setInstagram(profile[0].instagram);
        setBio(profile[0].bio);
        setGithub(profile[0].github);
        setLinkedin(profile[0].linkedin);
        setSkillList(profile[0].skills.split(","));
      });
  }, []);

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        fullScreen={!isSmall}
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        {/* <DialogTitle id="alert-dialog-slide-title">{id}</DialogTitle> */}
        <DialogContent>
          <DialogContentText
            id="alert-dialog-slide-description"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: !isSmall ? "550px" : "400px",
                overflowY: "scroll",
              }}
            >
              <div className="MemberTopBar">
                <Avatar
                  className="memberProfileAvatar"
                  alt={name}
                  src={profileImage}
                />

                <div className="memberNameEmail">
                  <p className="memberProfileName">{name}</p>
                  <p className="memberProfileEmail">{email}</p>
                </div>
              </div>
              <div className="memberProfileLinkContainer">
                <div style={{ flex: 1 }}></div>
                {!facebook === "" || !facebook === "NoLink" ? (
                  ""
                ) : (
                  <a href={facebook} target="_blank">
                    <FacebookIcon className="MemberProfileLinkIcon" />
                  </a>
                )}
                {!instagram === "" || !instagram === "NoLink" ? (
                  ""
                ) : (
                  <a href={instagram} target="_blank">
                    <InstagramIcon className="MemberProfileLinkIcon" />
                  </a>
                )}
                {!github === "" || !github === "NoLink" ? (
                  ""
                ) : (
                  <a href={github} target="_blank">
                    <GitHubIcon className="MemberProfileLinkIcon" />
                  </a>
                )}
                {!linkedin === "" || !linkedin === "NoLink" ? (
                  ""
                ) : (
                  <a href={linkedin} target="_blank">
                    <LinkedInIcon className="MemberProfileLinkIcon" />
                  </a>
                )}
              </div>
              {bio !== "" && bio !== "NoBio" && (
                <div className="memberProfileBioBox">
                  <p>{bio}</p>
                </div>
              )}
              {skillList[0] !== "NoSkill" && (
                <div className="memberProfileSkillBox">
                  {skillList?.map((skill) => (
                    <div className="memberProfileSkill">{skill}</div>
                  ))}
                </div>
              )}
              {id !== currentUser.uid && (
                <>
                  <p className="endoHeading">Give Endorsement:</p>
                  <div className="memberEndoBox">
                    <textarea
                      className="memberEndoTextarea"
                      value={endoText}
                      onChange={(e) => setEndoText(e.target.value)}
                    />
                  </div>
                  <div style={{ display: "flex" }}>
                    <div style={{ flex: 1 }}></div>
                    <Button
                      onClick={() => handleSubmit()}
                      className="uploadView"
                      style={{
                        overflow: "hidden",
                        fontSize: "0.7rem",
                        height: "1.5rem",
                        color: "#fff",
                        width: "10%",
                        backgroundColor: "rgb(5, 185, 125)",
                        marginRight: "1rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      send
                    </Button>
                  </div>
                </>
              )}
              {allEndoIdList.length !== 0 && (
                <p
                  className="endoHeading"
                  style={{ textAlign: "center", fontSize: "1.5rem" }}
                >
                  Endorsements
                </p>
              )}
              {allEndoIdList?.map((endo) => (
                <EndoCards
                  key={endo.giverId}
                  memberId={id}
                  giverId={endo.giverId}
                  giverEndorsement={endo.giverEndorsement}
                />
              ))}
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleClose()}
            className="uploadView"
            style={{
              overflow: "hidden",
              fontSize: "0.7rem",
              height: "1.5rem",
              color: "#fff",
              width: "10%",
              backgroundColor: "rgb(5, 185, 125, 0.8)",
              marginRight: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
