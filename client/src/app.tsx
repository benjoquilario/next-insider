import { useState } from 'react';

function App() {
  const login = (url: string) => {
    window.location.href = url;
  };

  return (
    <>
      <button onClick={() => login('http://localhost:5000/auth/github')}>
        Github
      </button>
    </>
  );
}

export default App;
