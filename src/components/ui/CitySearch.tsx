import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "./button";
import { useState } from "react";
import { Clock, Loader2, Search, XCircle } from "lucide-react";
import { useLocationSearch } from "@/hooks/use-weather";
import { CommandSeparator } from "cmdk";

import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/use-search-hsitory";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { data: locations, isLoading } = useLocationSearch(query);
  const navigate = useNavigate();
  const { history, clearHistory, addToHistory } = useSearchHistory();

  const handleSelect = (cityData: string) => {
    const [lat, lon, name, country] = cityData.split('|');
    // Add to Search History
    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country
    });
    setOpen(false);
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        variant="outline"
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search Cities...
      </Button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        {/* Input Field */}
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search City"
        />
        <CommandList>
          {/* No Results */}
          {query.length > 2 && !isLoading && (!locations || locations.length === 0) && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}

          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Recent Searches">
                <div className="flex items-center justify-between px-2 my-2">
                  <p className="text-xs text-muted-foreground">Recent Searches</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </div>

                {history.map((item) => (
                  <CommandItem
                    key={item.id} // Use the unique id for the key
                    value={`${item.name}, ${item.country}`}
                    onSelect={() => handleSelect(`${item.lat}|${item.lon}|${item.name}|${item.country}`)}
                  >
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {item.name}, {item.country}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}

          <CommandSeparator />
          {/* Suggestions or Loading */}
          <CommandGroup heading="Suggestions">
            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}

            {locations &&
              locations.map((location: any) => (
                <CommandItem
                  key={`${location.lat}-${location.lon}`}
                  value={`${location.name}, ${location.country}`}
                  onSelect={() => handleSelect(`${location.lat}|${location.lon}|${location.name}|${location.country}`)}
                >
                  <Search className="mr-2 h-4 w-4" />
                  <span>
                    {location.name}, {location.country}
                  </span>
                </CommandItem>
              ))}
          </CommandGroup>

          {/* Separator */}
          {locations && locations.length > 0 && <CommandSeparator />}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;
