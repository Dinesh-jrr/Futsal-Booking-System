import React from "react";
import Sidebar from "./src/components/SideBar Section/sidebar";
import "./App.css";
import Body from "./src/components/Body Section/Body";

const  App=()=>{
  return(
    <div className="container">
      <Sidebar></Sidebar>
      <Body></Body>
    </div>
  )
}

export default App