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
  Moon,
  Sun,
} from "lucide-react";
import { Link } from 'react-router-dom';
import UserImage from "../assets/user.jpg";
import { useTheme } from "../contexts/ThemeContext";

const Sidebar = ({ expanded, setIsHovered }) => {
  const { theme, toggleTheme } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

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

  const HamburgerButton = () => (
    <button
      onClick={() => setIsMobileOpen(!isMobileOpen)}
      className="mobile-menu-button md:hidden fixed top-6 left-6 z-50 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
      style={{ marginBottom: '80px' }}
    >
      {isMobileOpen ? (
        <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      ) : (
        <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );

  const MobilePopupMenu = () => (
    <div className={`
      mobile-menu-popup
      fixed top-24 left-6 z-50 w-64 rounded-2xl shadow-2xl border
      transition-all duration-300 transform origin-top-left
      ${isMobileOpen ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}
      ${theme === 'dark' 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-200'
      }
    `}>
      {/* Profile Section */}
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="flex items-center gap-3">
          <img
            src={UserImage}
            alt="profile"
            className="w-12 h-12 rounded-full border-2 border-green-500"
          />
          <div>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Good Day 👋</p>
            <h2 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Omi.y</h2>
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

      {/* Improved Theme Toggle in Mobile Menu */}
      <div className={`px-4 py-3 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            {theme === 'dark' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </div>
          <button
            onClick={toggleTheme}
            className="relative w-14 h-7 rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              background: theme === 'dark' 
                ? 'linear-gradient(to right, #374151, #1f2937)' 
                : 'linear-gradient(to right, #60a5fa, #3b82f6)'
            }}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full shadow-lg transform transition-transform duration-300 flex items-center justify-center ${
                theme === 'dark' 
                  ? 'translate-x-7 bg-gray-700' 
                  : 'translate-x-0 bg-white'
              }`}
            >
              {theme === 'dark' ? (
                <Moon className="w-3 h-3 text-yellow-300" />
              ) : (
                <Sun className="w-3 h-3 text-yellow-500" />
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-100'}`}>
        <Link
          to="/add"
          onClick={() => setIsMobileOpen(false)}
          className="w-full bg-gradient-to-r from-[#22cb0b] to-green-500 text-white rounded-xl flex items-center justify-center gap-2 p-3 shadow-md hover:shadow-lg transition-all duration-300 mb-3"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Add New Note</span>
        </Link>
        
        <div className="flex justify-between px-2">
          <button className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
            theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
          }`}>
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
          <button className="flex items-center gap-2 text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  const DesktopSidebarContent = () => (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`
        fixed top-0 left-3 h-screen rounded-3xl shadow-lg p-5 flex flex-col justify-between transition-all duration-300 z-40
        ${expanded ? "w-52" : "w-20"}
        hidden md:flex
        ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}
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
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>Good Day 👋</p>
            <h2 className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Omi.y</h2>
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
        {/* Theme Toggle - IMPROVED VERSION */}
        <div className={`flex items-center gap-3 w-full ${expanded ? "justify-between" : "justify-center"}`}>
          {expanded && (
            <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>

              <span className="text-sm font-medium">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
          )}
          
          {expanded ? (
            // EXPANDED STATE: Full toggle switch
            <div className="relative group">
              <button
                onClick={toggleTheme}
                className="relative w-14 h-7 rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-gray-700 to-gray-800' 
                    : 'bg-gradient-to-r from-green-700 to-green-300'
                }`}></div>
                
                {/* Toggle knob with icon */}
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full shadow-lg transform transition-transform duration-300 flex items-center justify-center ${
                    theme === 'dark' 
                      ? 'translate-x-7 bg-gray-600' 
                      : 'translate-x-0 bg-white'
                  }`}
                >
                  {theme === 'dark' ? (
                    <Moon className="w-3 h-3 text-green-300" />
                  ) : (
                    <Sun className="w-3 h-3 text-green-500" />
                  )}
                </div>
                
                {/* Decorative stars for dark mode */}
                {theme === 'dark' && (
                  <>
                    <div className="absolute top-1 left-1 w-1 h-1 bg-white/30 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-1 right-2 w-0.5 h-0.5 bg-white/20 rounded-full animate-pulse delay-100"></div>
                  </>
                )}
              </button>
              
              {/* Tooltip for expanded state */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
              </div>
            </div>
          ) : (
            // MINIMIZED STATE: Compact icon button with animation
            <div className="relative group">
              <button
                onClick={toggleTheme}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 overflow-hidden ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-blue-100 hover:bg-blue-200'
                }`}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {/* Animated background */}
                <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-br from-gray-600 to-gray-800' 
                    : 'bg-gradient-to-br from-blue-50 to-blue-100'
                }`}></div>
                
                {/* Icon with rotation animation */}
                <div className={`relative z-10 transform transition-transform duration-500 ${
                  theme === 'dark' ? 'rotate-0' : 'rotate-180'
                }`}>
                  {theme === 'dark' ? (
                    <>
                      <Moon className="w-5 h-5 text-green-300" />
                    </>
                  ) : (
                    <>
                      <Sun className="w-5 h-5 text-green-500" />
                    </>
                  )}
                </div>
              </button>
              
              {/* Tooltip for minimized state */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </div>
            </div>
          )}
        </div>

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
  const { theme } = useTheme();
  
  return (
    <Link to={to}>
      <div className={`flex items-center gap-3 px-1 py-3 rounded-xl cursor-pointer transition-all duration-300
        ${theme === 'dark' 
          ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
        }`}
      >
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
  const { theme } = useTheme();
  
  return (
    <Link to={to} onClick={onClick}>
      <div className={`flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-300 my-1
        ${theme === 'dark' 
          ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-300' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
        }`}
      >
        <div className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
          {icon}
        </div>
        <span className="text-sm font-medium">
          {label}
        </span>
      </div>
    </Link>
  );
};