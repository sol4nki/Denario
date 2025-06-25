import './SearchBar.css';

function SearchBar() {
  return (
    <div className="main">
      <div className="logo">
        hi
      </div>
      <label htmlFor="fname">First name:</label>
      <input type="text" id="fname" placeholder="Search" />
    </div>
  );
}

export default SearchBar;
