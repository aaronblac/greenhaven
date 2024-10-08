/* eslint-disable max-len */

import * as functions from "firebase-functions";
import axios from "axios";

export interface Geometry {
    location: {
        lat: number;
        lng: number;
    };
    viewport?: {
        northeast: {
            lat: number;
            lng: number;
        };
        southwest: {
            lat: number;
            lng: number;
        };
    };
}

export interface Place {
    formatted_phone_number: string | undefined;
    geometry: Geometry;
    website?: string;
    url: string;
    formatted_address: string | undefined;
    place_id: string;
    name: string;
    vicinity: string;
    description?: string;
    rating?: number;
    photos?: Array<{
        photo_reference: string;
      }>;
    reviews?: Array<{
        author_name: string;
        rating: number;
        text: string;
        time: string;
    }>;
  }

const GOOGLE_API_KEY = functions.config().google.api_key;

export const getApiKey = functions.https.onRequest((req: functions.https.Request, res: functions.Response) => {
  res.status(200).send({apiKey: GOOGLE_API_KEY});
});

export const getAutocompleteSuggestions = functions.https.onRequest(async (req, res) => {
  const input = req.query.input as string;

  if (!input) {
    res.status(400).send("Input is required");
    return;
  }

  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/place/autocomplete/json", {
      params: {
        input,
        key: GOOGLE_API_KEY,
      },
    });

    res.status(200).send(response.data.predictions);
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error);
    res.status(500).send("Internal Server Error");
  }
});

export const searchByAddress = functions.https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
  const address = req.query.address as string;
  const radius = parseFloat(req.query.radius as string);
  const type = req.query.type as string || "park";


  if (!address || !radius) {
    res.status(400).send("Address and radius are required");
    return;
  }

  try {
    // Geocode the address to get latitude and longitude
    const geocodeResponse = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address,
        key: GOOGLE_API_KEY,
      },
    });

    if (geocodeResponse.data.results.length === 0) {
      res.status(404).send("Address not found");
      return;
    }

    const {lat, lng} = geocodeResponse.data.results[0].geometry.location;

    // Search for places nearby
    const placesResponse = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
      params: {
        location: `${lat},${lng}`,
        radius,
        type,
        key: GOOGLE_API_KEY,
      },
    });

    const places: Place[] = placesResponse.data.results;

    // Fetch additional details for each place
    for (const place of places) {
      const detailsResponse = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
        params: {
          place_id: place.place_id,
          key: GOOGLE_API_KEY,
        },
      });
      const details = detailsResponse.data.result;
      place.description = details.description || details.formatted_address || "";
      place.rating = details.rating;
      place.photos = details.photos ?
        details.photos.map((photo: unknown) => {
          const photoObj = photo as { photo_reference: string };
          return {photo_reference: photoObj.photo_reference};
        }) :
        [];
    }
    res.status(200).send(places);
  } catch (error) {
    console.error("Error searching for places:", error);
    res.status(500).send("Internal Server Error");
  }
});

export const searchByLocation = functions.https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
  const latitude = parseFloat(req.query.latitude as string);
  const longitude = parseFloat(req.query.longitude as string);
  const radius = parseFloat(req.query.radius as string);
  const type = req.query.type as string || "park";


  if (!latitude || !longitude || !radius) {
    res.status(400).send("Latitude, longitude, and radius are required");
    return;
  }

  try {
    // Search for places nearby using latitude and longitude
    const placesResponse = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
      params: {
        location: `${latitude},${longitude}`,
        radius,
        type,
        key: GOOGLE_API_KEY,
      },
    });

    const places: Place[] = placesResponse.data.results;

    // Fetch additional details for each place
    for (const place of places) {
      const detailsResponse = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
        params: {
          place_id: place.place_id,
          key: GOOGLE_API_KEY,
        },
      });
      const details = detailsResponse.data.result;
      place.description = details.description || details.formatted_address || "";
      place.rating = details.rating;
      place.photos = details.photos ?
        details.photos.map((photo: unknown) => {
          const photoObj = photo as { photo_reference: string };
          return {photo_reference: photoObj.photo_reference};
        }) :
        [];
    }

    res.status(200).send(places);
  } catch (error) {
    console.error("Error searching for places:", error);
    res.status(500).send("Internal Server Error");
  }
});

export const getPlaceDetails = functions.https.onRequest(async (req, res) => {
  const placeId = req.query.placeId as string;

  if (!placeId) {
    res.status(400).send("placeId is required");
    return;
  }

  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
      params: {
        place_id: placeId,
        key: GOOGLE_API_KEY,
        fields: "formatted_address,formatted_phone_number,website,url,geometry,reviews,rating,place_id,photos,vicinity,name",
      },
    });
    res.status(200).send(response.data.result);
  } catch (error) {
    console.error("Error fetching place details:", error);
    res.status(500).send("Internal Server Error");
  }
});

