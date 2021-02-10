import React, { useState } from "react";
import styled from "styled-components";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import DeleteIcon from "@material-ui/icons/Delete";
import { useAuth } from "../../context/AuthContext";
import { db, storage } from "../../firebase";
import moment from "moment";
import CustomTooltip from "../CustomTooltip";
import { generateMedia } from "styled-media-query";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { Button } from "@material-ui/core";

function TeamTodoCard({
  id,
  text,
  date,
  checked,
  admin,
  urlTeamName,
  assigned,
  todoImage,
}) {
  const { currentUser } = useAuth();
  const [localCheck, setLocalCheck] = useState(checked);
  const [assignedTo, setAssignedTo] = useState();

  React.useEffect(() => {
    if (assigned === "") {
      setAssignedTo("");
    } else {
      setAssignedTo(assigned);
    }
  }, [assigned]);

  const handleInputChange = (value) => {
    setAssignedTo(value);
  };

  const handleDelete = (id) => {
    if (todoImage !== "") {
      // Create a reference to the file to delete
      var desertRef = storage.refFromURL(todoImage);

      // Delete the file
      desertRef
        .delete()
        .then(function () {
          console.log("File deleted successfully");
        })
        .catch(function (error) {
          console.log(error);
        });
    }

    db.collection("teams")
      .doc(urlTeamName)
      .collection("teamTodos")
      .doc(id)
      .delete();
  };

  const handleChecked = () => {
    setLocalCheck(!localCheck);
    db.collection("teams").doc(urlTeamName).collection("teamTodos").doc(id).set(
      {
        checked: localCheck,
      },
      { merge: true }
    );
  };

  const handleAssignedSubmit = () => {
    db.collection("teams").doc(urlTeamName).collection("teamTodos").doc(id).set(
      {
        assignedTo: assignedTo,
      },
      { merge: true }
    );
    setAssignedTo("");
  };

  const emptyFunction = () => {};

  const onSelectFile = async (event) => {
    try {
      const image = event.target.files[0];
      const uploadTask = await storage
        .ref(`todoImages/${image.name}`)
        .put(image);
      storage
        .ref("todoImages")
        .child(image.name)
        .getDownloadURL()
        .then((url) => {
          console.log(url);
          db.collection("teams")
            .doc(urlTeamName)
            .collection("teamTodos")
            .doc(id)
            .set(
              {
                todoImage: url,
              },
              { merge: true }
            );
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TodoMainCard>
      <TodoStartIcon>
        <CustomTooltip title="Double tap" arrow placement="left">
          {checked ? (
            <CheckBoxIcon
              className="todoStartIcon"
              onClick={() => handleChecked()}
            />
          ) : (
            <CheckBoxOutlineBlankIcon
              className="todoStartIcon"
              onClick={() => handleChecked()}
            />
          )}
        </CustomTooltip>
      </TodoStartIcon>

      <TodoTextBox>
        <div style={{ display: "flex" }}>
          <div style={{ width: "100%", flex: "0.85" }}>
            <div className="inputField">
              <p className="assignedTo">Assigned to :</p>
              <input
                value={assignedTo}
                className="todoInput"
                type="text"
                onChange={
                  admin === currentUser.uid
                    ? (e) => handleInputChange(e.target.value)
                    : () => emptyFunction()
                }
                // onKeyDown={(e) => handleSubmitEnter(e)}
              />
              {admin === currentUser.uid ? (
                <GroupAddIcon
                  className="todoIcon"
                  onClick={() => handleAssignedSubmit()}
                />
              ) : (
                ""
              )}
            </div>
            <div style={{ display: "flex" }}>
              {admin === currentUser.uid ? (
                <div style={{ flex: "0.5" }}>
                  {" "}
                  <input
                    hidden
                    id="profile-image-file"
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                  />
                  <Button
                    style={{
                      width: "98%",
                      fontSize: "0.7rem",
                      height: "1.5rem",
                      color: "#fff",
                      fontWeight: 600,
                      backgroundColor: "rgb(5, 185, 125)",
                      marginBottom: "0.5rem",
                    }}
                    onClick={() => {
                      document.getElementById("profile-image-file").click();
                    }}
                  >
                    Upload Image
                  </Button>
                </div>
              ) : (
                ""
                // <div style={{ flex: "0.5" }}>
                //   {todoImage !== "" ? (
                //     <a
                //       href={todoImage}
                //       download
                //       target="_blank"
                //       style={{ textDecoration: "none" }}
                //     >
                //       <Button
                //         style={{
                //           width: "95%",
                //           fontSize: "0.7rem",
                //           height: "1.5rem",
                //           color: "#fff",
                //           fontWeight: 600,
                //           backgroundColor: "rgb(5, 185, 125)",

                //           marginBottom: "0.5rem",
                //         }}
                //       >
                //         Download Image
                //       </Button>
                //     </a>
                //   ) : (
                //     ""
                //   )}
                // </div>
              )}

              <div style={{ flex: "0.5" }}>
                {todoImage !== "" ? (
                  <a
                    href={todoImage}
                    target="_blank"
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      style={{
                        width: "95%",
                        fontSize: "0.7rem",
                        height: "1.5rem",
                        color: "#fff",
                        fontWeight: 600,
                        backgroundColor: "rgb(5, 185, 125)",

                        marginBottom: "0.5rem",
                      }}
                    >
                      View Image
                    </Button>
                  </a>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>

          <p
            className="todoDate"
            style={{
              color: "rgba(0, 99, 66, 0.668)",
              paddingBottom: "0.3rem",
              flex: "0.15",
            }}
          >
            {date.substring(8, 10)}
            {"/"}
            {date.substring(5, 7)}
            {"/"}
            {date.substring(0, 4)}
          </p>
        </div>
        <p
          style={{
            color: "rgba(0, 99, 66, 0.868)",
            fontWeight: 400,
            width: "100%",
            wordBreak: "break-all",
            verticalAlign: "center",
            height: "auto",
            // lineHeight: "30px",
            marginTop: "-5px",
          }}
        >
          {text}
        </p>
      </TodoTextBox>
      {admin === currentUser.uid ? (
        <TodoActions>
          <DeleteIcon className="delete" onClick={() => handleDelete(id)} />
        </TodoActions>
      ) : (
        ""
      )}
    </TodoMainCard>
  );
}

export default TeamTodoCard;

const customMedia = generateMedia({
  lgDesktop: "1350px",
  mdDesktop: "1150px",
  tablet: "960px",
  smTablet: "740px",
});

const TodoMainCard = styled.div`
  margin: 1rem 0rem;
  box-shadow: 0px 1px 5px rgb(0, 129, 86);
  background-color: rgb(231, 250, 243);
  border-radius: 10px;
  width: 100%;
  height: 3rem;
  min-height: 3rem;
  display: flex;
  word-break: "break-all";
  min-height: 4.5rem !important;
  height: auto;
`;
const TodoStartIcon = styled.div`
  transform: scale(0.8);
  flex: 0.07;
  width: 100%;
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-right: 2px solid rgba(0, 99, 66, 0.368);

  ${customMedia.lessThan("smTablet")`
      flex: 0.09;
    `};

  .todoStartIcon {
    color: rgba(0, 99, 66, 0.568);
    font-size: 1.7rem;
    object-fit: contain;
    cursor: pointer;

    ${customMedia.lessThan("smTablet")`
      transform:scale(0.8);
      padding:0 0.3rem;
    `};
  }
`;
const TodoTextBox = styled.div`
  flex: 0.88;
  width: 100%;
  padding: 0.2rem 0.5rem;
  word-break: "break-all";
  height: auto;

  .assignedTo {
    color: rgb(0, 90, 60);
    font-size: 0.7rem;
  }

  .todoIcon {
    color: rgb(3, 185, 124);
    font-size: 1.2rem;
    flex: 0.1;
    padding-right: 0.3rem;
    cursor: pointer;
    transform: rotateY(180deg) !important;
  }

  .inputField {
    width: 95%;
    height: 1.4rem;
    background-color: rgba(3, 185, 124, 0.308);
    border-radius: 5px;
    border: none;
    padding: 0.05rem 0.2rem;
    padding-left: 0.5rem;
    margin: 0.2rem;
    margin-bottom: 0.2rem;
    margin-left: 0;
    display: flex;
    align-items: center;
    flex: 0.9;
    ${customMedia.lessThan("smTablet")`
         margin:0;
         height: 3rem;
    `};
  }
  input {
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    background: transparent;
    color: rgb(0, 90, 60);
    font-size: 0.7rem;
    flex: 0.95;
    padding-left: 0.5rem;

    ${customMedia.lessThan("smTablet")`
      font-size:0.5rem;
    `};
  }
  input::placeholder {
    color: rgb(3, 185, 124);
    font-size: 0.7rem;
    ${customMedia.lessThan("smTablet")`
      font-size:0.5rem;
    `};
  }

  .todoDate {
    flex: 0.2;
    font-size: 10px;
    text-align: center;
    ${customMedia.lessThan("smTablet")`
       font-size:9px;
    `};
  }
`;
const TodoActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  flex: 0.05;
  width: 100%;
  height: auto;
  padding: 0.2rem 0.5rem;
  background-color: rgba(0, 99, 66, 0.868);
  border-radius: 30px 0px 0px 30px;
  border-left: 2px solid rgba(0, 99, 66, 0.768);

  ${customMedia.lessThan("smTablet")`
      flex: 0.09;
    `};

  .delete {
    cursor: pointer;

    ${customMedia.lessThan("smTablet")`
      transform:scale(0.8);
    `};
  }
`;
