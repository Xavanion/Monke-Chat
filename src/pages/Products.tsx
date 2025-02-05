import React, { useEffect, useState } from 'react';

function Products() {
  const [data, setData] = useState<any>(null); // State to store the fetched data
  const [error, setError] = useState<string | null>(null); // State to store errors

  useEffect(() => {
    // Fetch data from the protected API endpoint
    fetch('/api/protected', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setData(data); // Store the fetched data in state
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message); // Store the error message in state
      });
  }, []); // Empty dependency array ensures this runs only once on mount

  if (error) {
    return <div>Error: {error}</div>; // Display error message if there's an error
  }

  if (!data) {
    return <div>Loading...</div>; // Display a loading message while fetching data
  }

  return (
    <div>
      <h1>Products</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre> {/* Display the fetched data */}
    </div>
  );
}

export default Products;
