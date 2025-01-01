import { WeatherData } from "@/api/types";
import { useFavourites } from "@/hooks/use-favourite";
import { Button } from "./button";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface FavouriteButtonProps {
  data: WeatherData;
}

const FavButton = ({ data }: FavouriteButtonProps) => {
  const { addToFavourites, removeFromFavourites, favourites } = useFavourites();

  // Check if the current city is in favourites
  const isCurrentFavourite = favourites.some(
    (fav) => fav.lat === data.coord.lat && fav.lon === data.coord.lon
  );

  // Toggle favourite status
  const handleFavouriteToggle = () => {
    if (isCurrentFavourite) {
      removeFromFavourites.mutate(`${data.coord.lat}-${data.coord.lon}`); 
      toast.error(`Removed ${data.name} from Favourites`)
    } else {
      addToFavourites.mutate({
        name: data.name,
        lat: data.coord.lat,
        lon: data.coord.lon,
        country: data.sys.country,
      });
      toast.success(`Added ${data.name} from Favourites`)
    }
  };

  return (
    <Button
      variant={isCurrentFavourite ? "default" : "outline"}
      size="icon"
      onClick={handleFavouriteToggle}
      title={isCurrentFavourite ? "Remove from favourites" : "Add to favourites"}
    >
      <Star
        className={`h-4 w-4 ${isCurrentFavourite ? "fill-current text-yellow-500" : ""}`}
      />
    </Button>
  );
};

export default FavButton;
