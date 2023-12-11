import logo from './logo.svg';
import './App.css';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/auth/AuthDetails';

function App() {
  return (
    <div className="App">
      <SignIn></SignIn>
      <SignUp></SignUp>
      <AuthDetails></AuthDetails>
    </div>
  );
}

export default App;
