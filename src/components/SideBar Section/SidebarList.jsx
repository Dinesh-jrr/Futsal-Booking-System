import React from "react";
import './sidebar-list.css';

const SidebarList = ({ icon: Icon, text, link }) => {
  return (
    <li className="listItem">
      <a href={link} className="menuLink">
        <Icon className="icons" />
        <span className="smallText">{text}</span>
      </a>
    </li>
  );
};

export default SidebarList;
