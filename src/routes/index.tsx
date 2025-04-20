import { Routes, Route } from 'react-router-dom';

import Index from '../pages';
import Folders from '../pages/Folders';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path='/' element={<Index />} />
    <Route path='/folders' element={<Folders />} />
  </Routes>
);

export default AppRoutes;