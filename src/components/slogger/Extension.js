import React from "react";
import "./contactUs.css";
import extension from "../../assets/images/extension.svg";
import { Button } from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useHistory } from "react-router";
import zipFile from "../../assets/sloggerExtension/SloggerExtension.rar";

function Extension() {
  const history = useHistory();

  return (
    <div className="contactUsPage">
      <div className="contactUsPageBox">
        <p className="contactUsPageHead">
          <ArrowBackIcon
            className="contactUsPageHeadIcon"
            onClick={() => history.goBack()}
          />
          Slogger Extension
        </p>
        <div className="contactPageForm">
          <h3 className="screenContentPara">
            Follow these 5 easy steps to add
          </h3>
          <h3 className="screenContentPara">
            1) Download the zip folder and extract it.
          </h3>
          <h3 className="screenContentPara">
            2) Go to extension settings in your browser.
            <br />
            ("chrome://extensions/" in chrome browser)
          </h3>
          <h3 className="screenContentPara">3) Enable the developer mode.</h3>
          <h3 className="screenContentPara">
            4) Click on Load unpacked button
          </h3>
          <h3 className="screenContentPara">
            5) Select the folder which you have extracted.
          </h3>
          <a
            href={zipFile}
            download
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            <Button className="extensionBtn">
              Click here to download .zip file
            </Button>
          </a>
        </div>
      </div>
      <img src={extension} className="contactUsImage" />
    </div>
  );
}

export default Extension;
