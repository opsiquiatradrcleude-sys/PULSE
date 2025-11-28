import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Moments from './pages/Moments';
import SpeedMatch from './pages/SpeedMatch';
import ChatRouter from './pages/Chat';
import ProfileView from './pages/Profile';
import Places from './pages/Places';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="moments" element={<Moments />} />
          <Route path="speed-match" element={<SpeedMatch />} />
          <Route path="places" element={<Places />} />
          <Route path="chat" element={<ChatRouter />} />
          <Route path="chat/:id" element={<ChatRouter />} />
          <Route path="profile" element={<ProfileView />} />
          <Route path="profile/:id" element={<ProfileView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;