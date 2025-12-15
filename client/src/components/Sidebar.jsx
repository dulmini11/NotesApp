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
        {expanded && (
          <div className="flex items-center gap-3 mb-8">
            <img
              src={UserImage}
              alt="profile"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <p className="text-xs text-gray-400">Good Day 👋</p>
              <h2 className="font-semibold text-gray-800">Omi.y</h2>
            </div>
          </div>
        )}

        {/* MENU */}
        <div className="space-y-2">
          <MenuItem icon={<LayoutDashboard size={expanded ? 18 : 28} />} label="Dashboard" expanded={expanded} />
          <MenuItem icon={<FileText size={expanded ? 18 : 28} />} label="All Notes" expanded={expanded} />
          <MenuItem icon={<Pin size={expanded ? 18 : 28} />} label="Pinned Notes" expanded={expanded} />
          <MenuItem icon={<Clock size={expanded ? 18 : 28} />} label="Recent Notes" expanded={expanded} />
          <MenuItem icon={<CheckSquare size={expanded ? 18 : 28} />} label="Checklists" expanded={expanded} />
          <MenuItem icon={<Calendar size={expanded ? 18 : 28} />} label="Calendar" expanded={expanded} />
          <MenuItem icon={<Tag size={expanded ? 18 : 28} />} label="Tags" expanded={expanded} />
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="space-y-4 flex flex-col items-center">
        {/* Create New Note */}
        <button className="w-full bg-blue-600 text-white rounded-2xl p-4 flex items-center justify-center gap-2 shadow-md mt-4">
          <Plus size={expanded ? 15 : 25} />
          {expanded && <span>Create New Note</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

/* MENU ITEM COMPONENT */
const MenuItem = ({ icon, label, expanded }) => {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-gray-600 hover:bg-gray-100 transition-all"
    >
      {icon}
      {expanded && <span className="text-sm">{label}</span>}
    </div>
  );
};
