import React from 'react';
import { IonList, IonItem, IonLabel, IonCard } from '@ionic/react';

interface ListViewProps {
  places: any[];
}

const ListView: React.FC<ListViewProps> = ({ places }) => (
  <IonList className='scrolling-list'>
    {places.map((place) => (
      <IonCard className='ion-padding' key={place.place_id} routerLink={`/place/${place.place_id}`}>
        <IonLabel>
          <h2>{place.name}</h2>
          <p>{place.vicinity}</p>
        </IonLabel>
      </IonCard>
    ))}
  </IonList>
);

export default ListView;
