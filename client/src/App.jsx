import {BrowserRouter,Router,Routes,Route} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/registerPage'
import VerifyCodePage from './pages/VerifyCodePage'
import Home from './pages/Home'
import AuthModal from './pages/AuthModal'
import { AuthProvider } from './contex/AuthContext'
import ClientPage from './pages/ClientPage'
import AdminPage from './pages/AdminPage'

function App() {
  return(
    <BrowserRouter>
   <AuthProvider>
    <Routes>
    <Route path='/' element= {<Home />} />
    <Route path='/login' element= {<LoginPage />} />
    <Route path='/registrar' element= {<RegisterPage />} />
    <Route path='/verificar-codigo' element={<VerifyCodePage />} />
    <Route path='/paginaCliente' element= {<ClientPage />} />
    <Route path='/paginaAdministrador' element= {<AdminPage />} />
    <Route path='/authModal' element= {<AuthModal />} />
    </Routes>
    </AuthProvider>
    </BrowserRouter>
   
    
  );
}

export default App
