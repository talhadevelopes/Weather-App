import { useFavourites } from "@/hooks/use-favourite";
import { useWeatherQuery } from "@/hooks/use-weather";
import { Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"; // Adjust the path as per your project structure

interface FavouriteCityTabletProps {
  id: string;
  name: string;
  lat: number;
  lon: number;
  onRemove: (id: string) => void;
}

const FavouriteCities = () => {
  const { favourites, removeFromFavourites } = useFavourites();

  if (!favourites.length) {
    return null; // Return nothing if no favourites
  }

  return (
    <>
      <h1>Favourites</h1>
      <div className="flex gap-4 flex-wrap"> {/* Added flex layout and gap */}
        {favourites.map((fav) => (
          <FavouriteCityTablet
            key={fav.id}
            id={fav.id}
            name={fav.name}
            lat={fav.lat}
            lon={fav.lon}
            onRemove={removeFromFavourites.mutate}
          />
        ))}
      </div>
    </>
  );
};

const FavouriteCityTablet = ({
  id,
  name,
  lat,
  lon,
  onRemove,
}: FavouriteCityTabletProps) => {
  const navigate = useNavigate();
  const { data: weather, isLoading } = useWeatherQuery({ lat, lon });

  const handleNavigate = () => navigate(`/city/${name}?lat=${lat}&lon=${lon}`);

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation
    onRemove(id);
    toast.error(`Removed ${name} from favourites`);
  };

  return (
    <div
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      className="relative flex min-w-[250px] cursor-pointer items-center gap-3 rounded-lg border bg-card p-4 pr-8 shadow-sm transition-all hover:shadow-md"
    >
      {/* Remove Button */}
      <Button
        className="absolute right-1 top-1 h-6 w-6 rounded-full p-0 hover:text-destructive-foreground group-hover:opacity-100"
        onClick={handleRemove}
      >
        <X className="h-4 w-4" />
      </Button>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex h-8 items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : weather ? (
        <div className="flex items-center gap-2">
          {/* Weather Icon */}
          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
            alt={weather.weather[0].description}
            className="h-8 w-8"
          />
          {/* City Info */}
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{weather.sys.country}</p>
          </div>
          {/* Weather Details */}
          <div className="ml-auto text-right">
            <p className="text-xl font-bold">{Math.round(weather.main.temp)}°C</p>
            <p className="text-xs capitalize text-muted-foreground">
              {weather.weather[0].description}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FavouriteCities;
