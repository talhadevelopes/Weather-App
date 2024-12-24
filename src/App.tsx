import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Layout from './components/Layout';
import { ThemeProvider } from 'next-themes';  // Importing next-themes' ThemeProvider
import WeatherDashboard from './pages/weather-dashboard';
import CityPage from './pages/city-page';

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" attribute="class"> {/* Default theme set to 'dark' */}
        <Layout>
          <Routes>
            <Route path="/" element={<WeatherDashboard />} />
            <Route path="/city/:cityName" element={<CityPage />} />
          </Routes>
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
