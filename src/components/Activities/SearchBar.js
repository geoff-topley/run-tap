import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";

const SearchBar = ({
  searchCriteria,
  changeActivitySearchValue,
  searchActivities,
  clearSearch,
}) => {
  return (
    <InputGroup>
      <FormControl
        placeholder="Search"
        aria-label="Search"
        aria-describedby="basic-addon2"
        onChange={changeActivitySearchValue}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            searchActivities();
          }
        }}
        value={searchCriteria}
      />
      <InputGroup.Append>
        <Button variant="outline-secondary" onClick={searchActivities}>
          Search
        </Button>
        <Button variant="outline-secondary" onClick={clearSearch}>
          Clear
        </Button>
      </InputGroup.Append>
    </InputGroup>
  );
};

export default SearchBar;
