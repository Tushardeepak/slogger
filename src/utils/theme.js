import { createMuiTheme } from "@material-ui/core/styles";
export default createMuiTheme({
  overrides: {
    MuiTab: {
      root: {
        minHeight: "1.1rem",
      },
    },
    MuiSnackbarContent: {
      root: {
        backgroundColor: "#05B97D",
      },
    },
    MuiPickersCalendarHeader: {
      daysHeader: {
        minHeight: "20px",
      },
    },
    MuiInputBase: {
      root: {
        overflow: "hidden",
      },
      // input: {
      //   color: "rgb(0, 90, 60)",
      //   fontSize: "1.2rem",
      // },
    },
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: "rgb(2, 88, 60)",
      },
    },
    MuiPickersDay: {
      daySelected: {
        backgroundColor: "rgb(2, 88, 60)",
      },
    },
    MuiButton: {
      textPrimary: {
        color: "rgb(2, 88, 60)",
      },
    },
  },
});
