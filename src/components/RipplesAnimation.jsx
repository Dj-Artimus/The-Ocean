import React, { useEffect, useState } from 'react';

const RipplesAnimation = () => {
  const [ripples, setRipples] = useState([]);

  // Generate random positions and size for ripples
  const generateRippleAttributes = () => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: `${10 + Math.random() * 30}px`, // Random size between 20px and 80px
  });

  // Create ripples at intervals
  useEffect(() => {
    const interval = setInterval(() => {
      setRipples((prevRipples) => [
        ...prevRipples,
        {
          id: Math.random(), // Unique ID for each ripple
          attributes: generateRippleAttributes(),
        },
      ]);

      // Remove old ripples to avoid too many in the DOM
      setRipples((prevRipples) => prevRipples.slice(-10));
    }, 2000); // Adjust interval time as needed

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute bg-sky-800 rounded-full opacity-70 animate-ripple"
          style={{
            top: ripple.attributes.top,
            left: ripple.attributes.left,
            width: ripple.attributes.size,
            height: ripple.attributes.size,
          }}
        />
      ))}
    </div>
  );
};

export default RipplesAnimation;
