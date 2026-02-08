import { useState } from "react";
import Country from "./Country";

const Countries = ({ countries }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <div>
      {countries.map((item) => (
        <div key={item.name.official}>
          {item.name.common}{" "}
          <button
            onClick={() => {
              setSelectedCountry(item);
            }}
          >
            Show
          </button>
        </div>
      ))}

      {selectedCountry && (
        <div>
          <Country country={selectedCountry} />
        </div>
      )}
    </div>
  );
};

export default Countries;
