import React, { lazy, Suspense } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  theme,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
const LoginPatient = lazy(() => import('./pages/LoginPatient'));
const LoginChemist = lazy(() => import("./pages/LoginChemist"));
const RegisterPatient = lazy(() => import('./pages/RegisterPatient'));
const RegisterChemist = lazy(() => import("./pages/RegisterChemist"));

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Router>
          <Routes>
            <Route path="/login/patient" element={<LoginPatient />} />
            <Route path="/login/chemist" element={<LoginChemist />} />
            <Route path="/register/patient" element={<RegisterPatient />} />
            <Route path="/register/chemist" element={<RegisterChemist />} />
          </Routes>
        </Router>
      </Box>
    </ChakraProvider>
  );
}

export default App;
