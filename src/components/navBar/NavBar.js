import { Button, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styled from "styled-components";
import { generateMedia } from "styled-media-query";
import "../todo/heightMedia.css";

function NavBar({ page, home }) {
  const [sup, setSup] = useState("");
  const { currentUser, logOut } = useAuth();
  const history = useHistory();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));

  const handleSignOut = async () => {
    await logOut();
    history.push("/signUp");
  };
  const handleSignup = () => {
    history.push("/signUp");
  };

  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";
  useEffect(() => {
    let x = new Date().getDate();
    x = x % 10;
    if (x === 1) {
      setSup("st");
    } else if (x === 2) {
      setSup("nd");
    } else if (x == 3) {
      setSup("rd");
    } else {
      setSup("th");
    }
  }, []);
  return page === 1 ? (
    <NavBarContainer>
      <NavBarStartIcon onClick={() => history.push("/")}>
        <h1>SLOGGER</h1>
        <hr className="navLogoRightLine" />
      </NavBarStartIcon>
      <NavLinksContainer>
        <NavBarDateBox>
          <h2>
            {months[new Date().getMonth()]}{" "}
            <span>
              {new Date().getDate()}
              <sup>{sup}</sup>
            </span>
            {", "}
            {new Date().getFullYear()}
            {", "}&nbsp;<span>{weekday[new Date().getDay()]}</span>
          </h2>
        </NavBarDateBox>
      </NavLinksContainer>
      <NavBarEndContainer>
        {home ? (
          <Button
            disableFocusRipple
            disableRipple
            onClick={() => history.push("/home")}
          >
            home
          </Button>
        ) : (
          <Button
            disableFocusRipple
            disableRipple
            onClick={() => history.push("/help")}
          >
            help
          </Button>
        )}

        <Button
          disableFocusRipple
          disableRipple
          onClick={() => handleSignOut()}
        >
          Log Out
        </Button>
      </NavBarEndContainer>
    </NavBarContainer>
  ) : (
    <NavBarContainer0Page>
      <NavBar0StartIcon onClick={() => history.push("/")}>
        <h2>SLOGGER</h2>
      </NavBar0StartIcon>
      {isSmall ? <NavLinksContainer></NavLinksContainer> : ""}

      <NavBarEndContainer0Page>
        {currentUser !== null ? (
          <>
            <Button
              disableFocusRipple
              disableRipple
              onClick={() => history.push("/help")}
            >
              help
            </Button>
            <Button
              disableFocusRipple
              disableRipple
              onClick={() => handleSignOut()}
            >
              log out
            </Button>
          </>
        ) : (
          <>
            <Button
              disableFocusRipple
              disableRipple
              onClick={() => history.push("/help")}
            >
              help
            </Button>
            <Button
              disableFocusRipple
              disableRipple
              onClick={() => handleSignup()}
            >
              sign up
            </Button>
          </>
        )}
      </NavBarEndContainer0Page>
    </NavBarContainer0Page>
  );
}

export default NavBar;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "600px",
});

const NavBarContainer = styled.div`
  overflow: hidden;
  z-index: 100;
  display: flex;
  align-items: center;
  width: 100%;
  height: 2.5rem;
  top: 0rem;
  left: 0;
  position: fixed;
  margin-bottom: 0.5rem;
  color: #fff;
  background: rgba(0, 145, 96, 0.3);
  backdrop-filter: blur(0.3px);
  -webkit-backdrop-filter: blur(0.3px);
  /* box-shadow: 0px 5px 5px rgb(0, 85, 57); */

  h1 {
    font-size: 1.2rem;
    margin-left: 1rem;
    color: rgb(1, 63, 42);
    font-family: "Shadows Into Light", cursive;
    ${customMedia.lessThan("smTablet")`
      margin-left: 1.2rem !important;
      font-size:15px !important;
    `};
  }
`;

const NavBarContainer0Page = styled.div`
  overflow: hidden;
  z-index: 100;
  display: flex;
  align-items: center;
  width: 100%;
  height: 3rem;
  top: 0rem;
  left: 0;
  position: fixed;
  margin-bottom: 0.5rem;
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;

  h2 {
    font-size: 1.2rem;
    margin-left: 2rem;
    color: #272142;
    font-family: "Shadows Into Light", cursive;
    ${customMedia.lessThan("smTablet")`
      margin-left: 0.5rem;
    `};
  }
`;

const NavBar0StartIcon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  ${customMedia.lessThan("smTablet")`
        flex: 0.5;
    `};
`;
const NavBarStartIcon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  ${customMedia.lessThan("smTablet")`
        flex: 0.4;
    `};
  .navLogoRightLine {
    background-color: #272142;
    outline: none;
    border: none;
    width: 2px;
    height: 3rem;
    margin: 1rem;
    transform: scale(0.7);
    ${customMedia.lessThan("smTablet")`
       display:none;
    `};
  }
`;
const NavLinksContainer = styled.div`
  flex: 1;
  ${customMedia.lessThan("smTablet")`
        flex: 0.25;
    `};
`;
const NavBarDateBox = styled.div`
  color: rgb(1, 63, 42, 0.7);
  font-family: "Bebas Neue", cursive;
  font-size: 0.7rem;
  ${customMedia.lessThan("smTablet")`
         font-size: 0.4rem;
    `};
  span {
    color: rgb(1, 63, 42) !important;
    font-size: 0.9rem;
    ${customMedia.lessThan("smTablet")`
         font-size: 1rem;
    `};
  }
  sup {
    font-size: 0.7rem !important;
    ${customMedia.lessThan("smTablet")`
         font-size: 0.4rem !important;
    `};
  }
`;
const NavBarEndContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${customMedia.lessThan("smTablet")`
        flex: 0.4;
        
    `};

  Button {
    margin-right: 1rem;
    background-color: rgb(1, 63, 42, 0.3);
    color: #fff;
    transition: all 0.3s ease-in-out;
    font-size: 0.55rem;
    &:hover {
      background-color: #fff;
      color: rgb(5, 185, 125);
    }
    ${customMedia.lessThan("smTablet")`
         margin-right: 0.2rem;
         padding:0.2rem 0;
    `};
  }
`;
const NavBarEndContainer0Page = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${customMedia.lessThan("smTablet")`
        flex: 0.5;
    `};

  Button {
    margin-right: 2rem;
    background-color: transparent;
    border: 1px solid transparent;
    color: #272142;
    transition: all 0.3s ease-in-out;
    font-size: 0.7rem;
    &:hover {
      background-color: transparent;
      color: #272142;
      border: 1px solid #272142;
    }
    ${customMedia.lessThan("smTablet")`
         margin-right: 0.5rem;
    `};
  }
`;
