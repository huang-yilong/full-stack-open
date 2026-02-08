const Search = ({ searchTerm, handleSearch, disabled = false }) => {
  return (
    <div className="search">
      find countries
      <input
        value={searchTerm}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        disabled={disabled}
      />
    </div>
  );
};

export default Search;
