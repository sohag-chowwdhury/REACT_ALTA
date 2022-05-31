import React from "react";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { useStore } from "../Contextapi";
import ImageModal from "./ImageModal";
function ImageUpload() {
  const { image } = useStore();
  return (
    <div style={{ position: "relative", height: "400px", width: "auto" }}>
      <ImageModal />
      <img src={image} alt="gif" height="100%" width="100%" />
      <br></br>
    </div>
  );
}

export default ImageUpload;
