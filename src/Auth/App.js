import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';

function App() {
  // You would typically use React Router for navigation between pages
  const [showSignIn, setShowSignIn] = useState(true); // Toggle between sign-in and sign-up

  return (
    <div className="App">
      {showSignIn ? <SignIn /> : <SignUp />}
      <button onClick={() => setShowSignIn(!showSignIn)}>
        {showSignIn ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
      </button>
    </div>
  );
}

export default App;

