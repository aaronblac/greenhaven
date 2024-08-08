import React, { useState } from 'react';
import { IonButton, IonIcon, IonToast } from '@ionic/react';
import { shareSocialOutline } from 'ionicons/icons';
import { Place } from '../../../functions/src/searchFunctions';

interface ShareButtonProps {
    place: Place;
}

const ShareButton: React.FC<ShareButtonProps> = ({ place }) => {

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: place.name,
                    text: place.description || place.formatted_address,
                    url: place.url,
                });
            } catch (error) {
                console.error('Error sharing', error);
                setShowToast(true);
                setToastMessage("Error sharing content")
            }
        } else {
            // Fallback for browsers that do not support the Web Share API
            try {
                await navigator.clipboard.writeText(place.url);
                setShowToast(true)
                setToastMessage('Link copied to clipboard');
            } catch (error) {
                console.error('Error copying to clipboard', error);
                setShowToast(true)
                setToastMessage('Error copying to clipboard');
            }
        }
    };

    return (
        <div>
            <IonButton onClick={handleShare} fill="clear" color="primary">
                <IonIcon icon={shareSocialOutline} />
            </IonButton>
            <IonToast
                cssClass='toast-warning'
                position='middle'
                isOpen={showToast}
                message={toastMessage}
                duration={3000}
                onDidDismiss={() => setShowToast(false)}
            />
        </div>
    );
};

export default ShareButton;
