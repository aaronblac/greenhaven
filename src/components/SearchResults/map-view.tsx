import React, { useEffect, useRef } from "react";
import { getApiKey } from "../../services/apiService";
import { IonCard } from "@ionic/react";
import { useHistory } from "react-router";

interface MapViewProps {
  places: any[];
  searchText: string;
}

const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (
      typeof window.google === "object" &&
      typeof window.google.maps === "object"
    ) {
      resolve();
      return;
    }

    // Check if the script is already being added
    const existingScript = document.querySelector(
      `script[src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker"]`
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      existingScript.addEventListener("error", () =>
        reject(new Error("Failed to load Google Maps script"))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject(new Error("Failed to load Google Maps script"));
    };

    document.head.appendChild(script);
  });
};

const MapView: React.FC<MapViewProps> = ({ places, searchText }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const history = useHistory();

  useEffect(() => {
    const initializeMap = async () => {
      try {
        const apiKey = await getApiKey();
        await loadGoogleMapsScript(apiKey);

        if (!window.google) {
          console.error("Google Maps JavaScript API library must be loaded.");
          return;
        }

        const map = new google.maps.Map(mapRef.current!, {
          center: {
            lat: places[0]?.geometry?.location?.lat || 0,
            lng: places[0]?.geometry?.location?.lng || 0,
          },
          zoom: 10,
          mapId: "fd3614e7cc6165ea",
        });

        if (!google.maps.marker || !google.maps.marker.AdvancedMarkerElement) {
          console.error("Google Maps marker library must be loaded.");
          return;
        }

        places.forEach((place) => {
          const position = new google.maps.LatLng(
            place.geometry.location.lat,
            place.geometry.location.lng
          );

          const customMarkerElement = document.createElement('div');
          customMarkerElement.style.backgroundImage = 'url(/images/forest-tree.png)'; // Replace with your image URL
          customMarkerElement.style.backgroundSize = 'cover';
          customMarkerElement.style.width = '30px'; // Set the width of the marker
          customMarkerElement.style.height = '30px'; // Set the height of the marker
          customMarkerElement.style.position = 'relative';
          customMarkerElement.style.transform = 'translate(-50%, -100%)';

          const marker = new google.maps.marker.AdvancedMarkerElement({
            position,
            map,
            title: place.name,
            content: customMarkerElement,
          });

          const infoWindow = new google.maps.InfoWindow();

          marker.addListener("gmp-mouseover", () => {
            infoWindow.setContent(place.name);
            infoWindow.open({
              anchor: marker,
              map,
              shouldFocus: false, // Prevents the map from focusing on the marker
            });
          });

          marker.addListener("gmp-mouseout", () => {
            infoWindow.close();
          });

          marker.addListener("click", () => {
            history.push({
              pathname: `/place/${place.place_id}`,
              state: {
                place,
                searchText,
                results: places,
                view: "map",
              },
            });
          });
        });
      } catch (error) {
        console.error("Error loading Google Maps script:", error);
      }
    };

    initializeMap();
  }, [places, history]);

  return (
    <IonCard className="full" style={{ height: "calc(100dvh - 19rem)" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </IonCard>
  );
};

export default MapView;
