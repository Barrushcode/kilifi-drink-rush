import React, { useState, useRef } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchSuggestions from './SearchSuggestions';
import { SearchSuggestion } from '@/hooks/useSearchSuggestions';
import { cn } from '@/lib/utils';

interface SmartSearchInputProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  setSelectedCategory: (category: string) => void;
  className?: string;
}

const SmartSearchInput: React.FC<SmartSearchInputProps> = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  onKeyPress,
  setSelectedCategory,
  className
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSuggestions(value.length >= 2);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (searchTerm.length >= 2) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Delay hiding suggestions to allow for suggestion clicks
    setTimeout(() => {
      setShowSuggestions(false);
    }, 150);
  };

  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'category') {
      setSelectedCategory(suggestion.text);
      setSearchTerm('');
    } else {
      setSearchTerm(suggestion.text);
      onSearch();
    }
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleSearchSubmit = () => {
    onSearch();
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Let SearchSuggestions handle navigation keys when visible
    if (showSuggestions && ['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
      return;
    }
    onKeyPress(e);
  };

  return (
    <div ref={containerRef} className={cn("relative flex", className)}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Search products... (e.g., 'Johnnie', 'Whisky')"
        value={searchTerm}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        className={cn(
          "px-4 py-2 rounded-l-lg border border-barrush-steel/30 bg-barrush-midnight/50",
          "text-barrush-platinum placeholder-barrush-platinum/60",
          "focus:outline-none focus:ring-2 focus:ring-rose-600 focus:border-rose-600",
          "w-80 transition-all duration-200",
          isFocused && "ring-2 ring-rose-600 border-rose-600"
        )}
      />
      <Button
        onClick={handleSearchSubmit}
        className="bg-rose-600 hover:bg-rose-500 px-3 py-2 rounded-r-lg rounded-l-none border border-l-0 border-rose-600 transition-colors duration-200"
      >
        <Search className="h-4 w-4" />
      </Button>
      
      <SearchSuggestions
        query={searchTerm}
        onSuggestionSelect={handleSuggestionSelect}
        onSearchSubmit={handleSearchSubmit}
        isVisible={showSuggestions}
        onVisibilityChange={setShowSuggestions}
      />
    </div>
  );
};

export default SmartSearchInput;