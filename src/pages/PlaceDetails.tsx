import { IonButton, IonContent, IonGrid, IonIcon, IonImg, IonItem, IonLabel, IonList, IonPage, IonRow, IonSegment, IonSegmentButton, IonText, IonTextarea } from "@ionic/react"
import { Place } from "../../functions/src/searchFunctions";
import { useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { getApiKey } from "../services/apiService";
import { addToFavorites, getUserFavorites, removeFromFavorites } from "../services/userService";
import { arrowBack, ear, earth, earthOutline, heart, heartOutline, linkOutline, navigateOutline, shareSocialOutline, star } from "ionicons/icons";
import ShareButton from "../components/Buttons/share-button";
import { fetchPlaceDetails } from "../services/searchService";
import { getReviewForPlace } from "../services/reviewService";

interface PlaceDetailProps {
    isAuthenticated: boolean;
    userId?: string;
}

const PlaceDetail: React.FC<PlaceDetailProps> = ({ isAuthenticated, userId }) => {

    const { placeId } = useParams<{ placeId: string }>();
    const location = useLocation<{ place: Place }>();
    const [place, setPlace] = useState<Place | null>(location.state?.place || null);
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<string>('google');
    const [greenhavenReviews, setGreenhavenReviews] = useState<any[]>([]);
    const history = useHistory();
    const hasFetchedDetails = useRef(false);

    useEffect(() => {

        console.log('Place from location.state:', location.state?.place);
        if (!place) {
            console.error('No place data available');
            return;
        }

        const fetchApiKey = async () => {
            try {
                const key = await getApiKey();
                setApiKey(key);
            } catch (error) {
                console.error("Error fetching API key: ", error)
            }
        };

        const fetchFavorites = async () => {
            if (isAuthenticated && userId) {
                try {
                    const userFavorites = await getUserFavorites(userId);
                    setFavorites(userFavorites);
                    console.log("userFavorites/PlaceDetails: ", userFavorites)
                } catch (error) {
                    console.error("Error fetching user favorites: ", error)
                    setFavorites([]);
                }
            }
        };

        const fetchDetails = async () => {
            if (placeId && !hasFetchedDetails.current) {
                hasFetchedDetails.current = true;
                console.log('enter fetchDetails');
                try {
                    const details = await fetchPlaceDetails(placeId);
                    setPlace(prevPlace => ({ ...prevPlace, ...details }));
                    console.log('Fetched place details:', details);
                } catch (error) {
                    console.error("Error fetching place details: ", error);
                }
            }
        };

        const fetchGreenhavenReviews = async () => {
            try {
                const reviews = await getReviewForPlace(placeId);
                setGreenhavenReviews(reviews);
                console.log("gh reviews: ", reviews)
            } catch (error) {
                console.error("Error fetching GreenHaven reviews: ", error);
            }
        };

        fetchApiKey();
        fetchFavorites();
            fetchDetails();
        fetchGreenhavenReviews();

    }, [isAuthenticated, userId, placeId, place, location.state?.place]);



    const toggleFavorite = async (placeId: string) => {
        if (!isAuthenticated || !userId) return;

        const isFavorite = favorites.includes(placeId);
        try {
            if (isFavorite) {
                await removeFromFavorites(userId, placeId);
                setFavorites(favorites.filter(id => id !== placeId));
            } else {
                await addToFavorites(userId, placeId);
                setFavorites([...favorites, placeId])
            }
        } catch (error) {
            console.error("Error updating favorite status: ", error)
        }
    }

    const getPhotoUrl = (photoReference: string, maxWidth: number, maxHeight: number) => {
        if (!apiKey) return '';
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&maxheight=${maxHeight}&photoreference=${photoReference}&key=${apiKey}`;
    };

    const formatReviewTime = (timestamp: number | string) => {
        const date = new Date(Number(timestamp) * 1000);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    if (!place) {
        return (
            <IonPage className="page-container">
                <IonContent>
                    <IonGrid>
                        <IonRow>
                            <div className="flex items-center gap-8" onClick={() => history.goBack()}>
                                <IonIcon icon={arrowBack} ios={arrowBack} md={arrowBack} />
                                <IonText>Back</IonText>
                            </div>
                        </IonRow>
                        <IonRow className="ion-padding">
                            <IonText>Loading...</IonText>
                        </IonRow>
                    </IonGrid>
                </IonContent>
            </IonPage>
        );
    }

    return (
        <IonPage className="page-container ion-padding">
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <div className="flex items-center gap-8" onClick={() => history.goBack()}>
                            <IonIcon icon={arrowBack} ios={arrowBack} md={arrowBack} />
                            <IonText>Back</IonText>
                        </div>
                    </IonRow>
                    <IonRow>
                        <IonText className="text-center full">
                            <h3>{place.name}</h3>
                        </IonText>
                    </IonRow>
                    <IonRow className="place-images">
                        {place.photos?.slice(0, 4).map(photo => (
                            <IonImg key={photo.photo_reference} src={getPhotoUrl(photo.photo_reference, 400, 300)} />
                        ))}
                    </IonRow>
                    <IonRow className="links flex items-center justify-between ion-padding">
                        {place.website && (
                            <IonButton fill="clear" href={place.website} target="_blank">
                                <IonIcon color="primary" icon={earthOutline} ios={earthOutline} md={earthOutline} />
                            </IonButton>
                        )}
                        {place.url && (
                            <IonButton fill="clear" href={`https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`} target="_blank">
                                <IonIcon color="primary" icon={navigateOutline} />
                            </IonButton>
                        )}
                        <ShareButton place={place} />
                        {isAuthenticated && (
                            <IonIcon
                                color="primary"
                                icon={favorites.includes(place.place_id) ? heart : heartOutline}
                                onClick={() => toggleFavorite(place.place_id)}
                            />
                        )}
                    </IonRow>
                    <IonRow className="flex flex-column items-center">
                        <IonText className="text-center">
                            <p>{place.description || place.formatted_address}</p>
                            <p>{place.formatted_phone_number}</p>
                        </IonText>
                    </IonRow>
                    <IonSegment value={activeTab} onIonChange={e => setActiveTab(e.detail.value as string)}>
                        <IonSegmentButton value="google">
                            <IonLabel>Google<br></br>Reviews</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="greenhaven">
                            <IonLabel>GreenHaven<br></br>Reviews</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                    {activeTab === 'google' && place.reviews && (
                        <IonRow>
                            <IonList className="full">
                                {place.reviews.map((review, index) => (
                                    <IonItem key={index} className="review full">
                                        <IonLabel className="full">
                                            <div className="flex mar-bottom-4 justify-between items-start">
                                                <div className="flex flex-column">
                                                    <h2>{review.author_name}</h2>
                                                    <small>{formatReviewTime(review.time)}</small>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <p>Rating: {review.rating} </p>
                                                    <IonIcon color='warning' icon={star} ios={star} md={star} />
                                                </div>
                                            </div>
                                            <p>{review.text}</p>
                                        </IonLabel>
                                    </IonItem>
                                ))}
                            </IonList>
                        </IonRow>
                    )}
                    {activeTab === 'greenhaven' && (
                        <IonRow>
                            <IonList className="full">
                                {greenhavenReviews.map((review, index) => (
                                    <IonItem key={index} className="review">
                                        <IonLabel className="full">
                                            <div className="flex justify-between items-start mar-bottom-4">
                                                <div className="flex flex-column">
                                                    <h2>{review.author_name}</h2>
                                                    <small>{}</small>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <p>Rating: {review.userRating} </p>
                                                    <IonIcon color='warning' icon={star} ios={star} md={star} />
                                                </div>
                                            </div>
                                            <p>{review.comment}</p>
                                        </IonLabel>
                                    </IonItem>
                                ))}
                            </IonList>
                        </IonRow>
                    )}
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}
export default PlaceDetail;