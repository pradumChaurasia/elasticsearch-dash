import React from "react";
import { MdPeopleAlt } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";

import Badge from "@mui/material/Badge";

function Navbar() {
  document.body.style.margin = '0';

  return (
    <div className="w-full flex fixed items-center justify-center bg-white h-[3.5rem] mt-0 pt-0" style={{marginTop:"-55px"}}>
      
      <div className="flex items-center justify-center gap-x-6">
        <div className="flex items-center justify-center">
          <MdPeopleAlt className="w-[25px] h-[25px] text-gray-500" />
        </div>
        <div className="flex items-center justify-center">
          <Badge badgeContent={1} color="primary">
            <IoNotifications className="w-[25px] h-[25px] text-gray-500" />
          </Badge>
        </div>
        <div className="flex items-center justify-center">
          <img
            src="https://picsum.photos/200/300"
            className="rounded-full w-[30px] h-[30px]"
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
