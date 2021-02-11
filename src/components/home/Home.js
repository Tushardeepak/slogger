import {
  AppBar,
  Button,
  makeStyles,
  Paper,
  Tab,
  Tabs,
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
import SlogPage from "../todo/SlogPage";
import { generateMedia } from "styled-media-query";

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
  },
  Tabs: {
    display: "flex",
    justifyContent: "space-between",
  },
  indicator: {
    backgroundColor: "rgb(5, 185, 125)",
    height: 6,
    borderRadius: "7px",
    width: "10.2rem",
  },
  label: {
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "0.9rem",
    // lineHeight: "2.3rem",
    color: "#565656",
    textTransform: "uppercase",
    // padding: "1.8rem 4.2rem",
    padding: "0.5rem",
  },
  flexContainer: {
    borderBottom: "4px solid rgba(196, 196, 196, 0.5)",
  },
}));

function Home(props) {
  const { currentUser, logOut } = useAuth();
  const history = useHistory();

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <HomeContainer>
        <NavBar style={{ position: "fixed" }} page={1} />
        <Paper className="mainPaper" elevation={5}>
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
                label="PERSONAL"
                {...a11yProps(0)}
              />
              <Tab className={classes.label} label="TEAM" {...a11yProps(1)} />
              <Tab className={classes.label} label="SLOG" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel style={{ width: "100%" }} value={value} index={0}>
            <PersonalTodo />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TeamTodo UrlTeamName={props.match.params.teamName} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <SlogPage />
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
      </HomeContainer>
    </div>
  );
}

export default Home;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "740px",
});

const HomeContainer = styled.div`
  width: 100%;
  height: 100vh;
  background-color: rgb(5, 185, 125, 0.835);
  padding: 4rem 3.8%;
  padding-bottom: 1rem;
  overflow: hidden !important;

  .mainPaper {
    position: relative;
    width: 93%;
    height: 86%;
    border-radius: 20px;
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
