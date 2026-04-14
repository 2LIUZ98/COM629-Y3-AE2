import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './views/Home';
import ResultsPage from './views/Results';
import AllPage from './views/AllPage';
import NotFound from './views/NotFound';


export default function App() {
  const [colorTheme, setTheme] = useDarkMode();

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<ResultsPage />} />
        <Route path="/all" element={<AllPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
