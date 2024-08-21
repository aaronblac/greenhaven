import { useEffect, useState } from "react";
import { getUserFavorites } from "../services/userService";
import { fetchPlaceDetails } from "../services/searchService";
import ListView from "../components/SearchResults/list-view";
import { IonContent, IonGrid, IonImg, IonPage, IonRow, IonText } from "@ionic/react";
import { Place } from "../../functions/src/searchFunctions";
import { getApiKey } from "../services/apiService";

interface FavoritesProps {
    isAuthenticated: boolean;
    userId?: string;
}

const Favorites: React.FC<FavoritesProps> = ({ isAuthenticated, userId }) => {
    const [favorites, setFavorites] = useState<Place[]>([]);
    const [apiKey, setApiKey] = useState<string | null>(null);

    useEffect(() => {
        const fetchApiKeyAndFavorites = async () => {
            try {
                const key = await getApiKey();
                setApiKey(key);

                if (isAuthenticated && userId) {
                    const userFavoritesIds = await getUserFavorites(userId);
                    // Fetch full Place details for each favorite
                    const favoritePlaces = await Promise.all(
                        userFavoritesIds.map(async (placeId: string) => {
                            const placeDetails = await fetchPlaceDetails(placeId);
                            return placeDetails;
                        })
                    );

                    setFavorites(favoritePlaces);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setFavorites([]);
            }
        };

        fetchApiKeyAndFavorites();
    }, [isAuthenticated, userId]);

    return (
        <>
        <IonPage className="page-container ion-padding">
            <IonContent>
                <IonGrid>
                    <IonRow className="text-center full">
                        <h3 className="full">Favorite Havens</h3>
                    </IonRow>
                    <IonRow className="full favorites">
                        {favorites.length > 0 ? (
                            <ListView searchText="" places={favorites} isAuthenticated={isAuthenticated} userId={userId}/>
                        ) : (
                            <div className="ion-padding flex text-center flex-column justify-center full">
                                <IonText style={{margin:"0.5rem 0"}}>No Favorites saved yet! Return <a href="/home">home</a> to search for green spaces.</IonText>
                                <IonImg src='/images/forest-tree.png' alt='Tree' className="main-home-tree" />
                            </div>
                        )} 
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
        </>
    );
};

export default Favorites;
