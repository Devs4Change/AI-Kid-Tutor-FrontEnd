import React from "react";
import { Outlet } from "react-router-dom";
import FloatingChat from "./FloatingChat";

const AppWrapper = () => {
  return (
    <>
      <Outlet />
      <FloatingChat />
    </>
  );
};

export default AppWrapper;
