import { useState } from 'react';
import './App.css';
import Main from './components/main/Main';
import SignIn from './components/signIn';

function App() {
  const [role, setRole] = useState(null)
  return (
    <div className="App">
      {role ? <Main role={role}/> : <SignIn setRole={setRole} />}
    </div>
  );
}

export default App;
