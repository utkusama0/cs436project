// src/components/SpringTermInfo.jsx
import React, { useEffect, useState } from 'react';

const SPRING_TERM_URL = "https://us-central1-cs436termproject-460018.cloudfunctions.net/spring_term_info";

export default function SpringTermInfo() {
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try direct fetch first
        const response = await fetch(SPRING_TERM_URL, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Accept': 'application/json',
            'Origin': window.location.origin
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch term info');
        }
        
        const data = await response.json();
        setInfo(data);
      } catch (e) {
        console.error("Direct fetch failed:", e);
        
        // Try using proxy as fallback if available
        if (window.fetchTermInfo) {
          setIsUsingFallback(true);
          try {
            const proxyData = await window.fetchTermInfo();
            setInfo(proxyData);
          } catch (proxyError) {
            setError("Failed to fetch data: " + proxyError.message);
          }
        } else {
          setError(e.message);
        }
      }
    };
    
    fetchData();
  }, []);
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch term info');
        return res.json();
      })
      .then(setInfo)
      .catch(e => setError(e.message));
  }, []);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!info) return <div>Loading Spring Term Info...</div>;

  return (
    <div className="card my-4">
      <div className="card-header">2025 Spring Term Information</div>
      <div className="card-body">
        <p><strong>Term:</strong> {info.term}</p>
        <p><strong>Registration Opens:</strong> {info.registration_opens}</p>
        <p><strong>Classes Start:</strong> {info.classes_start}</p>
        <p>{info.message}</p>
      </div>
    </div>
  );
}
