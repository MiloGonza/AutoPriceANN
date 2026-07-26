import { Routes, Route, useLocation } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { NavAsideBar } from './components/NavAsideBar';
import { Home } from './pages/Home';
import DataSets from './pages/DataSets';
import AnimatedRoutes from './components/AnimatedRoutes';
import Train from './pages/Train';

function App() {
  const location = useLocation();
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    previousPath.current = location.pathname;
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-dark-card">
      <NavAsideBar />

      <main className="flex-1 overflow-hidden">
        <AnimatedRoutes location={location} previousPath={previousPath}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/datasets" element={<DataSets />} />
            <Route path='/train' element={<Train/>} />
          </Routes>
        </AnimatedRoutes>
      </main>
    </div>
  );
}

export default App;
