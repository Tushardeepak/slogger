//ASSETS
import ImportantDevicesRoundedIcon from "@material-ui/icons/ImportantDevicesRounded";
import EmojiFoodBeverageRoundedIcon from "@material-ui/icons/EmojiFoodBeverageRounded";
import TrackChangesRoundedIcon from "@material-ui/icons/TrackChangesRounded";
import MultilineChartRoundedIcon from "@material-ui/icons/MultilineChartRounded";
import DuoRoundedIcon from "@material-ui/icons/DuoRounded";
import LockRoundedIcon from "@material-ui/icons/LockRounded";
import bestBG from "../../assets/images/bestBG.png";
import NotificationsActiveIcon from "@material-ui/icons/NotificationsActive";
import FeedbackIcon from "@material-ui/icons/Feedback";
import increaseProductivity from "../../assets/images/increaseProductivity.png";
import family from "../../assets/images/family.png";
import standout from "../../assets/images/standout.png";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowUpwardRoundedIcon from "@material-ui/icons/ArrowUpwardRounded";

//Main
import React from "react";
import NavBar from "../navBar/NavBar";
import "./style.css";
import { useHistory } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { Button, useMediaQuery, useTheme, Zoom } from "@material-ui/core";
import { Link, animateScroll as scroll } from "react-scroll";

