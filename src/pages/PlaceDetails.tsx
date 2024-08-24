import {
  IonButton,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
} from "@ionic/react";
import { Place } from "../../functions/src/searchFunctions";
import { useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation, useParams } from "react-router-dom";
import { getApiKey } from "../services/apiService";
import {
  addToFavorites,
  getUserFavorites,
  removeFromFavorites,
  updateRecentViews,
} from "../services/userService";
import {
  arrowBack,
  earthOutline,
  heart,
  heartOutline,
  navigateOutline,
  star,
} from "ionicons/icons";
import ShareButton from "../components/Buttons/share-button";
import { fetchPlaceDetails } from "../services/searchService";
import { getReviewForPlace } from "../services/reviewService";
import ReviewList from "../components/ReviewsList/reviews-list";

interface PlaceDetailProps {
  isAuthenticated: boolean;
  userId?: string;
}

const PlaceDetail: React.FC<PlaceDetailProps> = ({
  isAuthenticated,
  userId,
}) => {
  const { placeId } = useParams<{ placeId: string }>();
  const location = useLocation<{ place: Place }>();
  const [place, setPlace] = useState<Place | null>(
    location.state?.place || null
  );
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("greenhaven");
  const [greenhavenReviews, setGreenhavenReviews] = useState<any[]>([]);
  const [userHasReviewed, setUserHasReviewed] = useState<boolean>(false);
  const [userReview, setUserReview] = useState<any>(null);
  const [imageLoading, setImageLoading] = useState<boolean[]>([]);
  const scrollPosition = useRef<number>(0);

  const history = useHistory();
  const hasFetchedDetails = useRef(false);

  useEffect(() => {
    if (!place) {
      console.error("No place data available");
      return;
    }

    const fetchApiKey = async () => {
      try {
        const key = await getApiKey();
        setApiKey(key);
      } catch (error) {
        console.error("Error fetching API key: ", error);
      }
    };

    const fetchFavorites = async () => {
      if (isAuthenticated && userId) {
        try {
          const userFavorites = await getUserFavorites(userId);
          if (userFavorites) {
            setFavorites(userFavorites);
          } else {
            console.error("User Favorites are empty");
          }
        } catch (error) {
          console.error("Error fetching user favorites: ", error);
          setFavorites([]);
        }
      }
    };

    const fetchDetails = async () => {
      if (placeId && !hasFetchedDetails.current) {
        hasFetchedDetails.current = true;
        try {
          const details = await fetchPlaceDetails(placeId);
          setPlace((prevPlace) => ({ ...prevPlace, ...details }));
        } catch (error) {
          console.error("Error fetching place details: ", error);
        }
      }
    };

    const fetchGreenhavenReviews = async () => {
      try {
        const reviews = await getReviewForPlace(placeId);
        setGreenhavenReviews(reviews);

        const existingReview = reviews.find(
          (review: any) => review.userId === userId
        );
        if (existingReview) {
          setUserHasReviewed(true);
          setUserReview(existingReview);
        }
      } catch (error) {
        console.error("Error fetching GreenHaven reviews: ", error);
      }
    };

    fetchApiKey();
    fetchFavorites();
    fetchDetails();
    fetchGreenhavenReviews();
    // Scroll restoration
    window.scrollTo(0, scrollPosition.current);

    if (isAuthenticated && userId && placeId) {
      updateRecentViews(userId, placeId);
    }
    
  }, [isAuthenticated, userId, placeId, place, location.state?.place]);

  const toggleFavorite = async (placeId: string) => {
    if (!isAuthenticated || !userId) return;

    const isFavorite = favorites.includes(placeId);
    try {
      if (isFavorite) {
        await removeFromFavorites(userId, placeId);
        setFavorites((prevFavorites) =>
          favorites.filter((id) => id !== placeId)
        );
      } else {
        await addToFavorites(userId, placeId);
        setFavorites((prevFavorites) => [...prevFavorites, placeId]);
      }
    } catch (error) {
      console.error("Error updating favorite status: ", error);
      console.error("UserID: ", userId);
      console.error("PlaceID: ", placeId);
      console.error("IsFavorite: ", isFavorite);
    }
  };

  const getPhotoUrl = (
    photoReference: string,
    maxWidth: number,
    maxHeight: number
  ) => {
    if (!apiKey) return "";
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&maxheight=${maxHeight}&photoreference=${photoReference}&key=${apiKey}`;
  };

  const handleReviewTypeChange = (value: string) => {
    scrollPosition.current = window.scrollY;
    setActiveTab(value);
  };

  const handleImageLoad = (index: number) => {
    setImageLoading((prev) => {
      const updatedLoading = [...prev];
      updatedLoading[index] = false; // Mark the image as loaded
      return updatedLoading;
    });
  };

  if (!place) {
    return (
      <IonPage className="page-container">
        <IonContent>
          <IonGrid>
            <IonRow>
              <div
                className="flex items-center gap-8 pointer"
                onClick={() => history.goBack()}
              >
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
            <div
              className="flex items-center gap-8 pointer"
              onClick={() => history.goBack()}
            >
              <IonIcon icon={arrowBack} ios={arrowBack} md={arrowBack} />
              <IonText>Back</IonText>
            </div>
          </IonRow>
          <IonRow>
            <IonText className="text-center full">
              <h3>{place.name}</h3>
            </IonText>
          </IonRow>
          {place.photos && place.photos.length > 0 ? (
              <IonRow className="place-images">
              {place.photos?.slice(0, 4).map((photo, index) => (
                  <div key={photo.photo_reference} style={{ position: "relative" }}>
                    {imageLoading[index] && (
                      <div
                      style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#f0f0f0",
                        }}
                        >
                        <IonSpinner name="crescent" />
                      </div>
                    )}
                    <IonImg
                      src={getPhotoUrl(photo.photo_reference, 400, 300)}
                      onIonImgDidLoad={() => handleImageLoad(index)}
                      style={imageLoading[index] ? { opacity: 0 } : { opacity: 1 }}
                    />
                  </div>
                ))}
              </IonRow>
          ) : (
            <IonRow>
                <IonImg className="main-home-tree" src="/images/forest-tree.png"/>
            </IonRow>
          )}
          <IonRow className="links flex items-center justify-between ion-padding">
            {place.website && (
              <IonButton fill="clear" href={place.website} target="_blank">
                <IonIcon
                  color="primary"
                  icon={earthOutline}
                  ios={earthOutline}
                  md={earthOutline}
                />
              </IonButton>
            )}
            {place.url && (
              <IonButton
                fill="clear"
                href={`https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`}
                target="_blank"
              >
                <IonIcon color="primary" icon={navigateOutline} />
              </IonButton>
            )}
            <ShareButton place={place} />
            {isAuthenticated && (
              <IonButton
                fill="clear"
                onClick={() => toggleFavorite(place.place_id)}
              >
                <IonIcon
                  color="primary"
                  icon={
                    favorites.includes(place.place_id) ? heart : heartOutline
                  }
                />
              </IonButton>
            )}
          </IonRow>
          <IonRow className="flex flex-column items-center">
            <IonText className="text-center">
              <p>{place.description || place.formatted_address}</p>
              <p>{place.formatted_phone_number}</p>
            </IonText>
          </IonRow>
          <hr color="primary"></hr>
          <IonRow>
            <IonText className="text-center full">
              <h3>Reviews</h3>
            </IonText>
          </IonRow>
          <IonRow className="flex justify-between items-center full ion-padding">
            <IonSelect
              value={activeTab}
              interface="popover"
              placeholder="Select Reviews"
              onIonChange={(e) => handleReviewTypeChange(e.detail.value)}
            >
              <IonSelectOption value="google">Google Reviews</IonSelectOption>
              <IonSelectOption value="greenhaven">
                GreenHaven Reviews
              </IonSelectOption>
            </IonSelect>
            {isAuthenticated ? (
              <IonButton className="button tertiary small">
                <Link
                  to={{
                    pathname: `/write-review/${place.place_id}`,
                    state: { placeName: place.name, userReview: userReview },
                  }}
                >
                  {userHasReviewed ? "Update review" : "Write Review"}
                </Link>
              </IonButton>
            ) : (
              <div
                className="flex items-center gap-4"
                style={{ fontSize: "0.75rem" }}
              >
                <Link
                  to={{
                    pathname: "/Login",
                    state: {
                      from: location.pathname,
                      placeId,
                      place,
                    },
                  }}
                >
                  Login
                </Link>
                <span>or</span>
                <Link
                  to={{
                    pathname: "/Register",
                    state: {
                      from: location.pathname,
                      placeId,
                      place,
                    },
                  }}
                >
                  Register
                </Link>
                <span>to write a review</span>
              </div>
            )}
          </IonRow>
          <IonRow>
            {activeTab === "google" &&
            place.reviews &&
            place.reviews.length > 0 ? (
              <ReviewList reviews={place.reviews} type="google" />
            ) : (
              activeTab === "google" && (
                <div className="text-center full ion-padding">
                  <IonText>No Google Reviews Yet</IonText>
                </div>
              )
            )}

            {activeTab === "greenhaven" &&
            greenhavenReviews &&
            greenhavenReviews.length > 0 ? (
              <ReviewList reviews={greenhavenReviews} type="greenhaven" />
            ) : (
              activeTab === "greenhaven" && (
                <div className="flex flex-column items-center full ion-padding">
                  <IonText>No GreenHaven reviews yet.</IonText>
                  <Link
                    to={{
                      pathname: `/write-review/${place.place_id}`,
                      state: { placeName: place.name },
                    }}
                  >
                    Write a Review
                  </Link>
                </div>
              )
            )}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};
export default PlaceDetail;
