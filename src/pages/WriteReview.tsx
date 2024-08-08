import { IonButton, IonContent, IonPage, IonTextarea, IonText, IonGrid, IonRow, IonInput, IonLabel, IonItem } from "@ionic/react";
import { useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { submitReview } from "../services/reviewService";

interface WriteReviewProps {
    isAuthenticated: boolean;
    userId?: string;
}

const WriteReview: React.FC<WriteReviewProps> = ({ isAuthenticated, userId }) => {
    const { placeId } = useParams<{ placeId: string }>();
    const [reviewText, setReviewText] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
    const history = useHistory();

    const handleReviewSubmit = async () => {
        if (!isAuthenticated || !userId) return;

        try {
            await submitReview(userId, placeId, rating, reviewText);
            setReviewText('');
            setRating(0);
            history.push(`/place-details/${placeId}`);
        } catch (error) {
            console.error("Error submitting review: ", error);
        }
    };

    return (
        <IonPage className="page-container ion-padding">
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <div className="flex items-center gap-8" onClick={() => history.goBack()}>
                            <IonText>Back</IonText>
                        </div>
                    </IonRow>
                    <IonRow>
                        <IonText className="text-center full">
                            <h3>Write a Review</h3>
                        </IonText>
                    </IonRow>
                    <IonRow>
                        <IonItem>
                            <IonLabel>Rating</IonLabel>
                            <IonInput type="number" value={rating} onIonChange={e => setRating(parseInt(e.detail.value!, 10))} />
                        </IonItem>
                    </IonRow>
                    <IonRow>
                        <IonTextarea
                            value={reviewText}
                            onIonChange={e => setReviewText(e.detail.value!)}
                            placeholder="Write your review here..."
                        />
                    </IonRow>
                    <IonRow>
                        <IonButton color="primary" onClick={handleReviewSubmit}>
                            Submit Review
                        </IonButton>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default WriteReview;
