import React, { useState } from "react";
import styled from "styled-components";
import CreateIcon from "@material-ui/icons/Create";
import { Button, Grid, IconButton, InputAdornment } from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import AddIcon from "@material-ui/icons/Add";
import MomentUtils from "@date-io/moment";
import { createMuiTheme } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import green from "@material-ui/core/colors/green";

const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: green,
    width: "100%",
  },
});

function PersonalTodo() {
  const [selectedDate, handleDateChange] = useState(new Date());
  const [selectedStartTime, handleStartTimeChange] = React.useState(new Date());

  return (
    <TodoContainer>
      <TodoLeftContainer>
        <TodoLeftUpBox>
          <div className="inputField">
            <CreateIcon className="todoIcon" />
            <input
              className="todoInput"
              type="text"
              placeholder="Write here..."
            />
          </div>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <div className="dateBox">
              <ThemeProvider theme={defaultMaterialTheme}>
                <DateTimePicker
                  variant="inline"
                  label="Add time"
                  value={selectedDate}
                  onChange={handleDateChange}
                  style={{
                    width: "100%",
                    textAlign: "center",
                  }}
                />
              </ThemeProvider>
            </div>
          </MuiPickersUtilsProvider>
          <Button endIcon={<AddIcon />} className="AddButton">
            ADD
          </Button>
        </TodoLeftUpBox>
        <TodoLeftDownBox></TodoLeftDownBox>
      </TodoLeftContainer>
      <TodoRightContainer></TodoRightContainer>
    </TodoContainer>
  );
}

export default PersonalTodo;

const TodoContainer = styled.div`
  width: 98.5%;
  height: 87%;
  position: absolute;
  display: flex;
`;

const TodoLeftContainer = styled.div`
  flex: 0.35;
  height: 100%;
  width: 100%;
  border-right: 2px solid rgba(0, 141, 94, 0.295);
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
`;
const TodoRightContainer = styled.div`
  flex: 0.65;
  height: 100%;
  width: 100%;
`;
const TodoLeftUpBox = styled.div`
  flex: 0.5;
  border-bottom: 2px solid rgba(0, 141, 94, 0.295);
  display: flex;
  flex-direction: column;

  .inputField {
    width: 90%;
    height: 2rem;
    background-color: rgba(3, 185, 124, 0.308);
    border-radius: 1rem;
    border: none;
    padding: 1rem;
    padding-left: 0.5rem;
    margin: 0.5rem;
    display: flex;
    align-items: center;
  }
  input {
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    background: transparent;
    color: rgb(0, 90, 60);
    font-size: 1rem;
    flex: 0.9;
    padding-left: 0.5rem;
  }
  input::placeholder {
    color: rgb(3, 185, 124);
    font-size: 1rem;
  }
  .todoIcon {
    color: rgb(3, 185, 124);
    font-size: 1.5rem;
    flex: 0.1;
    padding-right: 0.3rem;
    transform: rotateY(180deg);
  }
  .dateBox {
    width: 89%;
    height: 2rem;
    background-color: rgba(3, 185, 124, 0.308);
    border-radius: 1rem;
    border: none;
    padding: 1rem;
    margin: 0.5rem;
    display: flex;
    align-items: center;
  }
  .AddButton {
    width: 95%;
    color: #fff;
    font-weight: 600;
    background-color: rgb(5, 185, 125);
    margin: 0.5rem;
  }
`;
const TodoLeftDownBox = styled.div`
  flex: 0.5;
`;
