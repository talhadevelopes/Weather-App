import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useLocalStorage from "./use-local-storage";

interface FavouriteCity {
  id: string;
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
  addedAt: number;
}

export function useFavourites() {
  const [favourites, setFavourites] = useLocalStorage<FavouriteCity[]>(
    "favourites",
    []
  );
  const queryClient = useQueryClient();

  const favouritesQuery = useQuery({
    queryKey: ["favourites"],
    queryFn: () => favourites,
    initialData: favourites,
    staleTime: Infinity,
  });

  const addToFavourites = useMutation({
    mutationFn: async (city: Omit<FavouriteCity, "id" | "addedAt">) => {
      const newFavourite: FavouriteCity = {
        ...city,
        id: `${city.lat}-${city.lon}-${Date.now()}`,
        addedAt: Date.now(),
      };

      const updatedFavourites = favourites.filter(
        (item) => !(item.lat === city.lat && item.lon === city.lon)
      );
      const newFavourites = [newFavourite, ...updatedFavourites];

      setFavourites(newFavourites);
      return newFavourites;
    },
    onSuccess: (newFavourites) => {
      queryClient.setQueryData(["favourites"], newFavourites);
    },
  });

  const removeFromFavourites = useMutation({
    mutationFn: async (id: string) => {
      const updatedFavourites = favourites.filter((item) => item.id !== id);
      setFavourites(updatedFavourites);
      return updatedFavourites;
    },
    onSuccess: (updatedFavourites) => {
      queryClient.setQueryData(["favourites"], updatedFavourites);
    },
  });

  const clearFavourites = useMutation({
    mutationFn: async () => {
      setFavourites([]);
      return [];
    },
    onSuccess: () => {
      queryClient.setQueryData(["favourites"], []);
    },
  });

  return {
    favourites: favouritesQuery.data,
    addToFavourites,
    removeFromFavourites,
    clearFavourites,
  };
}
