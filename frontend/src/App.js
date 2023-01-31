import React, { lazy, Suspense } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Fallback from './components/Fallback';
import NavBar from './components/NavBar';
import { useSelector } from 'react-redux';
const LoginPatient = lazy(() => import('./pages/LoginPatient'));
const LoginChemist = lazy(() => import("./pages/LoginChemist"));
const RegisterPatient = lazy(() => import('./pages/RegisterPatient'));
const RegisterChemist = lazy(() => import("./pages/RegisterChemist"));
const Home = lazy(() => import("./pages/Home"));
const SetAddress = lazy(() => import("./pages/SetAddress"));

function App() {

  const user = useSelector(state => state.user.user)

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Suspense fallback={<Fallback />}>
          <Router>
            <NavBar user={user} />
            <Routes>
              <Route path="/login/patient" element={<LoginPatient />} />
              <Route path="/login/chemist" element={<LoginChemist />} />
              <Route path="/register/patient" element={<RegisterPatient />} />
              <Route path="/register/chemist" element={<RegisterChemist />} />
              <Route path="/home" element={<Home />} />
              <Route path='/set/address' element={<SetAddress />} />
            </Routes>
          </Router>
        </Suspense>
      </Box>
    </ChakraProvider>
  );
}

export default App;
