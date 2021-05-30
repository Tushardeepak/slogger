import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import "./style.css";
import { db, storage } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import { Fade } from "@material-ui/core";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Fade direction="" ref={ref} {...props} />;
});

export default function Delete({
  open,
  handleClose,
  teamName,
  id,
  setCurrentTeamName,
  setOpenDeleteSnackBar,
}) {
  const [cannotDelete, setCannotDelete] = React.useState(false);
  const [ModalOpen, setModalOpen] = React.useState(false);

  const handleCloseDeleteListModal = () => {
    setModalOpen(false);
  };

  const { currentUser } = useAuth();
  const handleJoinDelete = () => {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("joinTeams")
      .doc(id)
      .delete();
    handleClose();
    setOpenDeleteSnackBar(true);
    setCurrentTeamName(teamName);
  };

  React.useEffect(() => {
    db.collection("teams").onSnapshot((snapshot) => {
      const tempTeamList = snapshot.docs.map((doc) => ({
        id: doc.id,
        admin: doc.data().admin,
      }));
      var count = 0;
      tempTeamList.filter((team) => {
        if (team.id === teamName) {
          if (team.admin === currentUser.uid) {
            count = count + 1;
          }
        }
      });
      if (count !== 0) {
        // callDelete();
      } else {
        setCannotDelete(true);
      }
    });
  }, []);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle id="alert-dialog-slide-title" className="title">
        {cannotDelete ? <p>Are you sure? </p> : <p>Are you sure?</p>}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {cannotDelete ? (
            <p>
              Team will be deleted on your side only. All the items and todos
              will be delete for this team for you only. This will not affect
              the other members.
            </p>
          ) : (
            <p>
              All the items and todo will be delete for this team and cannot be
              retrieved. This will also affect the other members.
            </p>
          )}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          className="addButtonDelete"
          onClick={handleClose}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          className="addButtonDelete"
          onClick={
            cannotDelete ? () => handleJoinDelete() : () => setModalOpen(true)
          }
          color="primary"
        >
          Delete
        </Button>
      </DialogActions>
      {ModalOpen && (
        <DeleteUserTeamModal
          open={ModalOpen}
          handleThisClose={handleCloseDeleteListModal}
          teamName={teamName}
          id={id}
          closeBackModal={handleClose}
          currentUser={currentUser.uid}
          setOpenDeleteSnackBar={setOpenDeleteSnackBar}
          setCurrentTeamName={setCurrentTeamName}
        />
      )}
    </Dialog>
  );
}

function DeleteUserTeamModal({
  open,
  handleThisClose,
  teamName,
  id,
  closeBackModal,
  currentUser,
  setOpenDeleteSnackBar,
  setCurrentTeamName,
}) {
  const [todoSideDelete, setTodoSideDelete] = React.useState(false);
  const [userSideDelete, setUserSideDelete] = React.useState(false);
  const [databaseSideDelete, setDatabaseSideDelete] = React.useState(false);

  const history = useHistory();

  const userTeamDelete = () => {
    db.collection("teams").doc(teamName).set(
      {
        teamDeleted: true,
      },
      { merge: true }
    );

    db.collection("users")
      .doc(currentUser)
      .collection("userTeams")
      .doc(id)
      .delete();

    setUserSideDelete(true);
    setOpenDeleteSnackBar(true);
    setCurrentTeamName(teamName);
    history.push("/home");
  };

  const databaseDelete = () => {
    db.collection("teams").doc(teamName).delete();
    setDatabaseSideDelete(true);
  };

  const deleteAllTodo = (todo) => {
    todo.map((doc) => {
      db.collection("teams")
        .doc(teamName)
        .collection("teamTodos")
        .doc(doc.id)
        .collection("teamTodoImages")
        .onSnapshot((snapshot) => {
          const list = snapshot.docs.map((doc) => ({
            id: doc.id,
            todoImage: doc.data().todoImage,
          }));
          if (list.length !== 0) {
            list.forEach((file) => {
              storage.refFromURL(file.todoImage).delete();
            });
          }
        });

      db.collection("teams")
        .doc(teamName)
        .collection("teamTodos")
        .doc(doc.id)
        .delete();
    });
  };

  const todoDelete = () => {
    db.collection("teams")
      .doc(teamName)
      .collection("teamTodos")
      .onSnapshot((snapshot) => {
        const todoDeleteList = snapshot.docs.map((doc) => ({
          id: doc.id,
          todoImage: doc.data().todoImage,
        }));

        console.log(todoDeleteList);
        deleteAllTodo(todoDeleteList);
      });

    setTodoSideDelete(true);
  };

  const handleCompleteClose = () => {
    handleThisClose();
    closeBackModal();
  };
  return (
    <Dialog
      open={open}
      keepMounted
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle
        id="alert-dialog-slide-title"
        className="title"
      ></DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h3 style={{ paddingBottom: "1rem" }}>
              Help us to delete it from both place
            </h3>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ flex: 0.7 }}>Delete all todos: </p>
              <Button
                disabled={todoSideDelete ? true : false}
                // className="addButton"
                className={todoSideDelete ? "addButtonDisabled" : "addButton"}
                style={{ flex: 0.3 }}
                onClick={() => todoDelete()}
              >
                {todoSideDelete ? "deleted" : "delete"}
              </Button>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={{ flex: 0.7 }}>Delete from your side: </p>
              <Button
                disabled={
                  todoSideDelete ? (userSideDelete ? true : false) : true
                }
                // className="addButton"

                className={
                  todoSideDelete
                    ? userSideDelete
                      ? "addButtonDisabled"
                      : "addButton"
                    : "addButtonDisabled"
                }
                style={{ flex: 0.3 }}
                onClick={() => userTeamDelete()}
              >
                {userSideDelete ? "deleted" : "delete"}
              </Button>
            </div>
          </div>
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          className="addButton"
          onClick={() => handleCompleteClose()}
          color="primary"
          disabled={userSideDelete && todoSideDelete ? false : true}
          className={
            todoSideDelete && userSideDelete ? "addButton" : "addButtonDisabled"
          }
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
