import { Navbar, Welcome, Footer } from './components';
import './App.css'

const App = () => {
  return (
    <>
      <div className="min-h-screen">
        <div className="gradient-bg-welcome">
          <Navbar />
          <Welcome />
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;
