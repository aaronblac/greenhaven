import {
  IonButton,
  IonContent,
  IonPage,
  IonTextarea,
  IonText,
  IonGrid,
  IonRow,
  IonIcon,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { submitReview } from "../services/reviewService";
import { arrowBack, star } from "ionicons/icons";
import Star from "../components/ReviewStar/review-star";

interface WriteReviewProps {
  isAuthenticated: boolean;
  userId?: string;
  username: string;
}

const WriteReview: React.FC<WriteReviewProps> = ({
  isAuthenticated,
  userId,
  username,
}) => {
  const { placeId } = useParams<{ placeId: string }>();
  const location = useLocation<{ placeName: string; userReview: any }>();
  const [reviewText, setReviewText] = useState<string>("");
  const [rating, setRating] = useState<number | null>(null);
  const placeName = location.state?.placeName;
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const history = useHistory();

  useEffect(() => {
    // Prepopulate the form if a review already exists
    if (location.state?.userReview) {
      setReviewText(location.state.userReview.comment);
      setRating(location.state.userReview.userRating);
    }
  }, [location.state?.userReview]);

  useEffect(() => {
    // Update form validation whenever reviewText or rating changes
    setIsFormValid(reviewText.trim() !== "" && rating !== null);
  }, [reviewText, rating]);

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  const handleReviewSubmit = async () => {
    if (!isAuthenticated || !userId || !rating || !reviewText.trim()) return;

    try {
      await submitReview(userId, placeId, rating, reviewText, username);
      setReviewText("");
      setRating(null);
      history.goBack();
    } catch (error) {
      console.error("Error submitting review: ", error);
    }
  };

  return (
    <IonPage className="page-container ion-padding">
      <IonContent>
        <IonGrid className="flex flex-column gap-8">
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
              <h3>Write a Review</h3>
            </IonText>
          </IonRow>
          <IonRow className="flex items-center justify-between">
            <IonText>{placeName}</IonText>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  filled={rating !== null && index < rating}
                  onClick={() => handleStarClick(index)}
                />
              ))}
            </div>
          </IonRow>
          <IonRow>
            <IonTextarea
              fill="outline"
              value={reviewText}
              onIonInput={(e) => setReviewText(e.detail.value!)}
              placeholder="Write your review here..."
            />
          </IonRow>
          <IonRow className="my-16">
            <IonButton
              expand="block"
              color="primary"
              onClick={handleReviewSubmit}
              disabled={!isFormValid}
            >
              Submit Review
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default WriteReview;
