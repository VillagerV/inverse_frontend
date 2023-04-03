import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataFetcher = () => {
  const [data, setData] = useState(null);
  const [backendData, setBackendData] = useState(null);
  const [url, setUrl] = useState('');

  useEffect(() => {
    const fetchUrlData = async () => {
      if (url) {
        try {
          const queryParams = new URLSearchParams(url.split('?')[1]);
          const searchVal = queryParams.get('searchVal') || '';
          const returnGeom = queryParams.get('returnGeom') || '';
          const getAddrDetails = queryParams.get('getAddrDetails') || '';
          const pageNum = queryParams.get('pageNum') || '';

          const backendUrl = `/api/fetch?searchVal=${searchVal}&returnGeom=${returnGeom}&getAddrDetails=${getAddrDetails}&pageNum=${pageNum}`;

          const response = await axios.get(url);
          setData(response.data);
          fetchBackendData(backendUrl);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchUrlData();
  }, [url]);

  const fetchBackendData = async (frontendUrl) => {
    try {
      const response = await axios.get(frontendUrl);
      setBackendData(response.data);
    } catch (error) {
      console.error('Error fetching data from backend:', error);
    }
  };

  useEffect(() => {
    const savedUrl = localStorage.getItem('savedUrl');
    if (savedUrl) {
      setUrl(savedUrl);
    }
  }, []);

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    localStorage.setItem('savedUrl', newUrl);
  };

  return (
    <div>
      <h1>Data Fetcher</h1>
      <label htmlFor="url-input">URL:</label>
      <input
        id="url-input"
        type="text"
        value={url}
        onChange={handleUrlChange}
        placeholder="Enter URL here"
      />
      {data && (
        <div>
          <h2>Frontend Results</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
      {backendData && (
        <div>
          <h2>Backend Results</h2>
          <pre>{JSON.stringify(backendData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default DataFetcher;
