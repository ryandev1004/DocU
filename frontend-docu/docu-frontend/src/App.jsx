import Authorization from './components/auth/Authorization';
import DashboardPage from './pages/dashboard';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import WelcomePage from './pages/welcome';

import { Routes, Route} from 'react-router';

const App = () => {

  return ( 
    <Routes>
      <Route path='/' element={<WelcomePage/>}/>
      <Route path='/register' element={<RegisterPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>

      <Route 
        path='/dashboard' 
        element={
          <Authorization>
            <DashboardPage/>
          </Authorization>
        }
      />

    </Routes>
   );
}
 
export default App;