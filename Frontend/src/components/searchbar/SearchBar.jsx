import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import axios from 'axios';
import "./searchBar.scss"

function SearchBar() {
  const [input, setInput] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (value) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8800/api/users/all');
      if (response && response.data && response.data.length > 0) {
        if (value) {
          const filteredData = response.data.filter(user =>
            user.name.toLowerCase().includes(value.toLowerCase())
          );
          setData(filteredData);
        } else {
          setData(response.data);
        }
      } else {
        setData([]);
      }
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (value) => {
    setInput(value);
    if (!value) {
      setData([]);
    } else {
      fetchData(value);
    }
  };

  return (
    <div className='searchBar'>
      <div className='search'>
        <SearchOutlinedIcon />
        <input
          type="text"
          placeholder="Search..."
          value={input}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      <div className="user-list"> 
        {data.map(user => (
          <Link key={user.id} to={`/profile/${user.id}`}>
            <div>{user.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;