import React, { useState } from 'react';
import { Search, X, ChevronDown } from "lucide-react";

const SearchBar = ({ searchQuery, setSearchQuery, resultsCount, sortBy, setSortBy, sortOrder, setSortOrder }) => {
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

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
          
          <div className="relative bg-white rounded-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <Search className={`w-4 h-4 transition-all duration-300 ${
                isFocused ? 'text-green-900 scale-110' : searchQuery ? 'text-green-700' : 'text-gray-400'
              }`} />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search by title, description, category, or date..."
              className="w-full pl-12 pr-12 py-4 text-gray-800 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none shadow-lg hover:shadow-xl hover:border-green-500 placeholder:text-gray-400 font-medium"
            />

            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-500 transition-all duration-300 z-10 hover:rotate-90 hover:scale-110"
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
            className="relative flex items-center gap-2 px-5 py-4 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl hover:border-green-500 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-gray-700 font-semibold min-w-[150px] overflow-hidden group"
          >
            {/* Shine Effect on Hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-40 group-hover:translate-x-full transition-all duration-700 -skew-x-12"></div>
            
            <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <span className="relative z-10">Sort</span>
            <ChevronDown className={`w-4 h-4 transition-all duration-300 relative z-10 ${
              showSortMenu ? 'rotate-180 text-green-500' : ''
            }`} />
          </button>

          {showSortMenu && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowSortMenu(false)}
              ></div>
              
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border-2 border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Sort Options */}
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Sort by
                  </div>
                  {sortOptions.map(option => (
                    <button
                      key={option.value}
                      onClick={() => handleSortChange(option.value)}
                      className={`w-full px-4 py-3 text-left transition-all duration-200 flex items-center justify-between group ${
                        sortBy === option.value 
                          ? 'bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 text-green-700 font-bold' 
                          : 'text-gray-700 font-medium hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent'
                      }`}
                    >
                      <span>{option.label}</span>
                      {sortBy === option.value && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-900 to-white animate-pulse shadow-lg shadow-green-400/50"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Gradient Divider */}
                <div className="relative h-px my-1 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>

                {/* Sort Order */}
                <div className="py-2">
                  <button
                    onClick={toggleSortOrder}
                    className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 text-gray-700 font-semibold flex items-center gap-2"
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
            className="relative flex items-center gap-2 px-5 py-4 bg-gradient-to-br from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 border-2 border-red-200 hover:border-red-400 rounded-2xl hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 text-red-600 hover:text-red-700 font-bold overflow-hidden group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300 relative z-10" />
            <span className="relative z-10">Clear</span>
          </button>
        )}
      </div>

      {/* Results Count */}
      {searchQuery && resultsCount !== undefined && (
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 px-4 py-2 rounded-full border-2 border-green-100 shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span>Found</span>
          <span className="px-2 py-0.5 bg-white rounded-full text-green-600 font-bold shadow-sm">{resultsCount}</span>
          <span>{resultsCount === 1 ? 'note' : 'notes'}</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;