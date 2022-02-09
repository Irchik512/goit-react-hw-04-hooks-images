import { useState } from 'react';
import PropTypes from 'prop-types';
import 'style.css';
import { toast } from 'react-toastify';
import { ReactComponent as SearchIcon } from 'icons/search.svg';

export default function Searchbar({ onSubmit }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleChange = e => {
    setSearchQuery(e.currentTarget.value.toLowerCase());
  };

  const handleSubmit = e => {
    e.preventDefault();
    const trimQuery = searchQuery.trim();
    if (trimQuery === '') {
      return toast.error('There is nothing to find. Try again!', {
        theme: 'colored',
      });
    }
    onSubmit(trimQuery);
    setSearchQuery('');
  };

  return (
    <header className="searchbar">
      <form className="searchForm" onSubmit={handleSubmit}>
        <button type="submit" className="searchForm-button">
          <SearchIcon></SearchIcon>
        </button>

        <input
          className="searchForm-input"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={searchQuery}
          onChange={handleChange}
        />
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};
