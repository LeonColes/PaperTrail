import { Routes, Route } from 'react-router-dom';

import Index from '../pages';
import Folders from '../pages/Folders';
import BatchRename from '../pages/BatchRename';
import HomeworkCheck from '../pages/HomeworkCheck';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path='/' element={<Index />} />
    <Route path='/folders' element={<Folders />} />
    <Route path='/batch-rename' element={<BatchRename />} />
    <Route path='/homework-check' element={<HomeworkCheck />} />
  </Routes>
);

export default AppRoutes;