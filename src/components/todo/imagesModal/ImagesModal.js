import React, { useEffect, useState } from "react";
import { AutoRotatingCarousel } from "material-auto-rotating-carousel";
import {
  Card,
  CardContent,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import "./imagesModal.css";
import DownloadImageModal from "./DownloadImageModal";

function ImagesModal({ handleOpen, setHandleOpen, imageList }) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const [openDownload, setOpenDownload] = useState(false);
  const [link, setLink] = useState("");

  useEffect(() => {
    console.log(imageList);
  }, []);
  return (
    <div>
      <AutoRotatingCarousel
        open={handleOpen}
        onClose={() => setHandleOpen(false)}
        autoplay={false}
        mobile={!isSmall}
        style={{ position: "absolute" }}
      >
        {imageList?.map((images) => (
          <Card
            key={images.id}
            style={{
              height: isSmall ? "97%" : "100%",
              overflowY: "scroll",
              borderRadius: isSmall ? "10px" : 0,
            }}
          >
            <CardContent style={{ borderRadius: "10px" }}>
              <img
                src={images.todoImage}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                  marginTop: isSmall ? 0 : "25%",
                  cursor: "pointer",
                }}
                // onClick={() => {
                //   setLink(images.todoImage);
                //   setOpenDownload(true);
                // }}
                onClick={() => window.open(`${images.todoImage}`, "_blank")}
              />
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                style={{
                  marginTop: "1rem",
                  color: "#019966",
                  margin: "1rem",
                }}
              >
                {images.todoImageText}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </AutoRotatingCarousel>
      {openDownload && (
        <DownloadImageModal
          open={openDownload}
          handleClose={() => setOpenDownload(false)}
          link={link}
        />
      )}
    </div>
  );
}

export default ImagesModal;
