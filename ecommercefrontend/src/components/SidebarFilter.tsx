import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FilterOption {
  label: string;
  count?: number;
  min?: number;
  max?: number | null;
}

interface FilterSections {
  [key: string]: FilterOption[];
}

interface SelectedFilters {
  [key: string]: string[];
}

interface SidebarFilterProps {
  filters: FilterSections;
  onFilterChange: (section: string, value: string) => void;
  selectedFilters: SelectedFilters;
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({
  filters,
  onFilterChange,
  selectedFilters,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    PRICE: true,
    RATING: true,
    VISIBILITY: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="bg-white p-4">
      {Object.entries(filters).map(([section, options]) => (
        <div key={section} className="border-b border-gray-200 py-4">
          <button
            className="flex items-center justify-between w-full text-left font-medium"
            onClick={() => toggleSection(section)}
          >
            {section}
            {expandedSections[section] ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {expandedSections[section] && (
            <div className="mt-2 space-y-2">
              {options.map((option) => (
                <label key={option.label} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                    checked={selectedFilters[section]?.includes(option.label)}
                    onChange={() => onFilterChange(section, option.label)}
                  />
                  <span className="text-sm text-gray-600">
                    {option.label}
                    {option.count !== undefined && (
                      <span className="text-gray-400 ml-1">({option.count})</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SidebarFilter;