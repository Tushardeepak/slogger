import { Button, makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import DeleteIcon from "@material-ui/icons/Delete";
import Delete from "./Delete";

const useStyles = makeStyles((theme) => ({
  Btn: {
    minWidth: "2.5rem",
  },
}));

function TeamCard({
  id,
  teamName,
  UrlTeamName,
  deleteBtn,
  setOpenDeleteSnackBar,
  setCurrentTeamName,
  sidebarClose,
  discussion,
}) {
  const [openDelete, setOpenDelete] = React.useState(false);
  const history = useHistory();
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const classes = useStyles();

  const handleTeamChange = () => {
    history.push(`/home/${teamName}`);
    sidebarClose();
  };

  const handleDelete = () => {
    setOpenDelete(true);
  };

  const handleClose = () => {
    setOpenDelete(false);
  };

  return UrlTeamName === teamName ? (
    <div style={{ display: "flex", margin: "0.1rem" }} className="TeamButtons">
      <Button
        className="TeamButtons"
        style={{
          flex: discussion ? 1 : 0.95,
          width: "100%",
          height: "auto",
          color: "rgb(0, 94, 62)",
          fontWeight: 600,
          backgroundColor: "rgba(7, 190, 129, 0.534)",
          fontSize: "0.7rem",
          padding: "0.3rem",
          borderRadius: discussion ? "5px" : "5px 0 0 5px",
          textAlign: "center",
          wordBreak: "break-word",
          border: "2px solid rgb(0, 94, 62)",
          marginRight: 0,
        }}
        onClick={() => handleTeamChange()}
      >
        {teamName}
      </Button>
      {deleteBtn ? (
        <Button
          classes={{ root: classes.Btn }}
          style={{
            flex: 0.05,
            background: "rgb(2, 112, 75)",
            borderRadius: "0 5px 5px 0",
            height: "auto",
          }}
          onClick={() => handleDelete()}
        >
          <DeleteIcon
            style={{
              fontSize: "20px",
              color: "#fff",
              cursor: "pointer",
              transform: "scale(0.8)",
            }}
          />
        </Button>
      ) : (
        ""
      )}

      {openDelete && (
        <Delete
          open={openDelete}
          handleClose={handleClose}
          teamName={teamName}
          id={id}
          setOpenDeleteSnackBar={setOpenDeleteSnackBar}
          setCurrentTeamName={setCurrentTeamName}
        />
      )}
    </div>
  ) : (
    <div style={{ display: "flex", margin: "0.1rem" }}>
      <Button
        className="TeamButtons"
        style={{
          flex: discussion ? 1 : 0.95,
          width: "100%",
          height: "auto",
          color: "rgb(0, 94, 62)",
          fontWeight: 600,
          backgroundColor: "rgba(7, 190, 129, 0.534)",
          padding: "0.3rem",
          fontSize: "0.7rem",
          borderRadius: discussion ? "5px" : "5px 0 0 5px",
          textAlign: "center",
          wordBreak: "break-word",
          border: "2px solid rgba(7, 190, 129, 0.534)",
          marginRight: 0,
        }}
        onClick={() => handleTeamChange()}
      >
        {teamName}
      </Button>
      {deleteBtn ? (
        <Button
          classes={{ root: classes.Btn }}
          style={{
            flex: 0.05,
            background: "rgb(2, 112, 75)",
            borderRadius: "0 5px 5px 0",
            height: "auto",
          }}
          onClick={() => handleDelete()}
        >
          <DeleteIcon
            style={{
              fontSize: "20px",
              color: "#fff",
              cursor: "pointer",
              transform: "scale(0.8)",
            }}
          />
        </Button>
      ) : (
        ""
      )}

      {openDelete && (
        <Delete
          open={openDelete}
          handleClose={handleClose}
          teamName={teamName}
          setOpenDeleteSnackBar={setOpenDeleteSnackBar}
          setCurrentTeamName={setCurrentTeamName}
          id={id}
        />
      )}
    </div>
  );
}

export default TeamCard;
