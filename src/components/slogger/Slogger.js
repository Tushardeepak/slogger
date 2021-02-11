import React from "react";
import NavBar from "../navBar/NavBar";
import { generateMedia } from "styled-media-query";
import styled from "styled-components";
import homePageIcon from "../../assets/images/homeBannerIcon.png";
import homeBannerVideo from "../../assets/videos/HomeBannerVideo.mp4";
import quesVideo from "../../assets/videos/quesVideo.mp4";
import personalTodoImg from "../../assets/images/personalTodoImg.svg";
import newsImg from "../../assets/images/newsImg.svg";
import teamTodoImg from "../../assets/images/teamTodoImg.svg";
import { Button } from "@material-ui/core";
import "./style.css";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Slogger() {
  const history = useHistory();
  const { currentUser } = useAuth();
  return (
    <div style={{ height: "auto" }}>
      <NavBar page={0} />
      <Banner>
        <video autoPlay loop muted className="video">
          <source src={homeBannerVideo} type="video/mp4"></source>
        </video>
        <img src={homePageIcon} />
        <Button
          onClick={
            currentUser != null
              ? () => history.push("/")
              : () => history.push("/signup")
          }
        >
          {currentUser != null ? "Go to Dashboard" : "Get started"}
        </Button>
      </Banner>
      <div className="questionContainer">
        <div className="questionBox">
          <div className="questionVideo">
            <video autoPlay loop muted className="quesVideo">
              <source src={quesVideo} type="video/mp4"></source>
            </video>
          </div>
          <div className="questionInner">
            <h1 className="t1">Can't manage your time?</h1>
            <h1 className="t2">Having trouble in Team Management ?</h1>
            <h1 className="t3">Don't know how to use complex technologies ?</h1>
          </div>
        </div>
      </div>
      <div className="weGotYou">
        <h1>Personal Section</h1>
        <hr></hr>
      </div>
      <div className="personalTodoSection">
        <div className="personalTodoTextBox">
          <h1 className="t1">1) Make your own todo list</h1>
          <h1 className="t2">2) Filter those which are completed</h1>
          <h1 className="t3">3) Get a visual representation of your work</h1>
        </div>
        <img src={personalTodoImg} className="personalTodoImg" />
      </div>
      <div
        style={{
          background: "rgb(27,0,147,0.8)",
          // background:
          //   "linear-gradient(43deg, rgba(27,0,147,1) 0%, rgba(39,33,66,1) 100%)",
        }}
      >
        <div className="weGotYou">
          <h1 style={{ color: "#fff" }}>Team Section</h1>
          <hr style={{ background: "#fff" }}></hr>
        </div>

        <div className="teamTodoSection">
          <img src={teamTodoImg} className="teamTodoImg" />
          <div className="teamTodoTextBox">
            <h1 style={{ color: "#fff" }}>1) Make your own teams</h1>
            <h1 style={{ color: "#fff" }}>2) Join teams</h1>
            <h1 style={{ color: "#fff" }}>3) Assign work to teammates</h1>
            <h1 style={{ color: "#fff" }}>4) Check when the work is done</h1>
            <h1 style={{ color: "#fff" }}>5) Add images to any work</h1>
          </div>
        </div>
      </div>
      <div className="weGotYou">
        <h1>Slog Section</h1>
        <hr></hr>
      </div>

      <div className="slogSection">
        <div className="slogTodoTextBox">
          <h1 className="t1">1) Get latest news</h1>
          <h1 className="t2">2) Get links of the original site</h1>
          <h1 className="t3">3) Search news on any topic</h1>
          <h1 className="t3">4) Get weather report of any location</h1>
          <h1 className="t3">5) Stopwatch </h1>
        </div>
        <img src={newsImg} className="teamTodoImg" />
      </div>
      <FooterContainer>
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
      </FooterContainer>
    </div>
  );
}

export default Slogger;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "740px",
});

const Banner = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .video {
    position: absolute;
    object-fit: cover;
    width: 100%;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: -1;
    opacity: 0.2;
  }

  img {
    object-fit: contain;
    width: 50%;
    height: 50%;
    ${customMedia.lessThan("smTablet")`
   width: 80%;
    height: 80%;
    margin-top:-5rem;
  `}
  }

  Button {
    margin: 0.5rem;
    background-color: #272142;
    color: #fff;
    font-weight: 600;
    padding: 0.5rem 2rem;
    font-size: 1rem;
    border: 2px solid #272142;
    transition: all 0.5s ease-in-out;
    &:hover {
      background-color: transparent;
      color: #272142;
      border: 2px solid #272142;
    }
    ${customMedia.lessThan("smTablet")`
   margin-top:-5rem;
  `}
  }
`;

const FooterContainer = styled.div`
  padding-top: 2rem;
  padding-bottom: 4rem;
  color: #999;
  position: relative;

  span {
    ${customMedia.lessThan("tablet")`
       font-size:0.8rem !important;
    `}
  }

  ${customMedia.lessThan("tablet")`
    padding-top: 3rem;
    padding-bottom: 3rem;
    `}

  li {
    text-decoration: none;
    list-style: none;
    line-height: 2.5;
    cursor: pointer;
  }
  .footerColumn li:hover {
    color: #999;
  }
  a {
    text-decoration: none;
    color: #999;
  }

  .footerColumn {
    width: 70%;
    margin: 1rem auto 0;
    font-size: 0.9rem;
    overflow: auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);

    ${customMedia.lessThan("tablet")`
      width: 80%;
      margin: 0.7rem auto 0;
      font-size: 0.7rem;
      grid-template-columns: repeat(2, 1fr);
    `}
  }
`;
