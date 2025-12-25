import React from 'react';
import { Search, X } from "lucide-react";

const SearchBar = ({ searchQuery, setSearchQuery, resultsCount }) => {
  
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="max-w-2xl mx-auto mb-20">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, description, category, or date..."
          className="w-full pl-12 pr-12 py-4 text-gray-700 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 shadow-sm hover:shadow-md"
        />

        {/* Clear Button */}
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

      {/* Results Count */}
      {searchQuery && resultsCount !== undefined && (
        <div className="mt-3 text-sm text-gray-600 text-center">
          Found {resultsCount} {resultsCount === 1 ? 'note' : 'notes'}
        </div>
      )}
    </div>
  );
};

export default SearchBar;