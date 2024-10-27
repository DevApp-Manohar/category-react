import { Navigate, Route, Routes, HashRouter } from 'react-router-dom';
import './App.css';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <div className="App">
      <HashRouter>
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Home />} />
      </Routes>
      </HashRouter>
      
    </div>
  );
}

export default App;
