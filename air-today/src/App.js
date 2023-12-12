import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import AuthDetails from './components/auth/AuthDetails';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <Router>
        <div className="App">
          <div className="Content">
            <Routes>
              <Route path="/" element={<SignIn />}/>
              <Route path="/register" element={<SignUp />}/>
            </Routes>
          </div>
        </div>
      </Router>
      {/* <AuthDetails /> */}
    </div>
  );
}

export default App;
