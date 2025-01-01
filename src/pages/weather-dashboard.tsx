import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";
import { useGeolocation } from "@/hooks/use-geolocation";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useWeatherQuery, useForecastQuery, useReverseGeocodeQuery } from "@/hooks/use-weather";
import CurrentWeather from "@/components/ui/CurrentWeather";
import HourlyTemperature from "@/components/ui/hourly-temperature";
import WeatherDetails from "@/components/ui/weather-details";
import WeatherForecast from "@/components/ui/weather-forecast";
import FavouriteCities from "@/components/ui/FavouriteCities";

const WeatherDashboard = () => {
  const { coordinates, error: locationError, getLocation, isLoading: locationLoading } = useGeolocation();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);

  const handleRefresh = async () => {
    await getLocation();  // Wait for location to be fetched
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };

  // Show skeleton while loading geolocation
  if (locationLoading) {
    return <WeatherSkeleton />;
  }

  // Show error alert if there's an issue with geolocation
  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-6">
          <p>{locationError}</p>
          <Button onClick={getLocation} variant="outline" className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Show alert if coordinates are not available
  if (!coordinates || coordinates.lat === 0 || coordinates.lon === 0) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-6">
          <p>Please Enable Location Access to see your local weather.</p>
          <Button onClick={getLocation} variant="outline" className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Ensure that locationName is of type GeocodingResponse or undefined
  const locationName = locationQuery.data?.[0] || undefined;

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-6">
          <p>Failed to Fetch Data.</p>
          <Button onClick={getLocation} variant="outline" className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />;
  }

  // Main content section if location is available
  return (
    <div className="space-y-4">
      {/* My Location Section */}

<FavouriteCities />


      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-tight">
          My Location: {locationName?.name || "Unknown Location"}
        </h1>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRefresh}
          disabled={locationLoading} // Disable button while loading
        >
          <RefreshCw className={`h-4 w-4 ${locationLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <CurrentWeather data={weatherQuery.data} locationName={locationName} />

          <HourlyTemperature data={forecastQuery.data} />
        </div>

        <div className="grid gap-6 md:rid-cols-2 items-start">
          <WeatherDetails  data={weatherQuery.data}  />
          {/* Details and Forecast */}
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
