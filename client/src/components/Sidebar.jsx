import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Pin,
  Trash2,
  CheckSquare,
  Calendar,
  Lock,
  Plus,
} from "lucide-react";
import { Link } from 'react-router-dom';
import UserImage from "../assets/user.jpg";

const Sidebar = ({ expanded, setIsHovered }) => {
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed top-0 left-3 h-screen bg-white rounded-3xl shadow-lg p-5 flex flex-col justify-between transition-all duration-300
        ${expanded ? "w-52" : "w-20"}
      `}
    >
      {/* TOP SECTION */}
      <div>
        {/* Profile */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <img
            src={UserImage}
            alt="profile"
            className={`rounded-full transition-all duration-500 mt-8 ${
              expanded ? "w-12 h-12" : "w-10 h-10"
            }`}
          />
          {/* Profile Text */}
          <div
            className={`overflow-hidden transition-all duration-1000 ${
              expanded ? "max-w-full opacity-100 ml-2" : "max-w-0 opacity-0 ml-0"
            }`}
          >
            <p className="text-xs text-gray-400">Good Day 👋</p>
            <h2 className="font-semibold text-gray-800">Omi.y</h2>
          </div>
        </div>

        {/* MENU */}
        <div className="space-y-2 mt-14 p-1">
          <MenuItem icon={<LayoutDashboard />} label="Dashboard" to="/" expanded={expanded} />
          <MenuItem icon={<FileText />} label="All Notes" to="/allnotes" expanded={expanded} />
          <MenuItem icon={<Pin />} label="Pinned Notes" to="/pinned" expanded={expanded} />
          <MenuItem icon={<Lock />} label="Locked Notes" to="/locked" expanded={expanded} />
          <MenuItem icon={<CheckSquare />} label="Checklists" to="/checklists" expanded={expanded} />
          <MenuItem icon={<Calendar />} label="Calendar" to="/calendar" expanded={expanded} />
          <MenuItem icon={<Trash2 />} label="Trash" to="/trash" expanded={expanded} />
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="space-y-4 flex flex-col items-center">
        {/* Create New Note */}
        <Link
          to="/add"
          className={`bg-[#22cb0b] text-white rounded-2xl flex items-center justify-center shadow-md mt-4
            transition-all duration-300
            ${expanded ? "w-full p-3 gap-2" : "w-12 h-12 p-0"}
          `}
        >
          <Plus className="w-6 h-6" />
          <span
            className={`whitespace-nowrap overflow-hidden transition-all duration-1000 ${
              expanded ? "max-w-full opacity-100 ml-2" : "max-w-0 opacity-0 ml-0"
            }`}
          >
            Add New Note
          </span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;

/* MENU ITEM COMPONENT */
const MenuItem = ({ icon, label, expanded, to }) => {
  return (
    <Link to={to}>
      <div className="flex items-center gap-3 px-1 py-3 rounded-xl cursor-pointer text-gray-600 hover:bg-gray-100 transition-all duration-300">
        <div
          className={`transition-transform duration-500 ${
            expanded ? "scale-50" : "scale-75"
          }`}
        >
          {icon}
        </div>
        <span
          className={`text-sm overflow-hidden transition-all duration-1000 ${
            expanded ? "max-w-full opacity-100" : "max-w-0 opacity-0"
          }`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
};
