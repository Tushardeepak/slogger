import { Button } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

function TeamCard({ teamName, UrlTeamName }) {
  const history = useHistory();

  const handleTeamChange = () => {
    history.push(`/${teamName}`);
  };

  return UrlTeamName === teamName ? (
    <Button
      style={{
        width: "98%",
        height: "auto",
        color: "rgb(0, 94, 62)",
        fontWeight: 600,
        backgroundColor: "rgba(7, 190, 129, 0.534)",
        margin: "0.3rem",
        padding: "0.5rem",
        borderRadius: "15px",
        textAlign: "center",
        wordBreak: "break-all",
        border: "2px solid rgb(0, 94, 62)",
      }}
      onClick={() => handleTeamChange()}
    >
      {teamName}
    </Button>
  ) : (
    <Button
      style={{
        width: "98%",
        height: "auto",
        color: "rgb(0, 94, 62)",
        fontWeight: 600,
        backgroundColor: "rgba(7, 190, 129, 0.534)",
        margin: "0.3rem",
        padding: "0.5rem",
        borderRadius: "15px",
        textAlign: "center",
        wordBreak: "break-all",
        border: "2px solid rgba(7, 190, 129, 0.534)",
      }}
      onClick={() => handleTeamChange()}
    >
      {teamName}
    </Button>
  );
}

export default TeamCard;

const CardContainer = styled.div``;
