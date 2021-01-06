import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styled from "styled-components";
import navIcon from "../../assets/images/navIcon.png";
import { generateMedia } from "styled-media-query";

function NavBar() {
  const [sup, setSup] = useState("");
  const { currentUser, logOut } = useAuth();
  const history = useHistory();

  const handleSignOut = async () => {
    await logOut();
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
  return (
    <NavBarContainer>
      <NavBarStartIcon>
        <img src={navIcon} className="navIcon" alt="SLOGGER" />
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
        <Button onClick={() => handleSignOut()}>Log Out</Button>
      </NavBarEndContainer>
    </NavBarContainer>
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
  background: #fff;
  backdrop-filter: blur(0.3px);
  -webkit-backdrop-filter: blur(0.3px);

  box-shadow: 0px 5px 5px rgb(0, 85, 57);
`;
const NavBarStartIcon = styled.div`
  flex: 0.2;
  display: flex;
  align-items: center;
  .navIcon {
    width: 10rem;
    height: 2.5rem;
    padding: 1.5rem;
    object-fit: contain;

    ${customMedia.lessThan("smTablet")`
      width: 6rem;
    height: 2rem;
    padding:0;
    padding-left: 0.5rem;

    `};
  }
  ${customMedia.lessThan("smTablet")`
        flex: 0.3;
    `};
  .navLogoRightLine {
    background-color: rgb(5, 185, 125);
    outline: none;
    border: none;
    width: 2px;
    height: 3rem;
    margin: 1rem;
    transform: scale(0.7);
  }
`;
const NavLinksContainer = styled.div`
  flex: 0.6;
  ${customMedia.lessThan("smTablet")`
        flex: 0.4;
    `};
`;
const NavBarDateBox = styled.div`
  color: rgba(0, 128, 85, 0.568);
  font-family: "Bebas Neue", cursive;
  font-size: 0.9rem;
  ${customMedia.lessThan("smTablet")`
         font-size: 0.5rem;
    `};
  span {
    color: rgb(0, 128, 85) !important;
    font-size: 2rem;
    ${customMedia.lessThan("smTablet")`
         font-size: 1.1rem;
    `};
  }
  sup {
    font-size: 1rem !important;
    ${customMedia.lessThan("smTablet")`
         font-size: 0.5rem !important;
    `};
  }
`;
const NavBarEndContainer = styled.div`
  flex: 0.2;
  display: flex;
  justify-content: flex-end;
  ${customMedia.lessThan("smTablet")`
        flex: 0.3;
    `};

  Button {
    margin: 0 1.5rem;
    background-color: rgb(5, 185, 125);
    border: 2px solid rgb(5, 185, 125);
    color: #fff;
    font-weight: 600;
    transition: all 0.5s ease-in-out;
    border-radius: 2rem;
    font-size: 0.65rem;
    &:hover {
      background-color: #fff;
      color: rgb(5, 185, 125);
      border: 2px solid rgb(5, 185, 125);
    }
    ${customMedia.lessThan("smTablet")`
         font-size: 0.55rem;
    `};
  }
`;
