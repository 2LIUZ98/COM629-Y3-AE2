import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from "./views/Home";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />

      </Routes>
    </>
  );
}
