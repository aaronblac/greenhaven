import React from "react";
import { IonRow, IonList, IonItem, IonLabel, IonIcon } from "@ionic/react";
import { star } from "ionicons/icons";

interface ReviewListProps {
  reviews: any[];
  type: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, type }) => {
  const formatReviewTime = (timestamp: number | string) => {
    const date = new Date(Number(timestamp) * 1000);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <IonRow className="full">
      <IonList className="full">
        {reviews.map((review, index) => {
          const createdAt = review.createdAt;
          let formattedDate = "Unknown date";

          if (type === "greenhaven" && createdAt && createdAt._seconds) {
            const timestamp = new Date(createdAt._seconds * 1000);
            formattedDate = timestamp.toLocaleDateString();
          }

          return (
            <IonItem key={index} className="review full">
              <IonLabel className="full">
                <div className="flex mar-bottom-4 justify-between items-start full">
                  <div className="flex flex-column">
                    <h2>{review.username || review.author_name}</h2>
                    <small>
                      {type === "google"
                        ? formatReviewTime(review.time)
                        : formattedDate}
                    </small>
                  </div>
                  <div>
                    <p className="flex items-center gap-4">
                      <span>Rating: {review.userRating || review.rating}</span>
                      <IonIcon
                        color="warning"
                        icon={star}
                        ios={star}
                        md={star}
                      />
                    </p>
                  </div>
                </div>
                <p>{review.comment || review.text}</p>
              </IonLabel>
            </IonItem>
          );
        })}
      </IonList>
    </IonRow>
  );
};

export default ReviewList;
