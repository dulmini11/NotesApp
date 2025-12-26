import React, { useState } from 'react';
import { Search, X, ChevronDown } from "lucide-react";

const SearchBar = ({ searchQuery, setSearchQuery, resultsCount, sortBy, setSortBy, sortOrder, setSortOrder }) => {
  const [showSortMenu, setShowSortMenu] = useState(false);

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
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, description, category, or date..."
            className="w-full pl-12 pr-12 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 shadow-sm hover:shadow-md"
          />

          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-green-500 hover:shadow-md transition-all duration-200 text-gray-700 font-medium min-w-[140px]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <span>Sort</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
          </button>

          {showSortMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-gray-100 z-50 overflow-hidden">
              {/* Sort Options */}
              <div className="py-2">
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Sort by
                </div>
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={`w-full px-4 py-2.5 text-left hover:bg-green-50 transition-colors flex items-center justify-between ${
                      sortBy === option.value ? 'bg-green-50 text-green-700 font-semibold' : 'text-gray-700'
                    }`}
                  >
                    <span>{option.label}</span>
                    {sortBy === option.value && (
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200 my-1"></div>

              {/* Sort Order */}
              <div className="py-2">
                <button
                  onClick={toggleSortOrder}
                  className="w-full px-4 py-2.5 text-left hover:bg-green-50 transition-colors text-gray-700 font-medium"
                >
                  {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 border-2 border-red-200 hover:border-red-300 rounded-xl transition-all duration-200 text-red-600 hover:text-red-700 font-medium"
          >
            <X className="w-4 h-4" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Results Count */}
      {searchQuery && resultsCount !== undefined && (
        <div className="mt-3 text-sm text-gray-600">
          Found {resultsCount} {resultsCount === 1 ? 'note' : 'notes'}
        </div>
      )}
    </div>
  );
};

export default SearchBar;