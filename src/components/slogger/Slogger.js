//ASSETS
import homePageIcon from "../../assets/images/homeBannerIcon.png";
import homeBannerVideo from "../../assets/videos/HomeBannerVideo.mp4";
import ImportantDevicesRoundedIcon from "@material-ui/icons/ImportantDevicesRounded";
import EmojiFoodBeverageRoundedIcon from "@material-ui/icons/EmojiFoodBeverageRounded";
import TrackChangesRoundedIcon from "@material-ui/icons/TrackChangesRounded";
import MultilineChartRoundedIcon from "@material-ui/icons/MultilineChartRounded";
import DuoRoundedIcon from "@material-ui/icons/DuoRounded";
import LockRoundedIcon from "@material-ui/icons/LockRounded";
import personalTodoImg from "../../assets/images/personalTodoImg.svg";
import teamTodoImg from "../../assets/images/teamTodoImg.svg";
import discussionImg from "../../assets/images/discussionImg.svg";
import profileImg from "../../assets/images/profileImg.svg";
import meetImg from "../../assets/images/meetImg.svg";
import extensionImg from "../../assets/images/extension.svg";
import zipFile from "../../assets/sloggerExtension/SloggerExtension.rar";

//Main
import React from "react";
import NavBar from "../navBar/NavBar";
import "./style.css";
import { useHistory } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Button, useMediaQuery, useTheme, Zoom } from "@material-ui/core";

