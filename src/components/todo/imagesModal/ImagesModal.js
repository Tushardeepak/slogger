import React, { useEffect, useState } from "react";
import { AutoRotatingCarousel } from "material-auto-rotating-carousel";
import {
  Card,
  CardContent,
  Divider,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import "./imagesModal.css";
import DownloadImageModal from "./DownloadImageModal";
import CancelIcon from "@material-ui/icons/Cancel";

function ImagesModal({
  handleOpen,
  setHandleOpen,
  imageList,
  urlTeamName,
  id,
  setImageList,
  todoText,
  userName,
  profileImage,
  setTabValue,
}) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.up("sm"));
  const [openDownload, setOpenDownload] = useState(false);
  const [link, setLink] = useState("");
  const [senderId, setSenderId] = useState("");
  const [imageId, setImageId] = useState("");

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
            {!isSmall && (
              <CancelIcon
                style={{ margin: "1rem", color: "grey" }}
                onClick={() => setHandleOpen(false)}
              />
            )}
            <p
              style={{
                fontSize: "1rem",
                color: "seagreen",
                margin: "1rem 0 0 1rem",
              }}
            >
              <span style={{ fontSize: "0.7rem" }}>Uploaded by :</span>{" "}
              {images.senderName}
            </p>
            <Divider style={{ margin: "0.5rem 1rem 0 1rem" }} />
            <CardContent style={{ borderRadius: "10px" }}>
              <img
                src={images.todoImage}
                style={{
                  objectFit: "contain",
                  width: "100%",
                  height: "100%",
                  borderRadius: "10px",
                  marginTop: isSmall ? 0 : "5%",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setImageId(images.id);
                  setSenderId(images.senderId);
                  setLink(images.todoImage);
                  setOpenDownload(true);
                }}
                // onClick={() => window.open(`${images.todoImage}`, "_blank")}
              />
              <Divider style={{ margin: "1rem 0 " }} />
              <Typography
                variant="body2"
                color="textSecondary"
                component="p"
                style={{
                  marginTop: "1rem",
                  color: "#019966",
                  margin: "0rem 1rem 1rem 1rem",
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
          senderId={senderId}
          imageId={imageId}
          urlTeamName={urlTeamName}
          id={id}
          imageList={imageList}
          handleCloseImageModal={() => setHandleOpen(false)}
          setImageList={setImageList}
          todoText={todoText}
          userName={userName}
          profileImage={profileImage}
          setTabValue={setTabValue}
        />
      )}
    </div>
  );
}

export default ImagesModal;
