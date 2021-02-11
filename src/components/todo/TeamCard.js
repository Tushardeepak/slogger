import { Button } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import DeleteIcon from "@material-ui/icons/Delete";
import Delete from "./Delete";

function TeamCard({ id, teamName, UrlTeamName }) {
  const [openDelete, setOpenDelete] = React.useState(false);
  const history = useHistory();

  const handleTeamChange = () => {
    history.push(`/${teamName}`);
  };

  const handleDelete = () => {
    setOpenDelete(true);
  };

  const handleClose = () => {
    setOpenDelete(false);
  };

  return UrlTeamName === teamName ? (
    <div
      style={{ display: "flex", alignItems: "center" }}
      className="TeamButtons"
    >
      <Button
        className="TeamButtons"
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
      <DeleteIcon
        style={{
          fontSize: "20px",
          color: "rgb(2, 112, 75)",
          cursor: "pointer",
        }}
        onClick={() => handleDelete()}
      />
      {openDelete && (
        <Delete
          open={openDelete}
          handleClose={handleClose}
          teamName={teamName}
          id={id}
        />
      )}
    </div>
  ) : (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Button
        className="TeamButtons"
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
      <DeleteIcon
        style={{
          fontSize: "20px",
          color: "rgb(2, 112, 75)",
          cursor: "pointer",
        }}
        onClick={() => handleDelete()}
      />
      {openDelete && (
        <Delete
          open={openDelete}
          handleClose={handleClose}
          teamName={teamName}
          id={id}
        />
      )}
    </div>
  );
}

export default TeamCard;
