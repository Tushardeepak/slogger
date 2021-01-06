import { Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const CustomTooltip = withStyles(() => ({
  tooltip: {
    fontSize: ".7em",
    fontWeight: 400,
    background: "rgb(5, 185, 125)",
    color: "#fff",
    marginBottom: "0rem",
  },
  arrow: {
    color: "rgb(5, 185, 125)",
  },
}))(Tooltip);

export default CustomTooltip;
