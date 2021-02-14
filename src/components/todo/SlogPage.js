import {
  Button,
  useMediaQuery,
  useTheme,
  AppBar,
  Tab,
  Tabs,
  makeStyles,
} from "@material-ui/core";
import React, { useState } from "react";
import styled from "styled-components";
import { generateMedia } from "styled-media-query";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
import newsPhoto from "../../assets/images/signUpMainLogo.png";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import "./style.css";
import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    color: "rgb(2, 95, 64)",
    background: "rgba(4, 219, 148)",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:hover": {
      backgroundColor: green,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: green,
      },
    },
  },
}))(MenuItem);

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
  },
  indicator: {
    backgroundColor: "rgb(5, 185, 125)",
    height: 3,
    borderRadius: "7px",
    width: "10.2rem",
  },
  label: {
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "0.8rem",
    // lineHeight: "2.3rem",
    color: "#565656",
    textTransform: "uppercase",
    // padding: "1.8rem 4.2rem",
    padding: "0.3rem",
  },
  flexContainer: {
    borderBottom: "2px solid rgba(196, 196, 196, 0.5)",
  },
}));

function SlogPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [newsList, setNewsList] = useState([]);
  const [searchedLocation, setSearchedLocation] = useState({});
  const [time, setTime] = useState(0);
  const [timeOn, setTimeOn] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("md"));
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const { currentUser } = useAuth();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSource = (x) => {
    console.log(x);
    handleClose();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmitEnterWeather = async (event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      fetch(`
      http://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&APPID=a1cefd4ba7c137e4c484e6a95d51aebe`)
        .then((res) => res.json())
        .then((data) => setSearchedLocation(data))
        .then((data) => console.log(data));

      setLocation("");

      db.collection("users")
        .doc(currentUser.uid)
        .collection("location")
        .onSnapshot((snapshot) => {
          const loc = snapshot.docs.map((doc) => ({
            id: doc.id,
          }));
          console.log(loc);

          db.collection("users")
            .doc(currentUser.uid)
            .collection("location")
            .doc(loc[0].id)
            .set(
              {
                userLocation: location,
              },
              { merge: true }
            );
        });
    }
  };

  const getWeather = async () => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("location")
      .onSnapshot((snapshot) => {
        const loc = snapshot.docs.map((doc) => ({
          l: doc.data().userLocation,
        }));
        console.log(loc);

        fetch(`
        http://api.openweathermap.org/data/2.5/weather?q=${loc[0].l}&units=metric&APPID=a1cefd4ba7c137e4c484e6a95d51aebe`)
          .then((res) => res.json())
          .then((data) => setSearchedLocation(data))
          .then((data) => console.log(data));

        setLocation("");
      });
  };

  const handleSubmitEnter = async (event) => {
    if (event.code === "Enter" || event.code === "NumpadEnter") {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    if (searchTerm === "") {
      getNews();
    } else {
      fetch(`
      https://newsapi.org/v2/everything?q=${searchTerm}&apiKey=5d28c193ee5846a3a06ba7b1ceb2f3ab`)
        .then((res) => res.json())
        .then((data) => setNewsList(data?.articles))
        .then((data) => console.log(data?.articles));

      setSearchTerm("");
    }
  };

  const getNews = async () => {
    fetch(`
    https://newsapi.org/v2/top-headlines?country=in&pageSize=100&apiKey=5d28c193ee5846a3a06ba7b1ceb2f3ab`)
      .then((res) => res.json())
      .then((data) => setNewsList(data?.articles))
      .then((data) => console.log(data?.articles));

    setSearchTerm("");
  };

  React.useEffect(() => {
    getNews();
    getWeather();
  }, []);

  React.useEffect(() => {
    let interval = null;
    if (timeOn) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timeOn]);

  return !isSmall ? (
    <div>
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
            label="NEWS / SEARCH"
            {...a11yProps(0)}
          />
          <Tab
            className={classes.label}
            label="WEATHER / SW"
            {...a11yProps(1)}
          />
        </Tabs>
        <TabPanel
          value={value}
          index={0}
          style={{ width: "100%", overflow: "hidden", marginBottom: "1.5rem" }}
        >
          <div
            style={{ width: "100%", height: "65vh", overflow: "hidden" }}
            className="slogPageRes"
          >
            <SearchContainer>
              <input
                value={searchTerm}
                type="text"
                style={{
                  flex: "0.7",
                  border: "none",
                  background: "none",
                  padding: "0 0.5rem",
                  height: "2rem",
                  outline: "none",
                  borderBottom: "2px solid rgb(5, 185, 125)",
                  margin: "0 0.5rem",
                  color: "rgb(3, 185, 124)",
                  fontSize: "1rem",
                }}
                onKeyDown={(e) => handleSubmitEnter(e)}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search anything..."
              />
              <Button
                style={{
                  background: "rgb(5, 185, 125)",
                  flex: "0.3",
                  color: "#fff",
                  height: "2rem",
                  marginRight: "0.5rem",
                  overflow: "hidden",
                }}
                onClick={handleSearch}
              >
                Search
              </Button>
            </SearchContainer>
            <NewsContainer style={{ padding: 0, margin: 0 }}>
              {newsList?.map((news) => (
                <NewsBox>
                  <img src={news.urlToImage ? news.urlToImage : newsPhoto} />
                  <p>{news.title}</p>
                  <a
                    href={news.url}
                    target="_blank"
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      style={{
                        background: "rgb(5, 185, 125, 0.55)",
                        color: "#fff",
                        width: "100%",
                      }}
                    >
                      read more
                    </Button>
                  </a>
                </NewsBox>
              ))}
              <div style={{ height: "5rem", width: "100%" }}></div>
            </NewsContainer>
          </div>
        </TabPanel>
        <TabPanel
          value={value}
          index={1}
          style={{ width: "100%", overflow: "hidden", marginBottom: "1.5rem" }}
        >
          <div
            style={{ width: "100%", height: "65vh", overflow: "hidden" }}
            className="slogPageRes"
          >
            <WeatherContainer>
              <SearchContainer
                style={{
                  width: "70%",
                  height: "2rem",
                  background: "none",
                }}
              >
                <input
                  value={location}
                  type="text"
                  style={{
                    flex: "1",
                    border: "none",
                    background: "none",
                    padding: "0 0.5rem",
                    height: "1rem",
                    outline: "none",
                    borderBottom: "2px solid rgb(5, 185, 125)",
                    margin: "0 0.5rem",
                    color: "rgb(3, 185, 124)",
                    fontSize: "0.7rem",
                  }}
                  onKeyDown={(e) => handleSubmitEnterWeather(e)}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Type city and press enter..."
                />
              </SearchContainer>
              <h2
                style={{ color: "rgb(18, 107, 77)", fontFamily: "sans-serif" }}
              >
                {searchedLocation.name},{searchedLocation.sys?.country}
              </h2>
              <div
                style={{
                  margin: "1rem 0",
                  height: "3rem",
                  width: "7rem",
                  background: "rgb(3, 148, 99)",
                  borderRadius: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderBottom: "3px solid rgb(18, 107, 77)",
                  borderRight: "3px solid rgb(18, 107, 77)",
                }}
              >
                <h1 style={{ color: "#fff", fontFamily: "sans-serif" }}>
                  {Math.round(searchedLocation.main?.temp)}
                  <sup>o</sup>C
                </h1>
              </div>
              <h4
                style={{ color: "rgb(3, 148, 99)", fontFamily: "sans-serif" }}
              >
                {`Feels like: ${searchedLocation.main?.feels_like}`}
                <sup>o</sup>C
              </h4>
              <h4
                style={{
                  color: "rgb(3, 148, 99)",
                  fontFamily: "sans-serif",
                  marginTop: "1rem",
                }}
              >
                {searchedLocation?.weather
                  ? searchedLocation?.weather[0].description?.toUpperCase()
                  : ""}
              </h4>
            </WeatherContainer>
            <StopWatch
              style={{
                marginTop: "-7rem",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: 0,
              }}
            >
              <div className={timeOn ? "stopWatchBoxStart" : "stopWatchBox"}>
                <span className="time">
                  {("0" + Math.floor((time / 3600000) % 60)).slice(-2)}:
                </span>
                <span className="time">
                  {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
                </span>
                <span className="time">
                  {("0" + Math.floor((time / 1000) % 60)).slice(-2)}:
                </span>
                <span className="time">
                  {("0" + ((time / 10) % 100)).slice(-2)}
                </span>
              </div>
              <div
                className="startStop"
                style={{
                  display: "flex",
                  marginTop: "1rem",
                }}
              >
                {!timeOn && time === 0 && (
                  <Button className="timeBtn" onClick={() => setTimeOn(true)}>
                    Start
                  </Button>
                )}
                {timeOn && (
                  <Button className="timeBtn" onClick={() => setTimeOn(false)}>
                    Stop
                  </Button>
                )}
                {!timeOn && time !== 0 && (
                  <Button className="timeBtn" onClick={() => setTimeOn(true)}>
                    Resume
                  </Button>
                )}
                {!timeOn && time > 0 && (
                  <Button className="timeBtn" onClick={() => setTime(0)}>
                    Reset
                  </Button>
                )}
              </div>
            </StopWatch>
          </div>
        </TabPanel>
      </AppBar>
    </div>
  ) : (
    <SlogContainer>
      <SlogLeftContainer>
        <SearchContainer>
          <input
            value={searchTerm}
            type="text"
            style={{
              flex: "0.8",
              border: "none",
              background: "none",
              padding: "0 0.5rem",
              height: "2rem",
              outline: "none",
              borderBottom: "2px solid rgb(5, 185, 125)",
              margin: "0 0.5rem",
              color: "rgb(3, 185, 124)",
              fontSize: "1rem",
            }}
            onKeyDown={(e) => handleSubmitEnter(e)}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search anything..."
          />
          <Button
            style={{
              background: "rgb(5, 185, 125)",
              flex: "0.2",
              color: "#fff",
              height: "2rem",
              marginRight: "0.5rem",
              overflow: "hidden",
            }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </SearchContainer>
        <NewsContainer>
          {newsList?.map((news) => (
            <NewsBox>
              <img src={news.urlToImage ? news.urlToImage : newsPhoto} />
              <p>{news.title}</p>
              <a
                href={news.url}
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <Button
                  style={{
                    background: "rgb(5, 185, 125, 0.55)",
                    color: "#fff",
                    width: "100%",
                  }}
                >
                  read more
                </Button>
              </a>
            </NewsBox>
          ))}
        </NewsContainer>
      </SlogLeftContainer>
      <SlogRightContainer>
        <WeatherContainer>
          <SearchContainer
            style={{
              width: "70%",
              height: "2rem",
              background: "none",
            }}
          >
            <input
              value={location}
              type="text"
              style={{
                flex: "1",
                border: "none",
                background: "none",
                padding: "0 0.5rem",
                height: "1rem",
                outline: "none",
                borderBottom: "2px solid rgb(5, 185, 125)",
                margin: "0 0.5rem",
                color: "rgb(3, 185, 124)",
                fontSize: "0.7rem",
              }}
              onKeyDown={(e) => handleSubmitEnterWeather(e)}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Type city and press enter..."
            />
          </SearchContainer>
          <h2 style={{ color: "rgb(18, 107, 77)", fontFamily: "sans-serif" }}>
            {searchedLocation.name},{searchedLocation.sys?.country}
          </h2>
          <div
            style={{
              margin: "1rem 0",
              height: "3rem",
              width: "7rem",
              background: "rgb(3, 148, 99)",
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderBottom: "3px solid rgb(18, 107, 77)",
              borderRight: "3px solid rgb(18, 107, 77)",
            }}
          >
            <h1 style={{ color: "#fff", fontFamily: "sans-serif" }}>
              {Math.round(searchedLocation.main?.temp)}
              <sup>o</sup>C
            </h1>
          </div>
          <h4 style={{ color: "rgb(3, 148, 99)", fontFamily: "sans-serif" }}>
            {`Feels like: ${searchedLocation.main?.feels_like}`}
            <sup>o</sup>C
          </h4>
          <h4
            style={{
              color: "rgb(3, 148, 99)",
              fontFamily: "sans-serif",
              marginTop: "1rem",
            }}
          >
            {searchedLocation?.weather
              ? searchedLocation?.weather[0].description?.toUpperCase()
              : ""}
          </h4>
        </WeatherContainer>
        <StopWatch>
          <div className={timeOn ? "stopWatchBoxStart" : "stopWatchBox"}>
            <span className="time">
              {("0" + Math.floor((time / 3600000) % 60)).slice(-2)}:
            </span>
            <span className="time">
              {("0" + Math.floor((time / 60000) % 60)).slice(-2)}:
            </span>
            <span className="time">
              {("0" + Math.floor((time / 1000) % 60)).slice(-2)}:
            </span>
            <span className="time">
              {("0" + ((time / 10) % 100)).slice(-2)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "1rem",
            }}
          >
            {!timeOn && time === 0 && (
              <Button className="timeBtn" onClick={() => setTimeOn(true)}>
                Start
              </Button>
            )}
            {timeOn && (
              <Button className="timeBtn" onClick={() => setTimeOn(false)}>
                Stop
              </Button>
            )}
            {!timeOn && time !== 0 && (
              <Button className="timeBtn" onClick={() => setTimeOn(true)}>
                Resume
              </Button>
            )}
            {!timeOn && time > 0 && (
              <Button className="timeBtn" onClick={() => setTime(0)}>
                Reset
              </Button>
            )}
          </div>
        </StopWatch>
      </SlogRightContainer>
    </SlogContainer>
  );
}

export default SlogPage;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "740px",
});

