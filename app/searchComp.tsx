import React, { useState } from 'react';
import { useDocsSearch } from 'fumadocs-core/search/client';

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const client = useDocsSearch({
    type: 'static',
  });

  const handleSearch = async (searchQuery: string) => {
    const searchResults = await client.setSearch(searchQuery);
    setResults(searchResults as any);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e) => {
          const newQuery = e.target.value;
          setQuery(newQuery);
          if (newQuery.length > 2) {
            handleSearch(newQuery);
          } else {
            setResults([]);
          }
        }}
        className="search-input"
      />
      <div className="search-results">
        {results.map((result, index) => (
          <div key={index} className="search-result">
            <a href={result.url} className="search-result-title">
              {result.title}
            </a>
            <p className="search-result-description">{result.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
