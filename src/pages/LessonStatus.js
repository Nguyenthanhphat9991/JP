import React from "react";
import flowerOpen from "../assets/images/flower_open.jpg";
// import flowerInProgress from "./assets/flower_inprogress.png";
// import flowerFinish from "./assets/flower_finish.png";

const getFlowerImage = (status) => {
  switch (status) {
    case "open":
      return flowerOpen;
    // case "inprogress":
    //   return flowerInProgress;
    // case "finish":
    //   return flowerFinish;
    default:
      return flowerOpen;
  }
};

const LessonStatus = ({ status }) => {
  return (
    <div className="text-center">
      <img src={getFlowerImage(status)} alt="Lesson Status" className="img-fluid" />
      {/* <p className="fw-bold">{status.toUpperCase()}</p> */}
    </div>
  );
};

export default LessonStatus;
