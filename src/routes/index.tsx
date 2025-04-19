import { Routes, Route } from 'react-router-dom';

import Index from '../pages';

const AppRoutes: React.FC = ()=> (
  <Routes>
    <Route path='/' element={<Index />}>
    </Route>
  </Routes>
);

export default AppRoutes;