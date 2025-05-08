"use client";

export default function JobApplicationsFilters({
  statusFilter,
  onStatusChange,
  searchTerm,
  onSearchChange,
  showFavorites,
  onFavoritesToggle,
  statusOptions
}) {
  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };
  
  const handleStatusChange = (e) => {
    onStatusChange(e.target.value);
  };
  
  const handleFavoritesToggle = () => {
    onFavoritesToggle(!showFavorites);
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search by Company or Position
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {/* Status Filter */}
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={handleStatusChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Favorites Filter */}
        <div className="flex items-end">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showFavorites}
              onChange={handleFavoritesToggle}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Favorites only</span>
          </label>
        </div>
      </div>
    </div>
  );
} 