function SloggerNew() {
  const history = useHistory();
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const [openEx, setOpenEx] = React.useState(false);

  React.useEffect(() => {
    if (currentUser !== null) {
      history.push("/home");
    }
  }, []);
  return (
    <div
      style={{
        height: "auto",
        fontFamily: "Times New Roman",
        overflowX: "hidden",
      }}
    >
      <NavBar page={0} />
      <div className="banner">
        <video autoPlay loop muted className="video">
          <source src={homeBannerVideo} type="video/mp4"></source>
        </video>

        <img src={homePageIcon} className="bannerImg" />
        <div className="bannerText">
          <h3>One stop solution for Work Management</h3>
          <h3>and Team Management</h3>
        </div>
        <Button
          className="bannerBtn"
          onClick={
            currentUser != null
              ? () => history.push("/home")
              : () => history.push("/signup")
          }
        >
          {currentUser != null ? "Go to Dashboard" : "Get started"}
        </Button>
        <svg
          className="downSvgSlogger1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#fff"
            fill-opacity="1"
            d="M0,224L24,208C48,192,96,160,144,165.3C192,171,240,213,288,224C336,235,384,213,432,218.7C480,224,528,256,576,266.7C624,277,672,267,720,256C768,245,816,235,864,234.7C912,235,960,245,1008,229.3C1056,213,1104,171,1152,165.3C1200,160,1248,192,1296,181.3C1344,171,1392,117,1416,90.7L1440,64L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"
          ></path>
        </svg>
        <svg
          className="downSvgSlogger2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#272142bd"
            fill-opacity="1"
            d="M0,224L24,208C48,192,96,160,144,165.3C192,171,240,213,288,224C336,235,384,213,432,218.7C480,224,528,256,576,266.7C624,277,672,267,720,256C768,245,816,235,864,234.7C912,235,960,245,1008,229.3C1056,213,1104,171,1152,165.3C1200,160,1248,192,1296,181.3C1344,171,1392,117,1416,90.7L1440,64L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"
          ></path>
        </svg>
      </div>
      <div className="sloggerBuild">
        <h2 className="sloggerHeadingMain">
          Why to use
          <span className="sloggerHeading">SLOGGER</span>{" "}
        </h2>
        <div className="serviceBox">
          <div className="contentBox">
            <div className="iconBox">
              <EmojiFoodBeverageRoundedIcon className="icon" />
            </div>
            <h2 className="contentHeading">Easy to use</h2>
            <p className="contentPara">
              With slogger you can do various activities to manage your team and
              work with ease. No complex technologies are used.
            </p>
          </div>
          <div className="contentBox">
            <div className="iconBox">
              <ImportantDevicesRoundedIcon className="icon" />
            </div>
            <h2 className="contentHeading">Access anywhere</h2>
            <p className="contentPara">
              Download Slogger as an app in your mobile phone or on your
              desktop. Install option will be shown in browsers.
            </p>
          </div>
          <div className="contentBox">
            <div className="iconBox">
              <TrackChangesRoundedIcon className="icon" />
            </div>
            <h2 className="contentHeading">Stay focused</h2>
            <p className="contentPara">
              As it run as an independent app, It helps you to stay focused on
              your goals without being distracted by what's in the other tabs.
            </p>
          </div>
          <div className="contentBox">
            <div className="iconBox">
              <MultilineChartRoundedIcon className="icon" />
            </div>
            <h2 className="contentHeading">Good analysis</h2>
            <p className="contentPara">
              Slogger gives a graphical representation of your work, plus it
              also gives schedular by which you can plan your future activities
              effectively.
            </p>
          </div>
          <div className="contentBox">
            <div className="iconBox">
              <DuoRoundedIcon className="icon" />
            </div>
            <h2 className="contentHeading">Fast meetings</h2>
            <p className="contentPara">
              With Slogger you can create video/audio call meetings with your
              team in just a click, that also with unlimited hours and
              teammates.
            </p>
          </div>
          <div className="contentBox">
            <div className="iconBox">
              <LockRoundedIcon className="icon" />
            </div>
            <h2 className="contentHeading">Fully secure</h2>
            <p className="contentPara">
              All the files and messages are secured with google storage
              securities. Its safe and reliable.
            </p>
          </div>
        </div>
      </div>
      <div className="extensionContainer">
        <div className="extensionBoxSmall">
          <div className="exSmallText">
            <h3>Making work more easy</h3>
            <h5>Access slogger from anywhere anytime</h5>
          </div>
          <Button
            className="howToAdd"
            onClick={openEx ? () => setOpenEx(false) : () => setOpenEx(true)}
          >
            {openEx ? "Close" : "How to do"}
          </Button>
        </div>
      </div>
      {openEx && (
        <Zoom in={openEx} direction="right" timeout={500}>
          <div className="screenContainer" style={{ marginTop: "-0.7rem" }}>
            <div
              className="screenContainer"
              style={{
                marginBottom: "2rem",
                marginTop: "1rem",
                padding: "2rem 0",
                background: "rgb(205,245,255)",
                background:
                  "linear-gradient(65deg, rgba(205,245,255,1) 0%, rgba(255,255,255,1) 83%)",
                borderRadius: "68% 32% 74% 26% / 22% 47% 53% 78%",
                boxShadow: "rgba(0, 0, 0, 0.1) 1px 2px 4px",
                width: "90%",
              }}
            >
              <div className="screenContentBox">
                <h3 className="screenContentSubHeading">ANYWHERE ANYTIME</h3>
                <h3 className="screenContentHeading">Slogger Extension</h3>
                <h3 className="screenContentPara">
                  Follow these 5 easy steps to add
                </h3>
                <h3 className="screenContentPara">
                  1) Download the zip folder and extract it.
                </h3>
                <h3 className="screenContentPara">
                  2) Go to extension settings in your browser.
                  <br />
                  ("chrome://extensions/" in chrome browser)
                </h3>
                <h3 className="screenContentPara">
                  3) Enable the developer mode.
                </h3>
                <h3 className="screenContentPara">
                  4) Click on Load unpacked button
                </h3>
                <h3 className="screenContentPara">
                  5) Select the folder which you have extracted.
                </h3>
                <a
                  href={zipFile}
                  download
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  <Button className="downloadZipButton">
                    Click here to download .zip file
                  </Button>
                </a>
              </div>
              <img src={extensionImg} className="screenImg" />
            </div>
          </div>
        </Zoom>
      )}
      <h2 className="screenHeading">Workflow that just works</h2>
      <h4 className="screenSubHeading">Artistically Inspired</h4>
      <div className="screenContainer">
        <div className="screenContentBox">
          <h3 className="screenContentSubHeading">FOCUSED WORK</h3>
          <h3 className="screenContentHeading">Personal section</h3>
          <h3 className="screenContentPara">1) Make your own todo list</h3>
          <h3 className="screenContentPara">
            2) Filter those which are completed
          </h3>
          <h3 className="screenContentPara">
            3) Get a visual representation of your work
          </h3>
          <h3 className="screenContentPara">
            4) Gives a schedular for planning future activities
          </h3>
        </div>
        <img src={personalTodoImg} className="screenImg" />
      </div>
      <div className="screenContainer">
        <div className="screenImgBox">
          {isSmall ? <img src={teamTodoImg} className="screenImg" /> : ""}
        </div>
        <div className="screenContentBoxReverse">
          <h3 className="screenContentSubHeading">EFFECTIVE MANAGEMENT</h3>
          <h3 className="screenContentHeading">Team section</h3>
          <h3 className="screenContentPara">1) Make your own teams</h3>
          <h3 className="screenContentPara">2) Join teams</h3>
          <h3 className="screenContentPara">3) Assign work to teammates</h3>
          <h3 className="screenContentPara">4) Check when the work is done</h3>
          <h3 className="screenContentPara">5) Add images to any work</h3>
          <h3 className="screenContentPara">6) Group video call meetings</h3>
        </div>
        {isSmall ? "" : <img src={teamTodoImg} className="screenImg" />}
      </div>
      <div className="screenContainer">
        <div className="screenContentBox">
          <h3 className="screenContentSubHeading">FAST SOLUTIONS</h3>
          <h3 className="screenContentHeading">Discussion section</h3>
          <h3 className="screenContentPara">1) Discuss with your teammates</h3>
          <h3 className="screenContentPara">
            2) One discussion room for every team
          </h3>
          <h3 className="screenContentPara">
            3) Help other to solve their doubts
          </h3>
        </div>
        <img src={discussionImg} className="screenImg" />
      </div>
      <div className="screenContainer">
        <div className="screenImgBox">
          {isSmall ? <img src={profileImg} className="screenImg" /> : ""}
        </div>
        <div className="screenContentBoxReverse">
          <h3 className="screenContentSubHeading">BOOST CONFIDENCE</h3>
          <h3 className="screenContentHeading">Profile section</h3>
          <h3 className="screenContentPara">1) Build up your profile</h3>
          <h3 className="screenContentPara">
            2) Add bio, skills and contact info
          </h3>
          <h3 className="screenContentPara">
            3) Get profile for other team members
          </h3>
          <h3 className="screenContentPara">
            4) Endorse them for their good work
          </h3>
        </div>
        {isSmall ? "" : <img src={profileImg} className="screenImg" />}
      </div>
      <div className="screenContainer">
        <div className="screenContentBox">
          <h3 className="screenContentSubHeading">LIGHTING FAST</h3>
          <h3 className="screenContentHeading">SlogMeet</h3>
          <h3 className="screenContentPara">
            1) High quality video/audio meetings
          </h3>
          <h3 className="screenContentPara">2) Unlimited hours</h3>
          <h3 className="screenContentPara">3) Infinite number of teammates</h3>
          <h3 className="screenContentPara">3) No setup required</h3>
        </div>
        <img src={meetImg} className="screenImg" />
      </div>
      <div className="footerContainer">
        <span
          style={{ marginLeft: "15%", fontSize: "1.125rem", cursor: "pointer" }}
        >
          Questions?
          <br />
        </span>
        <div className="footerColumn">
          <ul>
            <li onClick={() => history.push("/help")}>FAQ</li>
            <li>
              {" "}
              <a href="https://github.com/Tushardeepak/slogger-official">
                Relations
              </a>
            </li>
            <li onClick={() => history.push("/help")}>How to use</li>
          </ul>
          <ul>
            <li>
              <a href="https://github.com/Tushardeepak/slogger-official">
                Help Center
              </a>
            </li>
            <li>
              <a href="https://github.com/Tushardeepak/slogger-official">
                Collaborate
              </a>
            </li>
            <li>
              <a href="https://github.com/Tushardeepak/slogger-official">
                Terms of Use
              </a>
            </li>
            <li>
              <a href="https://github.com/Tushardeepak/slogger-official">
                Contact Us
              </a>
            </li>
          </ul>
          <ul>
            <li>
              <a href="https://github.com/Tushardeepak/slogger-official">
                Amount
              </a>
            </li>
            <li>
              <a href="https://github.com/Tushardeepak/slogger-official">
                Complain
              </a>
            </li>
            <li>
              <a href="https://github.com/Tushardeepak/slogger-official">
                Privacy
              </a>
            </li>
          </ul>
          <ul>
            <li>
              <a href="https://github.com/Tushardeepak/slogger-official">
                Media Center
              </a>
            </li>
            <li>
              <a href="https://github.com/Tushardeepak/slogger-official">
                Storage
              </a>
            </li>
            <li>
              <a href="https://github.com/Tushardeepak/slogger-official">
                Cookie Preferences
              </a>
            </li>
            <li>
              <a href="https://github.com/Tushardeepak/slogger-official">
                Legal Notices
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SloggerNew;
