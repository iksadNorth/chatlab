import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chat from '../components/chat';
import Image from '../components/image';

export default function RouteComponent() {
    return (
      <BrowserRouter>
        <Routes>
  
          <Route path="/chat/:roomId" element={<Chat />}/>

          <Route path="/image" element={<Image />}/>
  
        </Routes>
      </BrowserRouter>
    );
  }