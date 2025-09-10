"use client"

import { useMapsLibrary } from "@vis.gl/react-google-maps";
import React, { useEffect, useRef, useState } from "react";

type onPlaceSelect = (place: google.maps.places.PlaceResult | null) => void;

interface InputProps extends Omit<React.ComponentPropsWithRef<"input">, "children">{
    onPlaceSelect : onPlaceSelect,
}
  
export const PlaceAutoComplete = React.forwardRef<HTMLInputElement, InputProps>(({ onPlaceSelect, name, ...rest}, ref) => {
    const [placeAutocomplete, setPlaceAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const places = useMapsLibrary('places');
  
    useEffect(() => {
      if (!places || !inputRef.current) return;
  
      const options = {
        fields: ['geometry', 'formatted_address']
      };
  
      setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));

    }, [places]);
  
    useEffect(() => {
      if (!placeAutocomplete) return;
  
      const listener = placeAutocomplete.addListener('place_changed', () => {
        onPlaceSelect(placeAutocomplete.getPlace());
      });

      return () => listener.remove();
    }, [onPlaceSelect, placeAutocomplete]);
  
    return (
      <div className="autocomplete-container">
        <input ref={inputRef} name={name} className="border border-gray-200 p-2 rounded-md" {...rest}/>
      </div>
    );
})


PlaceAutoComplete.displayName = "PlaceAutoComplete";
