import { IonIcon } from '@ionic/react';
import { star, starOutline } from 'ionicons/icons';

interface StarProps {
  filled: boolean;
  onClick: () => void;
}

const Star: React.FC<StarProps> = ({ filled, onClick }) => {
  return (
    <IonIcon
      icon={filled ? star : starOutline}
      color="warning"
      style={{ cursor: 'pointer', fontSize: '24px' }}
      onClick={onClick}
    />
  );
};

export default Star;
