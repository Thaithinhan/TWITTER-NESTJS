import React from "react";

import LeftBar from "../../Components/Common/LeftBar/LeftBar";
import RightBar from "../../Components/Common/RightBar/RightBar";
import VerifyAccount from "../../Components/VerifyAccount/VerifyAccount";

const Verify = () => {
  return (
    <div className="verify container flex justify-between align-items-center">
      <LeftBar />
      <VerifyAccount />
      <RightBar />
    </div>
  );
};

export default Verify;
