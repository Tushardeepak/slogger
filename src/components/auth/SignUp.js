import { Button } from "@material-ui/core";
import React, { useState } from "react";
import styled from "styled-components";
import "./style.css";
import { generateMedia } from "styled-media-query";
import { useAuth } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import { db } from "../../firebase";
import signUpVideo from "../../assets/videos/Gaulois.mp4";
import signUpImage from "../../assets/images/signUpMainLogo.png";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import LockIcon from "@material-ui/icons/Lock";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CustomTooltip from "../CustomTooltip";
import signUpLoader from "../../assets/images/signUpLoader.gif";

function SignUp() {
  const [authToggle, setAuthToggle] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState("password");
  const [email, setEmail] = useState("");
  //const [firstName, setFirstName] = useState("");
  //const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);
  const { signUp, signIn, currentUser } = useAuth();
  const history = useHistory();

  const handleChange = (set, value) => {
    set(value);
    setError(false);
  };

  const handleSignUp = async () => {
    if (
      email === "" ||
      password === "" ||
      // firstName === "" ||
      confirmPassword === "" ||
      password !== confirmPassword
    ) {
      setError(true);
    } else {
      try {
        setLoader(true);
        const USER = await signUp(email, password);
        db.collection("users").doc(USER?.uid).collection("profile").add({
          email: email,
          // firstName: firstName,
          //lastName: lastName,
        });
        setLoader(false);
        history.push("/");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleSignIn = async () => {
    if (email === "" || password === "") {
      setError(true);
    } else {
      try {
        setLoader(true);
        await signIn(email, password);
        history.push("/");
        setLoader(false);
      } catch (error) {
        console.log(error);
        setLoader(false);
      }
    }
  };

  const toggleVisibility = () => {
    const _visibility = !visibility;
    setVisibility(_visibility);
    setPasswordVisibility(_visibility ? "text" : "password");
  };

  const handleAuthToggle = () => {
    setAuthToggle(!authToggle);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setError(false);
  };

  React.useEffect(() => {
    if (currentUser !== null) {
      history.push("/");
    }
  }, []);

  return (
    <SignUpContainer>
      {loader ? (
        <div className="loaderContainer">
          <img className="signUpLoader" src={signUpLoader} />
        </div>
      ) : (
        ""
      )}
      <video autoPlay loop muted className="signUpVideo">
        <source src={signUpVideo} type="video/mp4"></source>
      </video>
      <Alaric>
        <h1>
          HELLO, <br />I AM <span className="highlight">ALARIC </span>
          <br />
          WELCOME TO <span className="highlight">SLOGGER </span>
        </h1>
      </Alaric>
      {authToggle ? (
        <SignUpBox>
          <SignUpForm>
            <img src={signUpImage} />
            <div className="signUpFormBottom">
              <CustomTooltip
                title="Alaric : Enter your email."
                arrow
                placement="top"
              >
                <div className="inputFieldSignUp">
                  <AccountBoxIcon className="EmailAccount" />
                  <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    autoComplete="off"
                    className="inputSignUp"
                    onChange={(e) => handleChange(setEmail, e.target.value)}
                  ></input>
                </div>
              </CustomTooltip>
              <CustomTooltip
                title="Alaric : Password please, Hope you remember."
                arrow
                placement="top"
              >
                <div className="inputFieldSignUp">
                  <LockIcon className="EmailAccount" />
                  <input
                    className="password"
                    type={passwordVisibility}
                    placeholder="Password"
                    value={password}
                    autocomplete="new-password"
                    className="inputSignUp"
                    onChange={(e) => handleChange(setPassword, e.target.value)}
                  ></input>
                  {visibility ? (
                    <VisibilityIcon
                      className="EmailAccount"
                      onClick={() => toggleVisibility()}
                    />
                  ) : (
                    <VisibilityOffIcon
                      className="EmailAccount"
                      onClick={() => toggleVisibility()}
                    />
                  )}
                </div>
              </CustomTooltip>

              <Button
                style={{
                  width: "60%",
                  marginTop: "1rem",
                  color: "#fff",
                  background: "rgb(5, 185, 125)",
                }}
                onClick={() => handleSignIn()}
              >
                Let's Slog
              </Button>

              {error ? (
                <p
                  style={{
                    color: "red",
                    padding: "0.5rem",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  Alaric: Please fill form correctly.
                </p>
              ) : (
                ""
              )}
            </div>
          </SignUpForm>
          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
            className="footer"
          >
            <p style={{ color: "rgba(3, 185, 124, 0.608)", padding: "0 3rem" }}>
              Not a Slogger?{" "}
              <span
                style={{ color: "rgb(0, 128, 85)", cursor: "pointer" }}
                onClick={() => handleAuthToggle()}
              >
                Register
              </span>
            </p>
            <p style={{ color: "rgba(3, 185, 124, 0.608)", padding: "0 3rem" }}>
              Need Help?
            </p>
          </div>
        </SignUpBox>
      ) : (
        <SignUpBox>
          <SignUpForm>
            <img src={signUpImage} />
            <div className="signUpFormBottom">
              {/* <div className="inputFieldSignUp">
                <CustomTooltip
                  title="Alaric: What's your first name?"
                  arrow
                  placement="top"
                >
                  <div
                    className="inputFieldSignUp"
                    style={{ background: "none" }}
                  >
                    <ArrowForwardIosIcon className="EmailAccount shortScreen" />
                    <input
                      type="text"
                      value={firstName}
                      placeholder="First Name"
                      autocomplete="new-password"
                      className="firstName"
                      className="inputSignUp"
                      onChange={(e) =>
                        handleChange(setFirstName, e.target.value)
                      }
                    ></input>
                  </div>
                </CustomTooltip>
                <CustomTooltip title="Alaric: Last name?" arrow placement="top">
                  <div
                    className="inputFieldSignUp"
                    style={{ background: "none" }}
                  >
                    <ArrowForwardIosIcon className="EmailAccount shortScreen" />
                    <input
                      type="text"
                      value={lastName}
                      placeholder="Last Name"
                      autocomplete="new-password"
                      className="firstName"
                      className="inputSignUp"
                      onChange={(e) =>
                        handleChange(setLastName, e.target.value)
                      }
                    ></input>
                  </div>
                </CustomTooltip>
              </div> */}
              <CustomTooltip
                title="Alaric: Enter a valid email, It's good for future."
                arrow
                placement="top"
              >
                <div className="inputFieldSignUp">
                  <AccountBoxIcon className="EmailAccount" />
                  <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    autoComplete="off"
                    className="inputSignUp"
                    onChange={(e) => handleChange(setEmail, e.target.value)}
                  ></input>
                </div>
              </CustomTooltip>
              <CustomTooltip
                title="Alaric: Make sure your password is at least 6 letters."
                arrow
                placement="top"
              >
                <div className="inputFieldSignUp">
                  <LockIcon className="EmailAccount" />
                  <input
                    className="password"
                    type={passwordVisibility}
                    placeholder="Password"
                    value={password}
                    className="inputSignUp"
                    autocomplete="new-password"
                    onChange={(e) => handleChange(setPassword, e.target.value)}
                  ></input>
                  {visibility ? (
                    <VisibilityIcon
                      className="EmailAccount"
                      onClick={() => toggleVisibility()}
                    />
                  ) : (
                    <VisibilityOffIcon
                      className="EmailAccount"
                      onClick={() => toggleVisibility()}
                    />
                  )}
                </div>
              </CustomTooltip>
              <CustomTooltip
                title="Alaric: Make sure to write same password."
                arrow
                placement="top"
              >
                <div className="inputFieldSignUp">
                  <LockIcon className="EmailAccount" />
                  <input
                    className="password"
                    type={passwordVisibility}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    autoComplete="off"
                    className="inputSignUp"
                    onChange={(e) =>
                      handleChange(setConfirmPassword, e.target.value)
                    }
                  ></input>
                </div>
              </CustomTooltip>

              <Button
                style={{
                  width: "60%",
                  marginTop: "1rem",
                  color: "#fff",
                  background: "rgb(5, 185, 125)",
                }}
                onClick={() => handleSignUp()}
              >
                Register
              </Button>

              {error ? (
                <p
                  style={{
                    color: "red",
                    padding: "0.5rem",
                    width: "100%",
                    textAlign: "center",
                  }}
                >
                  Alaric: Please fill form correctly.
                </p>
              ) : (
                ""
              )}
            </div>
          </SignUpForm>
          <div
            style={{
              position: "absolute",
              bottom: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
            className="footer"
          >
            <p style={{ color: "rgba(3, 185, 124, 0.608)", padding: "0 3rem" }}>
              Already a Slogger?{" "}
              <span
                style={{ color: "rgb(0, 128, 85)", cursor: "pointer" }}
                onClick={() => handleAuthToggle()}
              >
                Sign In
              </span>
            </p>
            <p style={{ color: "rgba(3, 185, 124, 0.608)", padding: "0 3rem" }}>
              Need Help?
            </p>
          </div>
        </SignUpBox>
      )}
    </SignUpContainer>
  );
}

export default SignUp;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "740px",
});

const SignUpContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  .loaderContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    z-index: 1000;
    opacity: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .signUpLoader {
    object-fit: contain;
    transform: scale(0.6);
  }
`;

const Alaric = styled.div`
  position: absolute;
  left: 1rem;
  top: 20%;
  background: none;
  height: 28rem;
  width: 35vw;
  min-width: 10rem;
  padding-left: 2rem;
  align-items: center;
  font-size: 3vw;
  color: rgba(0, 128, 85, 0.568);
  font-family: "Bebas Neue", cursive;
  letter-spacing: 0.2rem;

  ${customMedia.lessThan("mdDesktop")`
      display:none;
    `};

  .highlight {
    color: rgb(0, 128, 85) !important;
  }
`;

const SignUpBox = styled.div`
  height: 100vh;
  width: 43vw;
  position: absolute;
  overflow: hidden;
  right: 0;
  top: 0;
  ${customMedia.lessThan("lgDesktop")`
     width: 33rem;
    `};
  ${customMedia.lessThan("tablet")`
      width: 28rem;
      
    `};
  ${customMedia.lessThan("smTablet")`
      width: 16rem;
      
    `};

  display: flex;
  justify-content: center;
  align-items: center;

  .footer {
    ${customMedia.lessThan("tablet")`
   font-size:10px;
   bottom:8rem !important;
   width:100%;
   flex-direction:column;
   line-height:2rem;
    `};

    ${customMedia.lessThan("smTablet")`
      bottom:2rem !important;
      line-height:1rem;
    `};
  }
`;

const SignUpForm = styled.div`
  position: relative;
  height: 100vh;
  width: 35vw;
  /* box-shadow: 13px 13px 20px rgba(0, 128, 85, 0.164),
    inset -3px -3px 10px rgba(0, 128, 85, 0.459); */

  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;

  ${customMedia.lessThan("tablet")`
  margin: 40px auto;
   width:  calc(40vw + 70px);
   height: 90vh;
    `};

  img {
    position: absolute;
    height: 6rem;
    width: 60%;
    margin: 1rem 2rem;
    margin-top: 2rem;
    object-fit: contain;
  }

  .signUpFormBottom {
    position: absolute;
    margin-top: 7rem;
    width: 100%;
    height: 75vh;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .inputFieldSignUp {
    width: 90%;
    height: 2rem;
    background-color: rgba(3, 185, 124, 0.308);
    border-radius: 1rem;
    border: none;
    padding: 1rem;
    margin: 0.5rem;
    display: flex;
    align-items: center;
    overflow: hidden;
  }
  .inputSignUp {
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    background: transparent;
    color: rgb(3, 185, 124);
    font-size: 1rem !important;
    flex: 0.9;
  }
  .inputSignUp::placeholder {
    color: rgb(3, 185, 124);
    font-size: 1rem !important;
  }
  .EmailAccount {
    color: rgb(3, 185, 124);
    font-size: 1.5rem !important;
    flex: 0.1;
    padding-right: 0.3rem;
  }
  .inputSignUp {
    ${customMedia.lessThan("tablet")`
      font-size:8px !important;
    `};
  }
  .inputSignUp::placeholder {
    ${customMedia.lessThan("tablet")`
      font-size:8px !important;
    `};
  }
  .shortScreen {
    ${customMedia.lessThan("tablet")`
     transform:scale(1.5);
    `};
  }
  .password {
    flex: 0.8;
  }
`;
