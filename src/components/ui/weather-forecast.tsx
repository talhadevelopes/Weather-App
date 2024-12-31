import { ForecastData } from "@/api/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface WeatherForecastProps {
  data: ForecastData;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humidity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

const WeatherForecast = ({ data }: WeatherForecastProps) => {
  // Group forecasts by day and calculate min/max temperatures
  const dailyForecasts = data.list.reduce((acc: Record<string, DailyForecast>, forecast) => {
    const date = format(new Date(forecast.dt * 1000), "yyyy-MM-dd");

    if (!acc[date]) {
      acc[date] = {
        date: forecast.dt,
        temp_min: forecast.main.temp_min,
        temp_max: forecast.main.temp_max,
        humidity: forecast.main.humidity,
        wind: forecast.wind.speed,
        weather: forecast.weather[0],
      };
    } else {
      acc[date].temp_min = Math.min(acc[date].temp_min, forecast.main.temp_min);
      acc[date].temp_max = Math.max(acc[date].temp_max, forecast.main.temp_max);
    }
    return acc;
  }, {});

  // Convert the grouped data into an array for rendering
  const nextDays = Object.values(dailyForecasts).slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Day Weather Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {nextDays.map((nextDay, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
            >
              {/* Date */}
              <div>
                <p className="text-sm font-medium">
                  {format(new Date(nextDay.date * 1000), "EEE, MMM d")}
                </p>
              </div>
              {/* Icon */}
              <div>
                <img
                  src={`https://openweathermap.org/img/wn/${nextDay.weather.icon}@2x.png`}
                  alt={nextDay.weather.description}
                  className="w-10 h-10"
                />
              </div>
              {/* Temperature */}
              <div>
                <p className="text-sm">Min: {nextDay.temp_min.toFixed(1)}°C</p>
                <p className="text-sm">Max: {nextDay.temp_max.toFixed(1)}°C</p>
              </div>
              {/* Humidity & Wind */}
              <div>
                <p className="text-sm">Humidity: {nextDay.humidity}%</p>
                <p className="text-sm">Wind: {nextDay.wind} m/s</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;
