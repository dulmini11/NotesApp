import { useState } from "react"; 
import {
  LayoutDashboard,
  FileText,
  Pin,
  Clock,
  CheckSquare,
  Calendar,
  Tag,
  Plus,
} from "lucide-react";
import { Link } from 'react-router-dom';
import UserImage from "../assets/user.jpg";

const Sidebar = () => {
  const [isMinimized, setIsMinimized] = useState(true); // default minimized
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const expanded = !isMinimized || isHovered;

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`h-screen bg-white rounded-3xl shadow-lg p-5 flex flex-col justify-between transition-all duration-300 ml-5 ${
        expanded ? "w-50" : "w-20"
      }`}
    >
      {/* TOP SECTION */}
      <div>
        {/* Profile */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <img
            src={UserImage}
            alt="profile"
            className={`rounded-full transition-all duration-300 mt-8 ${
              expanded ? "w-12 h-12" : "w-10 h-10"
            }`}
          />
          {expanded && (
            <div>
              <p className="text-xs text-gray-400">Good Day 👋</p>
              <h2 className="font-semibold text-gray-800">Omi.y</h2>
            </div>
          )}
        </div>

        {/* MENU */}
        <div className="space-y-2 mt-14 p-1">
          <MenuItem icon={<LayoutDashboard />} label="Dashboard" expanded={expanded} />
          <MenuItem icon={<FileText />} label="All Notes" expanded={expanded} />
          <MenuItem icon={<Pin />} label="Pinned Notes" expanded={expanded} />
          <MenuItem icon={<Clock />} label="Recent Notes" expanded={expanded} />
          <MenuItem icon={<CheckSquare />} label="Checklists" expanded={expanded} />
          <MenuItem icon={<Calendar />} label="Calendar" expanded={expanded} />
          <MenuItem icon={<Tag />} label="Tags" expanded={expanded} />
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

          {expanded && (
            <span className="whitespace-nowrap">
              Add New Note
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;

/* MENU ITEM COMPONENT */
const MenuItem = ({ icon, label, expanded }) => {
  return (
    <div
      className="flex items-center gap-3 px-1 py-3 rounded-xl cursor-pointer text-gray-600 hover:bg-gray-100 transition-all"
    >
      <div className={`transition-transform duration-300 ${expanded ? "scale-50" : "scale-75"}`}>
        {icon}
      </div>
      {expanded && <span className="text-sm">{label}</span>}
    </div>
  );
};
