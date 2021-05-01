import { AppBar, Box, Button, makeStyles, Tab, Tabs } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import BoardSection from "./BoardSection";
import selectTeam from "../../assets/images/selectTeam.svg";
import Timeline from "./Timeline";
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
    overflow: "hidden",
  },
  AppBar: {
    backgroundColor: "transparent !important",
    boxShadow: "none",
    color: "#000",
    marginTop: "-1rem",
    paddingTop: "0.5rem",
    maxWidth: "20rem",
  },
  Tabs: {
    display: "flex",
    justifyContent: "center",
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

function Board({ urlTeamName, userName, setTabValue, profileImage }) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return urlTeamName === undefined ? (
    <div
      style={{
        height: "89%",
        width: "100%",
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <img src={selectTeam} style={{ height: "10rem", width: "10rem" }} />

      <Button
        className="uploadView"
        style={{
          marginTop: "1rem",
          fontSize: "0.65rem",
          height: "1.2rem",
          color: "#fff",
          backgroundColor: "rgb(5, 185, 125,0.9)",
          marginBottom: "0.2rem",
          textTransform: "none",
        }}
        onClick={() => setTabValue(1)}
      >
        Select a team to view
      </Button>
    </div>
  ) : (
    <BoardContainer>
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
          <Tab className={classes.label} label="PLAN" {...a11yProps(0)} />
          <Tab className={classes.label} label="TIMELINE" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel
        style={{
          width: "100%",
          marginBottom: "0.5rem",
        }}
        value={value}
        index={0}
      >
        <BoardSection
          urlTeamName={urlTeamName}
          userName={userName}
          profileImage={profileImage}
          setTabValue={setTabValue}
        />
      </TabPanel>
      <TabPanel
        style={{
          width: "100%",
          marginBottom: "0.5rem",
        }}
        value={value}
        index={1}
      >
        <Timeline
          urlTeamName={urlTeamName}
          userName={userName}
          profileImage={profileImage}
          setTabValue={setTabValue}
        />
      </TabPanel>
    </BoardContainer>
  );
}

export default Board;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "820px",
  smTablet: "600px",
});

const BoardContainer = styled.div`
  width: 100%;
  height: 89%;
  position: absolute;
  overflow: "hidden";
  ${customMedia.lessThan("tablet")`
      overflow-x:scroll;
    `};
`;