const SlogContainer = styled.div`
  width: 98.5%;
  height: 87%;
  position: absolute;
  display: flex;
  overflow: hidden;
`;
const SlogLeftContainer = styled.div`
  flex: 0.6;
  height: 100%;
  width: 100%;
  border-right: 2px solid rgba(0, 141, 94, 0.295);
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  padding-bottom: 2rem;

  ${customMedia.lessThan("tablet")`
flex: 0.45;
       padding: 0rem;
       margin:0;
       border:none;
  `};

  input::placeholder {
    color: rgb(3, 185, 124);
    font-size: 1rem;
    ${customMedia.lessThan("tablet")`
      font-size:0.7rem;
    `};
  }
`;

const SearchContainer = styled.div`
  display: flex;
  background-color: rgba(5, 185, 125, 0.281);
  border-radius: 10px;
  width: 100%;
  align-items: center;
  height: 3.5rem;
  margin-bottom: 0.5rem;
  overflow: hidden;

  .menu {
    color: rgba(5, 185, 125) !important;

    &:hover {
      color: rgba(5, 185, 125) !important;
    }
  }
`;

const NewsContainer = styled.div`
  padding: 1rem;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  display: grid;
  grid-template-columns: 6fr 6fr;
`;

const NewsBox = styled.div`
  margin: 1rem;
  border-radius: 5px;
  box-shadow: 3px 3px 5px lightgreen, -0.5px -0.5px 3px lightgreen;
  width: 18rem;
  min-height: 19rem;
  height: auto;
  padding: 0.2rem;
  display: flex;
  flex-direction: column;

  img {
    object-fit: cover;
    flex: 0.5;
    border-radius: 5px;
  }
  p {
    flex: 0.5;
    font-weight: 600;
    margin: 1rem;
  }
`;
const SlogRightContainer = styled.div`
  flex: 0.4;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  overflow: hidden;

  ${customMedia.lessThan("tablet")`
flex: 0.45;
       padding: 0rem;
       margin:0;
       border:none;
  `};

  input::placeholder {
    color: rgb(3, 185, 124);
    font-size: 0.7rem;
    ${customMedia.lessThan("tablet")`
      font-size:0.7rem;
    `};
  }
`;
const WeatherContainer = styled.div`
  flex: 0.5;
  border-bottom: 2px solid rgba(0, 141, 94, 0.295);
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const StopWatch = styled.div`
  flex: 0.5;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  padding: 1rem;
  overflow: hidden;
`;
