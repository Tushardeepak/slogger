import { Tooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

const CustomTooltip = withStyles(() => ({
  tooltip: {
    fontSize: ".7em",
    fontWeight: 400,
    background: "rgb(2, 97, 65)",
    color: "#fff",
    marginBottom: "0rem",
    overflow: "hidden",
  },
  arrow: {
    backgroundColor: "rgb(2, 97, 65)",
    color: "rgb(2, 97, 65)",
  },
}))(Tooltip);

export default CustomTooltip;
