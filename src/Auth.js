import { useState } from "react";
import supabase from "./supabaseClient";

const Auth = () =>{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) console.error(error);
  };
    const handleSignIn = async () => {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) console.error(error);
  };
    return (
    <div>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleSignUp}>Sign Up</button>
        <button onClick={handleSignIn}>Sign In</button>
        </div>
    );

};

export default Auth;