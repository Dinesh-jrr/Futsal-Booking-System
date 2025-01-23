import React from "react";
import logo from '../../assets/logo.png';
import './sidebar.css';
import SidebarList from "./SidebarList";
// importeed icons
import {IoMdSpeedometer,IoMdSettings} from 'react-icons/io'
const Sidebar = () =>{
    return(
        <div className="sideBar-main">

            <div className="logoDiv">
                <img src={logo} alt="FootLock" />
            </div>

            <div className="menuDiv">
                <ul className="menulists">
                    <SidebarList 
                        icon={IoMdSpeedometer} 
                        text="Dashboard" 
                        link="#dashboard" 
                    />
                    <SidebarList 
                        icon={IoMdSettings} 
                        text="Users" 
                        link="#settings" 
                    />
                    <SidebarList 
                        icon={IoMdSpeedometer} 
                        text="Futsal" 
                        link="#dashboard" 
                    />
                    <SidebarList 
                        icon={IoMdSettings} 
                        text="Bookings" 
                        link="#settings" 
                    />
                    <SidebarList 
                        icon={IoMdSpeedometer} 
                        text="Payments" 
                        link="#dashboard" 
                    />
                    <SidebarList 
                        icon={IoMdSettings} 
                        text="Logout" 
                        link="#settings" 
                    />
                    
                </ul>
            </div>
        </div>
    )
}

export default Sidebar