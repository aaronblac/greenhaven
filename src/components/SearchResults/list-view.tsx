import React, { useEffect, useState } from "react";
import {
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonImg,
  IonIcon,
} from "@ionic/react";
import { Place } from "../../../functions/src/searchFunctions";
import { getApiKey } from "../../services/apiService";
import { heart, star, starOutline } from "ionicons/icons";
import {
  addToFavorites,
  getUserFavorites,
  removeFromFavorites,
} from "../../services/userService";
import { useHistory } from "react-router";

interface ListViewProps {
  places: Place[];
  isAuthenticated: boolean;
  userId?: string;
  searchText: string;
}

const ListView: React.FC<ListViewProps> = ({
  places,
  isAuthenticated,
  userId,
  searchText,
}) => {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const key = await getApiKey();
        setApiKey(key);
      } catch (error) {
        console.error("Error fetching API key:", error);
      }
    };

    fetchApiKey();
    if (isAuthenticated && userId) {
      const fetchFavorites = async () => {
        try {
          const userFavorites = await getUserFavorites(userId);
          setFavorites(userFavorites);
        } catch (error) {
          console.error("Error fetching user favorites:", error);
        }
      };

      fetchFavorites();
    }
  }, [isAuthenticated, userId]);

  const getPhotoUrl = (
    photoReference: string,
    maxWidth: number,
    maxHeight: number
  ) => {
    if (!apiKey) return "/images/forest-tree.png";
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&maxheight=${maxHeight}&photoreference=${photoReference}&key=${apiKey}`;
  };

  const toggleFavorite = async (placeId: string) => {
    if (!isAuthenticated || !userId) return;

    const isFavorite = favorites.includes(placeId);
    try {
      if (isFavorite) {
        await removeFromFavorites(userId, placeId);
        setFavorites(favorites.filter((id) => id !== placeId));
      } else {
        await addToFavorites(userId, placeId);
        setFavorites([...favorites, placeId]);
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const handleCardClick = (place: Place) => {
    history.replace({
      pathname: `/place/${place.place_id}`,
      state: {
        place,
        searchText,
        results: places,
        view: "list",
      },
    });
  };

  return (
    <IonList className="scrolling-list full">
      {places.map((place, index) => (
        <IonCard
          className="ion-padding flex"
          key={index}
          onClick={() => handleCardClick(place)}
        >
          <div className="flex gap-16 full">
            <IonImg
              className="list-item-img"
              src={
                place.photos && place.photos.length > 0
                  ? getPhotoUrl(place.photos[0].photo_reference, 50, 50)
                  : "/images/forest-tree.png"
              }
              alt={place.name}
            />
            <IonLabel>
              <h2>{place.name}</h2>
              <p>{place.vicinity}</p>
            </IonLabel>
            <div className="flex flex-column items-end justify-between favorite-review">
              <div className="flex ion-align-items-center gap-4">
                {place.rating ? (
                  <>
                    <span>{place.rating.toFixed(1)}</span>
                    <IonIcon color="warning" icon={star} ios={star} md={star} />
                  </>
                ) : (
                  <IonIcon icon={starOutline} />
                )}
              </div>
              {isAuthenticated && (
                <IonIcon
                  color="primary"
                  style={{ zIndex: 2 }}
                  icon={favorites.includes(place.place_id) ? heart : ""}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(place.place_id);
                  }}
                />
              )}
            </div>
          </div>
        </IonCard>
      ))}
    </IonList>
  );
};

export default ListView;
