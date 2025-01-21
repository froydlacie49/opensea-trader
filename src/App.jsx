import React, { useState } from 'react';
import { Loader } from './components/Loader';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  // Add this before any async operations
  const handleSomeAction = async () => {
    setIsLoading(true);
    try {
      // Your async operations here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      {/* ...existing code... */}
    </>
  );
}

export default App;
