import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonList, IonItem, IonLabel, IonImg, IonButton, IonText } from '@ionic/react';
import { auth } from '../firebaseConfig';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';

interface HomeProps {
  isAuthenticated: boolean;
}

const Home: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const history = useHistory();
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = () => {
    history.push('/login');
  };

  const handleRegister = () => {
    history.push('/register');
  };
 
  const handleSearch = () => {
    setHasSearched(true);
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonSearchbar value={searchText} onIonChange={e => setSearchText(e.detail.value!)}></IonSearchbar>
        <IonButton onClick={handleSearch}>Search</IonButton>
        {hasSearched ?(
          <>
          search list and map
          {/* map */}
          {/* list */}
          {/* filter */}
          {/* tabs to switch between the two */}
          </>
        ) : (
          <>
            <IonImg src='/images/forest-tree.png' alt='Tree'/>
            {isAuthenticated ?(
            <IonList>
              <IonItem>
                <IonLabel>Suggestion Result 1</IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>Suggestion Result 2</IonLabel>
              </IonItem>
            </IonList>

            ) : (
              <>
                <IonText>
                  <h3>What is GreenHaven?</h3>
                  <p></p>
                </IonText>
                <Link to="/login">
                  <IonButton className='button button-primary'>Login</IonButton>
                </Link>
                <Link to="/register">
                  <IonButton className='button button-primary'>Create Account</IonButton>
                </Link>
              </>
            )}
          </>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Home;

