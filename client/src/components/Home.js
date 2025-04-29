import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Dynamic Form Creator</h1>
      <nav>
        <ul>
          <li><Link to="/create">Create New Form</Link></li>
          {/* Add links to view existing forms/responses later */}
          <li><Link to="/view/test-form-id">View Example Form</Link></li>
          <li><Link to="/responses/test-form-id">View Example Responses</Link></li>
        </ul>
      </nav>
    </div>
  );
}

export default Home;
