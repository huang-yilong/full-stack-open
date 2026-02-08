import Country from "./Country";
import Countries from "./Countries";

const Result = ({ filteredCountries }) => {
  if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }
  if (filteredCountries.length > 1 && filteredCountries.length <= 10) {
    return <Countries countries={filteredCountries} />;
  }
  if (filteredCountries.length === 1) {
    return <Country country={filteredCountries[0]} />;
  }
  return null;
};

export default Result;
