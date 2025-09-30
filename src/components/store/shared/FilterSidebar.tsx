'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

interface FilterOption {
  id: string
  label: string
  checked: boolean
}

interface FilterSidebarProps {
  category: string
  onFilterChange: (filters: Record<string, FilterOption[]>) => void
  onClearAll: () => void
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange, onClearAll }) => {
  const [filters, setFilters] = useState({
    supermarketType: [
      { id: 'dailys', label: 'Dailys', checked: true },
      { id: 'ebeano', label: 'Ebeano', checked: false },
      { id: 'globus', label: 'Globus', checked: false },
      { id: 'bokku', label: 'Bokku', checked: false },
      { id: 'mamma', label: 'Mamma', checked: false }
    ],
    categories: [
      { id: 'dairy-eggs', label: 'Dairy & Eggs', checked: true },
      { id: 'fresh-produce', label: 'Fresh Produce', checked: false },
      { id: 'snacks', label: 'Snacks', checked: false },
      { id: 'beverages', label: 'Beverages', checked: false },
      { id: 'bakery', label: 'Bakery', checked: false },
      { id: 'frozen-foods', label: 'Frozen Foods', checked: false },
      { id: 'household-essentials', label: 'Household Essentials', checked: false },
      { id: 'baby-kids', label: 'Baby & Kids', checked: false },
      { id: 'pantry-staples', label: 'Pantry Staples', checked: false },
      { id: 'cleaning-supplies', label: 'Cleaning Supplies', checked: false },
      { id: 'personal-care', label: 'Personal Care', checked: false }
    ],
    popularPicks: [
      { id: 'best-sellers', label: 'Best Sellers', checked: true },
      { id: 'customer-favorites', label: 'Customer Favorites', checked: false },
      { id: 'new-arrivals', label: 'New Arrivals', checked: false },
      { id: 'staff-picks', label: 'Staff Picks', checked: false },
      { id: 'budget-friendly', label: 'Budget-Friendly', checked: false }
    ],
    promotions: [
      { id: 'on-sale', label: 'On Sale', checked: true },
      { id: 'bundle-deals', label: 'Bundle Deals', checked: false },
      { id: 'buy-1-get-1', label: 'Buy 1 get 1 free', checked: false }
    ]
  })

  const handleCheckboxChange = (section: keyof typeof filters, optionId: string) => {
    const updatedFilters = {
      ...filters,
      [section]: filters[section].map(option =>
        option.id === optionId ? { ...option, checked: !option.checked } : option
      )
    }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const getActiveFilters = () => {
    const active: string[] = []
    Object.values(filters).forEach(section => {
      section.forEach(option => {
        if (option.checked) active.push(option.label)
      })
    })
    return active
  }

  const activeFilters = getActiveFilters()

  return (
    <div className="w-64 bg-white p-6 border-r border-gray-200 ">
      <h2 className="text-lg font-semibold text-[#212121] mb-6">Filter by</h2>
      
      {/* Supermarket Type */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">Supermarket Type</h3>
        <div className="space-y-3">
          {filters.supermarketType.map((option) => (
            <Label key={option.id} className="flex items-center">
              <Checkbox
                checked={option.checked}
                onCheckedChange={() => handleCheckboxChange('supermarketType', option.id)}
                className="mr-3 h-5 w-5"
              />
              <span className="text-base text-gray-600 font-light">{option.label}</span>
            </Label>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">By Categories</h3>
        <div className="space-y-3">
          {filters.categories.map((option) => (
            <Label key={option.id} className="flex items-center">
              <Checkbox
                checked={option.checked}
                onCheckedChange={() => handleCheckboxChange('categories', option.id)}
                className="mr-3 h-5 w-5"
              />
              <span className="text-base text-gray-600 font-light">{option.label}</span>
            </Label>
          ))}
        </div>
      </div>

      {/* Popular Picks */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">Popular Picks</h3>
        <div className="space-y-3">
          {filters.popularPicks.map((option) => (
            <Label key={option.id} className="flex items-center">
              <Checkbox
                checked={option.checked}
                onCheckedChange={() => handleCheckboxChange('popularPicks', option.id)}
                className="mr-3 h-5 w-5"
              />
              <span className="text-base text-gray-600 font-light">{option.label}</span>
            </Label>
          ))}
        </div>
      </div>

      {/* Promotions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-300 mb-4">By Promotion</h3>
        <div className="space-y-3">
          {filters.promotions.map((option) => (
            <Label key={option.id} className="flex items-center">
              <Checkbox
                checked={option.checked}
                onCheckedChange={() => handleCheckboxChange('promotions', option.id)}
                className="mr-3 h-5 w-5"
              />
              <span className="text-base text-gray-600 font-light">{option.label}</span>
            </Label>
          ))}
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-gray-300">Active Filter</h3>
            <Button
              variant="link"
              onClick={onClearAll}
              className="text-sm text-red-300 underline hover:text-red-400 p-0 h-auto"
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-400 text-white"
              >
                {filter}
                <X className="ml-1 w-3 h-3" />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default FilterSidebar
