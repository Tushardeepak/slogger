import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { Alert } from "@material-ui/lab";
import { makeStyles } from "@material-ui/core/styles";

function MyAlert(props) {
  return <Alert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function SimpleSnackbar({
  open,
  handleClose,
  text,
  home,
  material,
}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      {home ? (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={text}
        ></Snackbar>
      ) : (
        <Snackbar
          open={open}
          autoHideDuration={material ? 1000000000 : 6000}
          onClose={handleClose}
        >
          <MyAlert onClose={handleClose} severity="success">
            {text}
          </MyAlert>
        </Snackbar>
      )}
    </div>
  );
}
