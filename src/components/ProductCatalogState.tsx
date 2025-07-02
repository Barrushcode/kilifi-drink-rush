
import { useState, useEffect } from 'react';

export const useProductCatalogState = () => {
  const [searchInput, setSearchInput] = useState('');
  const [actualSearchTerm, setActualSearchTerm] = useState(''); // The term actually used for searching
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAuditReport, setShowAuditReport] = useState(false);

  // Handle search when user presses Enter or clicks search button
  const handleSearch = () => {
    setActualSearchTerm(searchInput.trim());
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [actualSearchTerm, selectedCategory]);

  return {
    searchInput,
    setSearchInput,
    actualSearchTerm,
    setActualSearchTerm,
    selectedCategory,
    setSelectedCategory,
    currentPage,
    setCurrentPage,
    showAuditReport,
    setShowAuditReport,
    handleSearch,
    handleKeyPress
  };
};
