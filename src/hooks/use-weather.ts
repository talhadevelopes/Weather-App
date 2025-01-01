import { Coordinates } from "@/api/types";
import { weatherAPI } from "@/api/weather";
import { useQuery } from "@tanstack/react-query";

// Defining query keys with coordinates
export const WEATHER_KEYS = {
    weather: (coords: Coordinates) => ['weather', coords] as const,
    forecast: (coords: Coordinates) => ['forecast', coords] as const,
    location: (coords: Coordinates) => ['location', coords] as const,
    search: (query: string) => ['location-search', query] as const,
} as const;

// Hook for fetching current weather
export function useWeatherQuery(coordinates: Coordinates | null) {
    return useQuery({
        queryKey: WEATHER_KEYS.weather(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => coordinates ? weatherAPI.getCurrentWeather(coordinates) : null,
        enabled: !!coordinates,
    });
}

// Hook for fetching forecast
export function useForecastQuery(coordinates: Coordinates | null) {
    return useQuery({
        queryKey: WEATHER_KEYS.forecast(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => coordinates ? weatherAPI.getForecast(coordinates) : null,
        enabled: !!coordinates,
    });
}

// Hook for reverse geocoding (getting location name from coordinates)
export function useReverseGeocodeQuery(coordinates: Coordinates | null) {
    return useQuery({
        queryKey: WEATHER_KEYS.location(coordinates ?? { lat: 0, lon: 0 }),
        queryFn: () => coordinates ? weatherAPI.reverseGeocode(coordinates) : null,
        enabled: !!coordinates,
    });
}

// Hook for searching locations by query
export function useLocationSearch(query: string) {
    return useQuery({
        queryKey: WEATHER_KEYS.search(query),
        queryFn: () => query.length >= 3 ? weatherAPI.searchLocations(query) : null,
        enabled: query.length >= 3,
    });
}
