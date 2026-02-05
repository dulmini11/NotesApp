import React, { useState } from 'react';
import { Search, X, ChevronDown } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const SearchBar = ({ searchQuery, setSearchQuery, resultsCount, sortBy, setSortBy, sortOrder, setSortOrder }) => {
  const { theme } = useTheme();
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Theme-based styling
  const searchBgClass = theme === 'dark'
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';

  const placeholderClass = theme === 'dark'
    ? 'placeholder-gray-500'
    : 'placeholder-gray-400';

  const clearIconClass = theme === 'dark'
    ? 'text-gray-500 hover:text-red-400'
    : 'text-gray-400 hover:text-red-500';

  const sortButtonBgClass = theme === 'dark'
    ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
    : 'bg-gradient-to-br from-white to-gray-50 border-gray-200';

  const sortButtonTextClass = theme === 'dark'
    ? 'text-gray-300'
    : 'text-gray-700';

  const sortMenuBgClass = theme === 'dark'
    ? 'bg-gray-900 border-gray-700'
    : 'bg-white border-gray-100';

  const sortHeaderClass = theme === 'dark'
    ? 'text-gray-500'
    : 'text-gray-500';

  const sortOptionTextClass = theme === 'dark'
    ? 'text-gray-300'
    : 'text-gray-700';

  const sortOptionActiveBgClass = theme === 'dark'
    ? 'bg-gradient-to-r from-green-900/30 via-emerald-900/20 to-green-900/30 text-green-300'
    : 'bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 text-green-700';

  const sortOptionHoverBgClass = theme === 'dark'
    ? 'hover:bg-gradient-to-r hover:from-gray-800 hover:to-transparent'
    : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent';

  const orderButtonHoverBgClass = theme === 'dark'
    ? 'hover:bg-gradient-to-r hover:from-blue-900/30 hover:to-indigo-900/30'
    : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50';

  const orderButtonTextClass = theme === 'dark'
    ? 'text-gray-300'
    : 'text-gray-700';

  const clearButtonBgClass = theme === 'dark'
    ? 'bg-gradient-to-br from-red-900/20 to-rose-900/20 border-red-800'
    : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200';

  const clearButtonHoverBgClass = theme === 'dark'
    ? 'hover:from-red-900/30 hover:to-rose-900/30 hover:border-red-700'
    : 'hover:from-red-100 hover:to-rose-100 hover:border-red-400';

  const clearButtonTextClass = theme === 'dark'
    ? 'text-red-400 hover:text-red-300'
    : 'text-red-600 hover:text-red-700';

  const resultsCountBgClass = theme === 'dark'
    ? 'bg-gradient-to-r from-green-900/20 via-emerald-900/15 to-green-900/20 border-green-800'
    : 'bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-green-100';

  const resultsCountTextClass = theme === 'dark'
    ? 'text-gray-300'
    : 'text-gray-700';

  const resultsNumberBgClass = theme === 'dark'
    ? 'bg-gray-800 text-green-300'
    : 'bg-white text-green-600';

  const dividerClass = theme === 'dark'
    ? 'via-gray-600'
    : 'via-gray-300';

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const sortOptions = [
    { value: 'pinned', label: 'Pinned' },
    { value: 'date', label: 'Date' },
    { value: 'name', label: 'Title by Letter' },
    { value: 'category', label: 'Category' },
  ];

  const handleSortChange = (value) => {
    setSortBy(value);
    setShowSortMenu(false);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setSortBy('date');
    setSortOrder('desc');
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || sortBy !== 'date' || sortOrder !== 'desc';

  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="flex gap-3 items-center">
        {/* Search Input with Enhanced Design */}
        <div className="relative flex-1 group">
          <div className={`relative rounded-2xl ${searchBgClass}`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Search className={`w-4 h-4 transition-all duration-300 ${
                isFocused 
                  ? theme === 'dark' ? 'text-green-400 scale-110' : 'text-green-900 scale-110'
                  : searchQuery 
                    ? theme === 'dark' ? 'text-green-400' : 'text-green-700'
                    : theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`} />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search by title, description, category, or date..."
              className={`w-full pl-12 pr-12 py-4 bg-transparent border-2 rounded-2xl focus:outline-none shadow-lg hover:shadow-xl transition-all duration-300 ${
                theme === 'dark'
                  ? 'border-gray-700 hover:border-green-500 focus:border-green-500 text-gray-200'
                  : 'border-gray-200 hover:border-green-500 focus:border-green-500 text-gray-800'
              } ${placeholderClass} font-medium`}
            />

            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-all duration-300 z-10 hover:rotate-90 hover:scale-110 ${clearIconClass}`}
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Sort Dropdown with Modern Design */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className={`relative flex items-center gap-2 px-5 py-4 border-2 rounded-2xl hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 font-semibold min-w-[150px] overflow-hidden group ${sortButtonBgClass} ${sortButtonTextClass} ${
              theme === 'dark' 
                ? 'hover:border-green-500' 
                : 'hover:border-green-500'
            }`}
          >
            {/* Shine Effect on Hover */}
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${theme === 'dark' ? 'gray-700' : 'white'} to-transparent opacity-0 group-hover:opacity-40 group-hover:translate-x-full transition-all duration-700 -skew-x-12`}></div>
            
            <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <span className="relative z-10">Sort</span>
            <ChevronDown className={`w-4 h-4 transition-all duration-300 relative z-10 ${
              showSortMenu ? (theme === 'dark' ? 'rotate-180 text-green-400' : 'rotate-180 text-green-500') : ''
            }`} />
          </button>

          {showSortMenu && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowSortMenu(false)}
              ></div>
              
              <div className={`absolute right-0 mt-2 w-60 rounded-2xl shadow-2xl border-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${sortMenuBgClass}`}>
                {/* Sort Options */}
                <div className="py-2">
                  <div className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${sortHeaderClass}`}>
                    Sort by
                  </div>
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center justify-between group ${
                        sortBy === option.value 
                          ? `${sortOptionActiveBgClass} font-bold` 
                          : `${sortOptionTextClass} font-medium ${sortOptionHoverBgClass}`
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.value && (
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full animate-pulse shadow-lg ${
                            theme === 'dark' ? 'bg-green-400 shadow-green-400/50' : 'bg-green-900 shadow-green-400/50'
                          }`}></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Gradient Divider */}
                <div className="relative h-px my-1 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${dividerClass} to-transparent`}></div>
                </div>

                {/* Sort Order */}
                <div className="py-2">
                  <button
                    onClick={toggleSortOrder}
                    className={`w-full px-4 py-3 text-left transition-all duration-200 font-semibold flex items-center gap-2 ${orderButtonTextClass} ${orderButtonHoverBgClass}`}
                  >
                    <span className="text-lg">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className={`relative flex items-center gap-2 px-5 py-4 border-2 rounded-2xl hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 font-bold overflow-hidden group ${clearButtonBgClass} ${clearButtonHoverBgClass} ${clearButtonTextClass}`}
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300 relative z-10" />
            <span className="relative z-10">Clear</span>
          </button>
        )}
      </div>

      {/* Results Count */}
      {searchQuery && resultsCount !== undefined && (
        <div className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border-2 shadow-sm ${resultsCountBgClass} ${resultsCountTextClass}`}>
          <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-green-400' : 'bg-green-500'} animate-pulse`}></div>
          <span>Found</span>
          <span className={`px-2 py-0.5 rounded-full font-bold shadow-sm ${resultsNumberBgClass}`}>{resultsCount}</span>
          <span>{resultsCount === 1 ? 'note' : 'notes'}</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;