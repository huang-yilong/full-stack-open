import { useEffect, useState } from "react";
import Search from "./components/Search";
import Result from "./components/Result";
import countriesService from "./services/countries";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    countriesService
      .getAll()
      .then((data) => {
        setCountries(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("无法加载国家数据");
        setLoading(false);
      });
  }, []);

  const handleSearch = (term) => {
    if (loading) {
      return;
    }
    const filtered =
      term.trim().length === 0
        ? countries
        : countries.filter((country) =>
            country.name.common
              .toLowerCase()
              .includes(term.trim().toLowerCase()),
          );
    setSearchTerm(term);
    setFilteredCountries(filtered);
  };

  return (
    <>
      <Search
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        disabled={loading}
      />
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}
      {!loading && !error && <Result filteredCountries={filteredCountries} />}
    </>
  );
}

export default App;
