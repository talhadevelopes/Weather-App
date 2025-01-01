import WeatherSkeleton from "@/components/loading-skeleton";
import { useForecastQuery, useWeatherQuery } from "@/hooks/use-weather";
import { useSearchParams, useParams } from "react-router-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import CurrentWeather from "@/components/ui/CurrentWeather";
import HourlyTemperature from "@/components/ui/hourly-temperature";
import WeatherDetails from "@/components/ui/weather-details";
import WeatherForecast from "@/components/ui/weather-forecast";
import FavButton from "@/components/ui/favButton";

const CityPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();

  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-6">
          Failed to load weather data. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* My Location Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {params.cityName}, {weatherQuery.data?.sys?.country}
        </h1>

        {/* Favorite Button */}
        <div>
          <FavButton
            data={{ ...weatherQuery.data, name: params.cityName }}
          />
        </div>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col gap-4">
          <CurrentWeather
            data={weatherQuery.data}
            locationName={params.cityName}
          />
          <HourlyTemperature data={forecastQuery.data} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery.data} />
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default CityPage;
