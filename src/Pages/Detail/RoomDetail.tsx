import React from "react";
import RoomInfo from "./ComponentDetail/RoomInfo";
import CommentViewer from "./ComponentDetail/CommentViewer";
import ThingsToKnow from "./ComponentDetail/ThinkToKnow";

type Props = {};

const RoomDetail = (props: Props) => {
  return (
    <div className="mx-auto max-w-6xl px-4 space-y-12 py-8">
      <RoomInfo />
      <div className=" py-5">
        <ThingsToKnow />
      </div>
      <div className=" py-5">
        <CommentViewer />
      </div>
    </div>
  );
};

export default RoomDetail;
