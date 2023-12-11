import logo from './logo.svg';
import './App.css';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/auth/AuthDetails';
import MapComponent from './components/map/MapComponent';

function App() {
  return (
    <div className="App">
      {/* <SignIn></SignIn>
      <SignUp></SignUp>
      <AuthDetails></AuthDetails> */}
      <MapComponent></MapComponent>
    </div>
  );
}

export default App;
