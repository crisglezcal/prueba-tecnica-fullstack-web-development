// import { useState } from 'react'
// import './App.css'

// function App() {
//   return (
//     <>
//     </>
//   )
// }

// export default App

// Prueba GET

import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/test')
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>Prueba Backend → Frontend</h1>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : 'Cargando...'}
    </div>
  );
}

export default App;
