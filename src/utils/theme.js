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
  },
});
