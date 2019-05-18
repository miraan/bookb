import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => (
  <div className="App">
    <h1>Project Home</h1>
    {/* Link to List.js */}
    <Link to="./list">
      <button type="submit" variant="raised">
            My List
      </button>
    </Link>
  </div>
);

export default Home;
