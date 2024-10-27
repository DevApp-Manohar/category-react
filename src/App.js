import { Navigate, Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Login from './pages/Login';

function App() {
  return (
    <div className="App">
      <BrowserRouter basename="/category-react">
      <Routes>
        <Route path='/' element={<Navigate to="/login" />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/home' element={<Home />} />
      </Routes>
      </BrowserRouter>
    
    </div>
  );
}

export default App;
