import { HashRouter } from 'react-router-dom'
import { Reshaped } from 'reshaped'
import AppRoutes from './routes'
import 'reshaped/themes/figma/theme.css';

const App = () => (
  <Reshaped theme='figma'>
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  </Reshaped>
)

export default App