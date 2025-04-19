import { Routes, Route } from 'react-router-dom'

import Index from '../pages'

const AppRoutes = ()=> (
  <Routes>
    <Route path='/' element={<Index />}>
    </Route>
  </Routes>
)

export default AppRoutes