import { IonButton, IonContent, IonPage, IonTextarea, IonText, IonGrid, IonRow, IonInput, IonLabel, IonItem, IonIcon, IonSelect, IonSelectOption } from "@ionic/react";
import { useState } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { submitReview } from "../services/reviewService";
import { arrowBack, star } from "ionicons/icons";

interface WriteReviewProps {
    isAuthenticated: boolean;
    userId?: string;
    username: string;
}

const WriteReview: React.FC<WriteReviewProps> = ({ isAuthenticated, userId, username }) => {
    const { placeId } = useParams<{ placeId: string }>();
    const location = useLocation<{ placeName: string }>();
    const [reviewText, setReviewText] = useState<string>('');
    const [rating, setRating] = useState<number | null>(null);
    const placeName = location.state?.placeName;
    const history = useHistory();

    const handleReviewSubmit = async () => {
        if (!isAuthenticated || !userId || !rating || !reviewText.trim()) return;

        try {
            await submitReview(userId, placeId, rating, reviewText, username);
            setReviewText('');
            setRating(null);
            history.goBack();
        } catch (error) {
            console.error("Error submitting review: ", error);
        }
    };

    const isFormValid = reviewText.trim() !== '' && rating !== null;

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
                            <h3>Write a Review</h3>
                        </IonText>
                    </IonRow>
                    <IonRow className="flex items-center justify-between">
                        <IonText>{placeName}</IonText>
                        <div className="flex items-center gap-4">
                            <IonIcon icon={star} ios={star} md={star} color="warning"/>
                            <IonSelect className="rating-select" aria-label="radius" placeholder='Set Rating' value={rating} onIonChange={e => setRating(e.detail.value)} >
                                <IonSelectOption value={1}>1</IonSelectOption>
                                <IonSelectOption value={2}>2</IonSelectOption>
                                <IonSelectOption value={3}>3</IonSelectOption>
                                <IonSelectOption value={4}>4</IonSelectOption>
                                <IonSelectOption value={5}>5</IonSelectOption>
                            </IonSelect>
                        </div>
                    </IonRow>
                    <IonRow>
                        <IonTextarea
                            fill="outline"
                            value={reviewText}
                            onIonChange={e => setReviewText(e.detail.value!)}
                            placeholder="Write your review here..."
                        />
                    </IonRow>
                    <IonRow className="my-16">
                        <IonButton expand="block" color="primary" onClick={handleReviewSubmit} disabled={!isFormValid}>
                            Submit Review
                        </IonButton>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default WriteReview;
