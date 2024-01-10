import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomerList from './Components/ElasticSearchdata';

function App() {
  return (
    <div>
      <CustomerList/>
    </div>
  );
}

export default App;
