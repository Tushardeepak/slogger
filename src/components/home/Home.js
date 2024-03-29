import {
  AppBar,
  Button,
  makeStyles,
  Paper,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import NavBar from "../navBar/NavBar";
import styled from "styled-components";
import PersonalTodo from "../todo/PersonalTodo";
import TeamTodo from "../todo/TeamTodo";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import { generateMedia } from "styled-media-query";
import Discussion from "../todo/Discussion";
import { db } from "../../firebase";
import SnackBar from "../snackbar/SnackBar";
import Profile from "../profile/Profile";
import Board from "../board/Board";
import Notification from "../notification/Notification";

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
    height: "2rem",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  Tabs: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0rem",
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
    fontSize: "0.7rem",
    color: "#565656",
    textTransform: "uppercase",
  },
  flexContainer: {
    borderBottom: "3px solid rgba(196, 196, 196, 0.5)",
  },
}));

function Home(props) {
  const { currentUser, logOut } = useAuth();
  const history = useHistory();

  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [profileImage, setProfileImage] = React.useState("");
  const [greeting, setGreeting] = React.useState("");
  const [discussionLock, setDiscussionLock] = React.useState(true);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleSignOut = async () => {
    await logOut();
    history.push("/signUp");
  };

  React.useEffect(() => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("profile")
      .onSnapshot((snapshot) => {
        const profile = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          profileImage: doc.data().profileImage,
        }));
        profile.filter((p) => {
          if (p.name !== "") {
            setUserName(p.name);
            setProfileImage(p.profileImage);
            setOpen(true);
            setDiscussionLock(false);
          }
        });
      });
    // document.addEventListener("keydown", (event) => {
    //   if (event.ctrlKey) {
    //     if (c < 4) {
    //       ++c;
    //       setValue(c);
    //     } else {
    //       setValue(0);
    //       c = 0;
    //     }

    //     event.preventDefault();
    //   }
    // });
  }, []);
  var c = 0;

  React.useEffect(() => {
    var data = [
        [22, "Working late! "],
        [17, "Good evening! "],
        [12, "Good afternoon! "],
        [7, "Good morning! "],
        [4, "Whoa, early bird! "],
        [0, "Late night work! "],
      ],
      hr = new Date().getHours();
    for (var i = 0; i < data.length; i++) {
      if (hr >= data[i][0]) {
        setGreeting(data[i][1]);
        break;
      }
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <HomeContainer>
        {!isSmall ? (
          <div
            style={{
              width: "92%",
              height: "50px",
              color: "#fff",
              background: "rgba(0, 145, 96, 0.2)",
              paddingLeft: "15px",
              paddingRight: "15px",
              display: "flex",
              alignItems: "center",
              position: "static",
              boxShadow:
                "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px",
            }}
          >
            <Typography variant="h6" className={classes.title}>
              Slogger
            </Typography>
            <Notification setTabValue={setValue} />
            <Button
              autoFocus
              color="inherit"
              onClick={() => history.push("/help")}
            >
              Help
            </Button>
            <Button autoFocus color="inherit" onClick={() => handleSignOut()}>
              Log out
            </Button>
          </div>
        ) : (
          <NavBar
            style={{ position: "fixed" }}
            page={1}
            setTabValue={setValue}
          />
        )}

        <Paper className="mainPaper" elevation={5}>
          <AppBar className={classes.AppBar} position="static">
            <Tabs
              classes={{
                indicator: classes.indicator,
                flexContainer: classes.flexContainer,
                root: classes.Tabs,
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
                label={!isSmall ? "My" : "PERSONAL"}
                {...a11yProps(0)}
              />
              <Tab className={classes.label} label="TEAM" {...a11yProps(1)} />
              <Tab
                disabled={discussionLock}
                className={classes.label}
                label="BOARD"
                {...a11yProps(2)}
              />
              <Tab
                disabled={discussionLock}
                className={classes.label}
                label={!isSmall ? "Chat" : "DISCUSSION"}
                {...a11yProps(3)}
              />
              <Tab
                className={classes.label}
                label="Profile"
                {...a11yProps(4)}
              />
            </Tabs>
          </AppBar>
          <TabPanel style={{ width: "100%" }} value={value} index={0}>
            <PersonalTodo />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TeamTodo
              UrlTeamName={props.match.params.teamName}
              setDiscussionLock={setDiscussionLock}
              profileImage={profileImage}
              setTabValue={setValue}
              userName={userName}
            />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Board
              urlTeamName={props.match.params.teamName}
              userName={userName}
              profileImage={profileImage}
              setTabValue={setValue}
            />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Discussion
              UrlTeamName={props.match.params.teamName}
              userName={userName}
              profileImage={profileImage}
              setTabValue={setValue}
            />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <Profile />
          </TabPanel>
        </Paper>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="svgUp"
        >
          <path
            fill="#00cba9"
            fill-opacity="1"
            d="M0,288L40,282.7C80,277,160,267,240,250.7C320,235,400,213,480,197.3C560,181,640,171,720,154.7C800,139,880,117,960,122.7C1040,128,1120,160,1200,176C1280,192,1360,192,1400,192L1440,192L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
          ></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          className="svgDown"
        >
          <path
            fill="rgb(0, 80, 53)"
            fill-opacity="1"
            d="M0,96L14.1,96C28.2,96,56,96,85,112C112.9,128,141,160,169,160C197.6,160,226,128,254,128C282.4,128,311,160,339,149.3C367.1,139,395,85,424,80C451.8,75,480,117,508,144C536.5,171,565,181,593,176C621.2,171,649,149,678,170.7C705.9,192,734,256,762,234.7C790.6,213,819,107,847,106.7C875.3,107,904,213,932,234.7C960,256,988,192,1016,138.7C1044.7,85,1073,43,1101,37.3C1129.4,32,1158,64,1186,96C1214.1,128,1242,160,1271,186.7C1298.8,213,1327,235,1355,208C1383.5,181,1412,107,1426,69.3L1440,32L1440,320L1425.9,320C1411.8,320,1384,320,1355,320C1327.1,320,1299,320,1271,320C1242.4,320,1214,320,1186,320C1157.6,320,1129,320,1101,320C1072.9,320,1045,320,1016,320C988.2,320,960,320,932,320C903.5,320,875,320,847,320C818.8,320,791,320,762,320C734.1,320,706,320,678,320C649.4,320,621,320,593,320C564.7,320,536,320,508,320C480,320,452,320,424,320C395.3,320,367,320,339,320C310.6,320,282,320,254,320C225.9,320,198,320,169,320C141.2,320,113,320,85,320C56.5,320,28,320,14,320L0,320Z"
          ></path>
        </svg>
        {open && (
          <SnackBar
            open={open}
            handleClose={() => setOpen(false)}
            text={`${greeting} ${userName}`}
            home={true}
          />
        )}
      </HomeContainer>
    </div>
  );
}

export default Home;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "600px",
});

const HomeContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: rgb(5, 185, 125, 0.835);
  padding: 0rem 1rem;
  padding-top: 2.7rem;
  overflow: hidden !important;

  ${customMedia.lessThan("smTablet")`
      padding: 0;
    `};

  .mainPaper {
    overflow: hidden;
    position: absolute;
    width: 97.5%;
    height: 91%;
    border-radius: 15px;
    ${customMedia.lessThan("smTablet")`
    width: 100%;
    height: 100%;
    border-radius: 15px 15px 0 0;
    `};
  }

  .svgUp {
    display: block;
    position: absolute;
    top: 0rem;
    left: 0;
    transform: scale(1);
    z-index: -1;
  }
  .svgDown {
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    transform: scale(1);
    z-index: -1;
  }
`;
