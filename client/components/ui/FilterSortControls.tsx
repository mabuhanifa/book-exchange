"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; // Assuming you have a Checkbox component
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";

interface FilterOption {
  key: string;
  label: string;
  type: "text" | "select" | "checkbox";
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
  currentSort: { key: string; direction: "asc" | "desc" } | null;
  currentSearch: string; // Add current search query prop
  onFilterChange: (filters: Record<string, any>) => void; // Replace 'any'
  onSortChange: (
    sort: { key: string; direction: "asc" | "desc" } | null
  ) => void;
  onSearch?: (query: string) => void;
}

export default function FilterSortControls({
  availableFilters,
  availableSorts,
  currentFilters,
  currentSort,
  currentSearch,
  onFilterChange,
  onSortChange,
  onSearch,
}: FilterSortControlsProps) {
  const [searchQuery, setSearchQuery] = useState(currentSearch);

  // Update local search query state when currentSearch prop changes (e.g., from URL)
  useEffect(() => {
    setSearchQuery(currentSearch);
  }, [currentSearch]);

  const handleFilterInputChange = (key: string, value: any) => {
    // Pass the updated filters object back
    onFilterChange({ ...currentFilters, [key]: value });
  };

  const handleSortChange = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (currentSort?.key === key) {
      direction = currentSort.direction === "asc" ? "desc" : "asc";
    }
    // Pass the updated sort object back
    onSortChange({ key, direction });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  // Allow pressing Enter in search input to trigger search
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit(e as any); // Cast to any to match FormEvent
    }
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 border-b mb-4">
      {onSearch && (
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown} // Add key down handler
            className="w-auto"
          />
          <Button type="button" size="sm" onClick={handleSearchSubmit}>
            Search
          </Button>{" "}
          {/* Use type="button" to prevent form submission */}
        </div>
      )}

      {availableFilters.map((filter) => (
        <div key={filter.key} className="flex items-center space-x-2">
          <label>{filter.label}:</label>
          {filter.type === "text" && (
            <Input
              type="text"
              value={currentFilters[filter.key] || ""}
              onChange={(e) =>
                handleFilterInputChange(filter.key, e.target.value)
              }
              className="w-auto"
            />
          )}
          {filter.type === "select" && (
            <Select
              value={currentFilters[filter.key] || ""}
              onValueChange={(value) =>
                handleFilterInputChange(filter.key, value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={`Select ${filter.label}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                {filter.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {filter.type === "checkbox" && (
            <Checkbox
              checked={!!currentFilters[filter.key]}
              onCheckedChange={(checked) =>
                handleFilterInputChange(filter.key, checked)
              }
            />
          )}
        </div>
      ))}

      <div className="flex items-center space-x-2">
        <label>Sort By:</label>
        <Select
          value={currentSort?.key || ""}
          onValueChange={(value) => handleSortChange(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select sort option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {availableSorts.map((sort) => (
              <SelectItem key={sort.key} value={sort.key}>
                {sort.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {currentSort && (
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              onSortChange({
                ...currentSort,
                direction: currentSort.direction === "asc" ? "desc" : "asc",
              })
            }
          >
            {currentSort.direction === "asc" ? "▲ Asc" : "▼ Desc"}
          </Button>
        )}
      </div>
    </div>
  );
}