function SloggerNew() {
  const history = useHistory();
  const { currentUser } = useAuth();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const [openEx, setOpenEx] = React.useState(false);
  const [showNav, setShowNav] = React.useState(false);

  React.useEffect(() => {
    if (currentUser !== null) {
      history.push("/home");
    }
    window.addEventListener("scroll", function () {
      if (window.pageYOffset >= 120) {
        setShowNav(true);
      } else {
        setShowNav(false);
      }
    });
  }, []);
  return (
    <div
      style={{
        height: "auto",
        // fontFamily: "Times New Roman",
        overflowX: "hidden",
        position: "relative",
      }}
    >
      {showNav && (
        <div className="scrollToTop" onClick={() => scroll.scrollToTop()}>
          <ArrowUpwardRoundedIcon />
        </div>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="bannerWave1"
      >
        <path
          fill="rgba(2, 78, 2, 0.05)"
          fill-opacity="1"
          d="M0,192L14.1,208C28.2,224,56,256,85,234.7C112.9,213,141,139,169,106.7C197.6,75,226,85,254,80C282.4,75,311,53,339,58.7C367.1,64,395,96,424,101.3C451.8,107,480,85,508,64C536.5,43,565,21,593,32C621.2,43,649,85,678,96C705.9,107,734,85,762,74.7C790.6,64,819,64,847,80C875.3,96,904,128,932,165.3C960,203,988,245,1016,224C1044.7,203,1073,117,1101,117.3C1129.4,117,1158,203,1186,202.7C1214.1,203,1242,117,1271,69.3C1298.8,21,1327,11,1355,5.3C1383.5,0,1412,0,1426,0L1440,0L1440,320L1425.9,320C1411.8,320,1384,320,1355,320C1327.1,320,1299,320,1271,320C1242.4,320,1214,320,1186,320C1157.6,320,1129,320,1101,320C1072.9,320,1045,320,1016,320C988.2,320,960,320,932,320C903.5,320,875,320,847,320C818.8,320,791,320,762,320C734.1,320,706,320,678,320C649.4,320,621,320,593,320C564.7,320,536,320,508,320C480,320,452,320,424,320C395.3,320,367,320,339,320C310.6,320,282,320,254,320C225.9,320,198,320,169,320C141.2,320,113,320,85,320C56.5,320,28,320,14,320L0,320Z"
        ></path>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
        className="bannerWave2"
      >
        <path
          fill="rgba(2, 78, 2, 0.05)"
          fill-opacity="1"
          d="M0,192L14.1,208C28.2,224,56,256,85,240C112.9,224,141,160,169,122.7C197.6,85,226,75,254,106.7C282.4,139,311,213,339,218.7C367.1,224,395,160,424,133.3C451.8,107,480,117,508,112C536.5,107,565,85,593,96C621.2,107,649,149,678,149.3C705.9,149,734,107,762,112C790.6,117,819,171,847,181.3C875.3,192,904,160,932,138.7C960,117,988,107,1016,122.7C1044.7,139,1073,181,1101,213.3C1129.4,245,1158,267,1186,266.7C1214.1,267,1242,245,1271,240C1298.8,235,1327,245,1355,250.7C1383.5,256,1412,256,1426,256L1440,256L1440,320L1425.9,320C1411.8,320,1384,320,1355,320C1327.1,320,1299,320,1271,320C1242.4,320,1214,320,1186,320C1157.6,320,1129,320,1101,320C1072.9,320,1045,320,1016,320C988.2,320,960,320,932,320C903.5,320,875,320,847,320C818.8,320,791,320,762,320C734.1,320,706,320,678,320C649.4,320,621,320,593,320C564.7,320,536,320,508,320C480,320,452,320,424,320C395.3,320,367,320,339,320C310.6,320,282,320,254,320C225.9,320,198,320,169,320C141.2,320,113,320,85,320C56.5,320,28,320,14,320L0,320Z"
        ></path>
      </svg>
      {showNav && <NavBar page={0} />}
      <div className="banner">
        <img src={bestBG} className="bestBG" />
        <p className="bannerHeading">SLOGGER</p>
        <div className="bannerText">
          <p>
            One stop solution for team management and personal
            <br />
            work with effortless collaborations
          </p>
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
        <div className="bannerNavBox">
          <div className="bannerNavBar">
            {/* <StarOutlineIcon className="bannerNavIcon" /> */}
            <Link
              to="sloggerBuild"
              spy={true}
              smooth={true}
              duration={500}
              offset={-100}
            >
              {" "}
              <p className="bannerNavP1">
                Features{" "}
                <span>
                  Loaded with 30+ cool features including Chats, video meetings,
                  day planner, in app notifications, email notifications,
                  calender management, feedback and endorsement.
                </span>
              </p>
            </Link>
          </div>
          <div className="bannerNavBar">
            {/* <ExtensionIcon className="bannerNavIcon" /> */}
            <p
              className="bannerNavP2"
              onClick={() => history.push("/extension")}
            >
              Extension{" "}
              <span>
                Use Slogger from anywhere and anytime. Its a all in one
                progressive web app, Can be downloaded on all devices. Also have
                a Chrome extension for easy access.{" "}
              </span>
            </p>
          </div>
          <div className="bannerNavBar">
            {/* <QueuePlayNextIcon className="bannerNavIcon" /> */}
            <Link
              to="productivity"
              spy={true}
              smooth={true}
              duration={500}
              offset={-100}
            >
              <p className="bannerNavP3">
                Sections{" "}
                <span>
                  Comes with 8+ useful sections including personal work
                  management section, team management sections, calender and
                  timeline maintaining sections with discussion section.
                </span>
              </p>
            </Link>
          </div>
          <div className="bannerNavBar">
            {/* <PermContactCalendarIcon className="bannerNavIcon" /> */}
            <Link
              to="free"
              spy={true}
              smooth={true}
              duration={500}
              offset={-200}
            >
              <p className="bannerNavP4">
                Pricing{" "}
                <span>
                  Your lucky! Slogger is free for now, We are still in
                  development phase. So no charges will be asked for any
                  services.
                </span>
              </p>
            </Link>
          </div>
          <div className="bannerNavBar">
            {/* <PermContactCalendarIcon className="bannerNavIcon" /> */}
            <Link to="contactSection" spy={true} smooth={true} duration={500}>
              <p className="bannerNavP5">
                Contact
                <span>
                  For contact and queries go to Github, We welcome all your
                  queries and doubts. Head over to help page for more
                  information.
                </span>
              </p>
            </Link>
          </div>
        </div>
      </div>
      <div className="sloggerBuild">
        {/* <h2 className="sloggerHeadingMain">
          Why to use
          <span className="sloggerHeading">SLOGGER</span>{" "}
        </h2> */}
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
          <div className="contentBox">
            <div className="iconBox">
              <FeedbackIcon className="icon" />
            </div>
            <h2 className="contentHeading">Boosting & feedbacks</h2>
            <p className="contentPara">
              Boost the team sprit by giving suggestions and feedback, You can
              also appreciate others work by endorsing them.
            </p>
          </div>
          <div className="contentBox">
            <div className="iconBox">
              <NotificationsActiveIcon className="icon" />
            </div>
            <h2 className="contentHeading">Active notifications</h2>
            <p className="contentPara">
              Don't miss any of your work, timely in app notifications with
              email notification is forward.
            </p>
          </div>
        </div>
      </div>

      <div className="sloggerSections productivity">
        <div className="sloggerSectionParaBox">
          <p className="sloggerSectionHead">
            Increase your team's
            <br />
            <span>Productivity</span>
          </p>
          <div className="sloggerSectionPara">
            <p>
              <span>
                <ArrowRightIcon className="sloggerSectionParaIcon" />
              </span>
              Make your own channels
            </p>
            <p>
              {" "}
              <span>
                <ArrowRightIcon className="sloggerSectionParaIcon" />
              </span>
              Discuss with your teammates
            </p>
            <p>
              {" "}
              <span>
                <ArrowRightIcon className="sloggerSectionParaIcon" />
              </span>
              Track the assignees
            </p>
            <p>
              {" "}
              <span>
                <ArrowRightIcon className="sloggerSectionParaIcon" />
              </span>
              Unlimited video meetings
            </p>
            <p>
              {" "}
              <span>
                <ArrowRightIcon className="sloggerSectionParaIcon" />
              </span>
              Prioritize your works
            </p>
            <p>
              {" "}
              <span>
                <ArrowRightIcon className="sloggerSectionParaIcon" />
              </span>
              List, Board, Timeline and Calender views
            </p>
            <p>
              {" "}
              <span>
                <ArrowRightIcon className="sloggerSectionParaIcon" />
              </span>
              Gives suggestions to others
            </p>
            <p>
              {" "}
              <span>
                <ArrowRightIcon className="sloggerSectionParaIcon" />
              </span>
              Get email notifications of your work
            </p>
          </div>
        </div>
        <img src={increaseProductivity} className="sloggerSectionImg" />
      </div>
      <div className="sloggerSections">
        <img src={family} className="sloggerSectionImgReverse" />
        <div className="sloggerSectionParaBoxReverse">
          <p className="sloggerSectionHeadReverse">
            We value your
            <br />
            <span>Quality Time</span>
          </p>
          <div className="sloggerSectionParaReverse">
            <p>
              {/* <span>
                <ArrowRightIcon className="sloggerSectionParaIcon" />
              </span> */}
              Everyone should make time to spend time with the ones they love.
              Having time is a privilege and should never be taken for granted,
            </p>
            <p>
              {" "}
              {/* <span>
                <ArrowRightIcon className="sloggerSectionParaIcon" />
              </span> */}
              So spend your time wisely and cherish the quality moments in your
              life with family, and friends, because you never know when your
              time may run out.
            </p>{" "}
            <p>
              {" "}
              {/* <span>
                <ArrowRightIcon className="sloggerSectionParaIcon" />
              </span> */}
              Organize your work with Slogger and saves your time for others.
              With Slogger we guarantee you to save one day every week.
            </p>{" "}
            <Button
              className="bannerBtn familyBtn"
              onClick={
                currentUser != null
                  ? () => history.push("/home")
                  : () => history.push("/signup")
              }
            >
              {currentUser != null ? "Go to Dashboard" : "Start saving now"}
            </Button>
          </div>
        </div>
      </div>
      <div className="freeSection">
        <p className="andIts">And it's</p>
        <p className="free">Free</p>
      </div>
      <div className="contactSection">
        <p>Want to collaborate ?</p>
        <p>We would like to talk with you</p>
        <Button
          className="bannerBtn contactBtn"
          onClick={() => history.push("/contactUs")}
        >
          Let's CatchUp
        </Button>
        <img src={standout} className="contactSectionImg" />
      </div>

      <div className="footerContainer">
        <span
          style={{ marginLeft: "15%", fontSize: "1rem", cursor: "pointer" }}
        >
          Questions? Mail us
          <br />
        </span>
        <span
          style={{
            marginLeft: "15%",
            fontSize: "1.2rem",
            cursor: "pointer",
            color: "rgb(70, 70, 70)",
          }}
        >
          withslogger@gmail.com
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
