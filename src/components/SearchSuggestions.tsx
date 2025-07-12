import React, { useState, useRef, useEffect } from 'react';
import { Search, Tag, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearchSuggestions, SearchSuggestion } from '@/hooks/useSearchSuggestions';

interface SearchSuggestionsProps {
  query: string;
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
  onSearchSubmit: () => void;
  isVisible: boolean;
  onVisibilityChange: (visible: boolean) => void;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  onSuggestionSelect,
  onSearchSubmit,
  isVisible,
  onVisibilityChange
}) => {
  const { suggestions, loading } = useSearchSuggestions(query);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            onSuggestionSelect(suggestions[selectedIndex]);
          } else {
            onSearchSubmit();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onVisibilityChange(false);
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, suggestions, selectedIndex, onSuggestionSelect, onSearchSubmit, onVisibilityChange]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  // Reset selection when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  if (!isVisible || (!loading && suggestions.length === 0)) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-barrush-midnight/95 backdrop-blur-sm border border-barrush-steel/30 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
      {loading && (
        <div className="flex items-center gap-3 px-4 py-3 text-barrush-platinum/60">
          <Search className="h-4 w-4 animate-spin" />
          <span className="text-sm">Searching...</span>
        </div>
      )}
      
      {!loading && suggestions.length > 0 && (
        <div className="py-2">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              ref={el => suggestionRefs.current[index] = el}
              className={cn(
                "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150",
                "hover:bg-barrush-steel/20",
                selectedIndex === index && "bg-barrush-steel/30"
              )}
              onClick={() => onSuggestionSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {suggestion.type === 'category' ? (
                <Tag className="h-4 w-4 text-rose-400 flex-shrink-0" />
              ) : (
                <Package className="h-4 w-4 text-barrush-copper flex-shrink-0" />
              )}
              
              <div className="flex-1 min-w-0">
                <div className="text-barrush-platinum text-sm font-medium truncate">
                  {suggestion.title}
                </div>
                {suggestion.category && (
                  <div className="text-barrush-platinum/60 text-xs truncate">
                    in {suggestion.category}
                  </div>
                )}
              </div>
              
              {suggestion.type === 'category' && (
                <span className="text-xs text-rose-400/80 bg-rose-400/10 px-2 py-1 rounded-full flex-shrink-0">
                  Category
                </span>
              )}
            </div>
          ))}
          
          {query.length >= 2 && (
            <div className="border-t border-barrush-steel/20 mt-2 pt-2">
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-150",
                  "hover:bg-barrush-steel/20 text-barrush-platinum/80"
                )}
                onClick={onSearchSubmit}
              >
                <Search className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">
                  Search for "<span className="font-medium text-barrush-platinum">{query}</span>"
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;