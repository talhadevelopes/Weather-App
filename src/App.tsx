import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Layout from './components/Layout';
import { ThemeProvider } from 'next-themes'; // Ensure `next-themes` is compatible with your setup
import WeatherDashboard from './pages/weather-dashboard';
import CityPage from './pages/city-page';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        retry: false,
        refetchOnWindowFocus: false,
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" attribute="class">
          <Layout>
            <Routes>
              <Route path="/" element={<WeatherDashboard />} />
              <Route path="/city/:cityName" element={<CityPage />} />
            </Routes>
          </Layout>
        </ThemeProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;


