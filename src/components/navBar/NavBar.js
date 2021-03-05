import { Button, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styled from "styled-components";
import navIcon from "../../assets/images/navIcon.png";
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
        {/* <img src={navIcon} className="navIcon" alt="SLOGGER" /> */}
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
          <Button onClick={() => history.push("/home")}>home</Button>
        ) : (
          <Button onClick={() => history.push("/help")}>help</Button>
        )}

        <Button onClick={() => handleSignOut()}>Log Out</Button>
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
            <Button onClick={() => history.push("/help")}>help</Button>
            <Button onClick={() => handleSignOut()}>log out</Button>
          </>
        ) : (
          <>
            <Button onClick={() => history.push("/help")}>help</Button>
            <Button onClick={() => handleSignup()}>sign up</Button>
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
  smTablet: "740px",
});

const NavBarContainer = styled.div`
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
  background: rgba(0, 145, 96, 0.3);
  backdrop-filter: blur(0.3px);
  -webkit-backdrop-filter: blur(0.3px);
  /* box-shadow: 0px 5px 5px rgb(0, 85, 57); */

  h1 {
    margin-left: 1.9rem;
    color: rgb(1, 63, 42);
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
    margin-left: 2rem;
    color: #272142;
    ${customMedia.lessThan("smTablet")`
      margin-left: 0.5rem;
    `};
  }
`;

const NavBar0StartIcon = styled.div`
  flex: 0.2;
  display: flex;
  align-items: center;
  cursor: pointer;

  ${customMedia.lessThan("smTablet")`
        flex: 0.5;
    `};
`;
const NavBarStartIcon = styled.div`
  flex: 0.2;
  display: flex;
  align-items: center;
  cursor: pointer;
  .navIcon {
    width: 10rem;
    height: 2.5rem;
    padding: 1.5rem;
    padding-left: 1.3rem;
    object-fit: contain;

    ${customMedia.lessThan("smTablet")`
      width: 6rem;
      height: 2rem;
      padding:0;
      padding-left: 0.5rem;
      
    `};
  }
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
  flex: 0.75;
  ${customMedia.lessThan("smTablet")`
        flex: 0.25;
    `};
`;
const NavBarDateBox = styled.div`
  color: rgb(1, 63, 42, 0.7);
  font-family: "Bebas Neue", cursive;
  font-size: 0.9rem;
  ${customMedia.lessThan("smTablet")`
         font-size: 0.4rem;
    `};
  span {
    color: rgb(1, 63, 42) !important;
    font-size: 2rem;
    ${customMedia.lessThan("smTablet")`
         font-size: 1rem;
    `};
  }
  sup {
    font-size: 1rem !important;
    ${customMedia.lessThan("smTablet")`
         font-size: 0.4rem !important;
    `};
  }
`;
const NavBarEndContainer = styled.div`
  flex: 0.3;
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
    font-weight: 600;
    transition: all 0.5s ease-in-out;
    border-radius: 0.5rem;
    font-size: 0.65rem;
    &:hover {
      background-color: #fff;
      color: rgb(5, 185, 125);
    }
    ${customMedia.lessThan("smTablet")`
         font-size: 0.55rem;
         margin-right: 0.2rem;
         padding:0.2rem 0;
    `};
  }
`;
const NavBarEndContainer0Page = styled.div`
  flex: 0.3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${customMedia.lessThan("smTablet")`
        flex: 0.5;
    `};

  Button {
    margin-right: 2rem;
    background-color: transparent;
    border: 2px solid transparent;
    color: #272142;
    font-weight: 600;
    transition: all 0.5s ease-in-out;
    border-radius: 0.5rem;
    font-size: 0.85rem;
    &:hover {
      background-color: transparent;
      color: #272142;
      border: 2px solid #272142;
    }
    ${customMedia.lessThan("smTablet")`
         font-size: 0.55rem;
         margin-right: 0.5rem;
    `};
  }
`;
