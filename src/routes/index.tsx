import { Routes, Route } from 'react-router-dom'

import Home from '../pages'

const AppRoutes = ()=> (
  <Routes>
    <Route path='/' element={<Home />} />
  </Routes>
)

export default AppRoutes