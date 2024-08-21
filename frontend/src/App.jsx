import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Navbar, Welcome, Footer, Redirect, NotFound } from './components';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <div className="gradient-bg-welcome">
          <Navbar />
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/:shortUrl" element={<Redirect />} />
            <Route path="/404" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
