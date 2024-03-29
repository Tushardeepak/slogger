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
        "&:hover": {
          backgroundColor: "rgb(2, 88, 60)",
        },
      },
      current: {
        color: "rgb(2, 88, 60)",
      },
    },
    MuiButton: {
      textPrimary: {
        color: "rgb(2, 88, 60)",
      },
    },
    MuiDialog: {
      paperWidthSm: {
        width: "600px",
        borderRadius: "20px",
      },
    },
    MuiCheckbox: {
      root: {
        color: "rgb(5, 185, 125)",
      },
    },
    MuiAvatarGroup: {
      avatar: {
        border: "none",
      },
    },
    MuiAvatar: {
      colorDefault: {
        height: "1.5rem",
        width: "1.5rem",
        backgroundColor: "rgb(2, 88, 60, 0.5)",
        fontSize: "0.6rem",
      },
    },
    MuiPickersModal: {
      dialogRoot: {
        maxWidth: "310px",
        minWidth: "310px",
        borderRadius: "5px",
      },
    },
    MuiBadge: {
      anchorOriginTopRightRectangle: {
        background: "rgb(2, 87, 59)",
        color: "#fff",
        transform: "scale(0.9)",
        right: "-0.5rem",
        top: "-0.5rem",
      },
    },
  },
});
