// components/CustomSearchbar.tsx
import React from 'react';
import { IonSearchbar, IonButton, IonIcon } from '@ionic/react';
import { locate, locateOutline } from 'ionicons/icons';

interface CustomSearchbarProps {
  value: string;
  onIonChange: (e: CustomEvent) => void;
  onGeoClick: () => void;
}

const CustomSearchbar: React.FC<CustomSearchbarProps> = ({ value, onIonChange, onGeoClick }) => {
  return (
    <div style={{ position: 'relative' }}>
      <IonSearchbar value={value} onIonChange={onIonChange} className='ion-searchbar-clear-button input-field'/>
      <IonButton
        fill="clear"
        style={{
          position: 'absolute',
          right: '0.5rem', 
          top: '50%',
          transform: 'translateY(-60%)',
          cursor: 'pointer',
        }}
        onClick={onGeoClick}
      >
        <IonIcon icon={locate} ios={locate} md={locate} color='secondary' />
      </IonButton>
    </div>
  );
};

export default CustomSearchbar;
