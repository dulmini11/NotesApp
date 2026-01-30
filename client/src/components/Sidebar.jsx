import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Pin,
  Trash2,
  CheckSquare,
  Calendar,
  Lock,
  Plus,
  Menu,
  X,
  LogOut,
  Settings,
} from "lucide-react";
import { Link } from 'react-router-dom';
import UserImage from "../assets/user.jpg";

const Sidebar = ({ expanded, setIsHovered }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isMobileOpen) {
        const menuButton = document.querySelector('.mobile-menu-button');
        const menuPopup = document.querySelector('.mobile-menu-popup');
        if (menuPopup && !menuPopup.contains(event.target) && 
            menuButton && !menuButton.contains(event.target)) {
          setIsMobileOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isMobileOpen]);

  // Mobile Hamburger Button with margin bottom
  const HamburgerButton = () => (
    <button
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      className="mobile-menu-button md:hidden fixed top-6 left-6 z-50 p-3 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
      style={{ marginBottom: '80px' }} // Creates gap for page content
    >
      {isMobileOpen ? (
        <X className="w-6 h-6 text-gray-700" />
      ) : (
        <Menu className="w-6 h-6 text-gray-700" />
      )}
    </button>
  );

  // Mobile Popup Menu
  const MobilePopupMenu = () => (
    <div className={`
      mobile-menu-popup
      fixed top-24 left-6 z-50 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200
      transition-all duration-300 transform origin-top-left
      ${isMobileOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}
    `}>
      {/* Profile Section */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src={UserImage}
            alt="profile"
            className="w-12 h-12 rounded-full border-2 border-green-500"
          />
          <div>
            <p className="text-xs text-gray-400">Good Day 👋</p>
            <h2 className="font-semibold text-gray-800">Omi.y</h2>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        <MenuItemMobile icon={<LayoutDashboard />} label="Dashboard" to="/" onClick={() => setIsMobileOpen(false)} />
        <MenuItemMobile icon={<FileText />} label="All Notes" to="/allnotes" onClick={() => setIsMobileOpen(false)} />
        <MenuItemMobile icon={<Pin />} label="Pinned Notes" to="/pinned" onClick={() => setIsMobileOpen(false)} />
        <MenuItemMobile icon={<Lock />} label="Locked Notes" to="/locked" onClick={() => setIsMobileOpen(false)} />
        <MenuItemMobile icon={<CheckSquare />} label="Checklists" to="/checklists" onClick={() => setIsMobileOpen(false)} />
        <MenuItemMobile icon={<Calendar />} label="Calendar" to="/calendar" onClick={() => setIsMobileOpen(false)} />
        <MenuItemMobile icon={<Trash2 />} label="Trash" to="/trash" onClick={() => setIsMobileOpen(false)} />
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-100">
        <Link
          to="/add"
          onClick={() => setIsMobileOpen(false)}
          className="w-full bg-gradient-to-r from-[#22cb0b] to-green-500 text-white rounded-xl flex items-center justify-center gap-2 p-3 shadow-md hover:shadow-lg transition-all duration-300 mb-3"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Add New Note</span>
        </Link>
        
        <div className="flex justify-between px-2">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
          <button className="flex items-center gap-2 text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Desktop Sidebar Content (unchanged)
  const DesktopSidebarContent = () => (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        fixed top-0 left-3 h-screen bg-white rounded-3xl shadow-lg p-5 flex flex-col justify-between transition-all duration-300 z-40
        ${expanded ? "w-52" : "w-20"}
        hidden md:flex
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

  return (
    <>
      <HamburgerButton />
      {isMobile && <MobilePopupMenu />}
      <DesktopSidebarContent />
      
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;

/* DESKTOP MENU ITEM COMPONENT */
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

/* MOBILE MENU ITEM COMPONENT */
const MenuItemMobile = ({ icon, label, to, onClick }) => {
  return (
    <Link to={to} onClick={onClick}>
      <div className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer text-gray-600 hover:bg-gray-100 transition-all duration-300 my-1">
        <div className="text-gray-500">
          {icon}
        </div>
        <span className="text-sm font-medium">
          {label}
        </span>
      </div>
    </Link>
  );
};