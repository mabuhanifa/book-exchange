'use client';

import React, { useState } from 'react';
// Import Shadcn Select, Checkbox, Button, Input later

interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'checkbox';
  options?: { value: string; label: string }[]; // For select
}

interface SortOption {
  key: string;
  label: string;
}

interface FilterSortControlsProps {
  availableFilters: FilterOption[];
  availableSorts: SortOption[];
  currentFilters: Record<string, any>; // Replace 'any'
  currentSort: { key: string; direction: 'asc' | 'desc' } | null;
  onFilterChange: (filters: Record<string, any>) => void; // Replace 'any'
  onSortChange: (sort: { key: string; direction: 'asc' | 'desc' } | null) => void;
  onSearch?: (query: string) => void;
}

export default function FilterSortControls({ availableFilters, availableSorts, currentFilters, currentSort, onFilterChange, onSortChange, onSearch }: FilterSortControlsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterInputChange = (key: string, value: any) => {
    onFilterChange({ ...currentFilters, [key]: value });
  };

  const handleSortChange = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (currentSort?.key === key) {
      direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    }
    onSortChange({ key, direction });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 border-b mb-4">
      {onSearch && (
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
          {/* Shadcn Input */}
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {/* Shadcn Button */}
          <button type="submit">Search</button>
        </form>
      )}

      {availableFilters.map(filter => (
        <div key={filter.key}>
          <label className="mr-2">{filter.label}:</label>
          {filter.type === 'text' && (
            {/* Shadcn Input */}
            <input
              type="text"
              value={currentFilters[filter.key] || ''}
              onChange={(e) => handleFilterInputChange(filter.key, e.target.value)}
            />
          )}
          {filter.type === 'select' && (
            {/* Shadcn Select */}
            <select value={currentFilters[filter.key] || ''} onChange={(e) => handleFilterInputChange(filter.key, e.target.value)}>
              <option value="">All</option>
              {filter.options?.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          )}
          {filter.type === 'checkbox' && (
            {/* Shadcn Checkbox */}
            <input
              type="checkbox"
              checked={!!currentFilters[filter.key]}
              onChange={(e) => handleFilterInputChange(filter.key, e.target.checked)}
            />
          )}
        </div>
      ))}

      <div>
        <label className="mr-2">Sort By:</label>
        {/* Shadcn Select or Buttons */}
        <select value={currentSort?.key || ''} onChange={(e) => handleSortChange(e.target.value)}>
           <option value="">None</option>
           {availableSorts.map(sort => (
             <option key={sort.key} value={sort.key}>{sort.label}</option>
           ))}
        </select>
        {currentSort && (
          <button onClick={() => onSortChange({ ...currentSort, direction: currentSort.direction === 'asc' ? 'desc' : 'asc' })}>
            {currentSort.direction === 'asc' ? '▲' : '▼'}
          </button>
        )}
      </div>
    </div>
  );
}
