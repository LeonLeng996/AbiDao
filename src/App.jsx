import React from 'react';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

import Grant from './pages/Grant';
import ApplyNft from './pages/ApplyNft';
import Spawn from './pages/Spawn';
import Propose from './pages/Propose';
import Attend from './pages/Attend';
import Vote from './pages/Vote';



function App() {

  return (
    <Router>
    <div className="pt-20">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/Grant" element={<Grant />}/>
        <Route path="/ApplyNft" element={<ApplyNft />}/>
        <Route path="/Spawn" element={<Spawn />}/>
        <Route path="/Propose" element={<Propose />}/>
        <Route path="/Vote" element={<Vote />} />
        <Route path="/Attend" element={<Attend />}/>

      </Routes>
    </div>
    </Router>
  )
}

export default App
