import { Routes, Route } from 'react-router-dom';

import Index from '../pages';
import Files from '../pages/Files';
import Upload from '../pages/Upload';
import Folders from '../pages/Folders';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path='/' element={<Index />} />
    <Route path='/files' element={<Files />} />
    <Route path='/upload' element={<Upload />} />
    <Route path='/folders' element={<Folders />} />
  </Routes>
);

export default AppRoutes;