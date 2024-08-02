import React, { useCallback, useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSearchbar, IonList, IonItem, IonLabel, IonImg, IonText, IonSelect, IonSelectOption, IonButton, IonSegment, IonSegmentButton } from '@ionic/react';
import { auth } from '../utility/firebaseConfig';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { searchByAddress, searchByLocation } from '../services/searchService';
import MapView from '../components/SearchResults/map-view';
import ListView from '../components/SearchResults/list-view';


const Home: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [radius, setRadius] = useState(8046.72);//default meters (5mi)
  const [results, setResults] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<string>('map');
  const [selectedType, setSelectedType] = useState<string>('');
  const history = useHistory();
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      console.log("authenticated: ", isAuthenticated)
      console.log("user: ", user)
    });
    return () => unsubscribe();
  }, []);

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleSearch = async () => {
    if (!searchText) {
      console.error("Address is required");
      return;
    }
  
    try {
      const userId = isAuthenticated ? user.uid : '';
      console.log("Searching with address:", searchText, "radius:", radius, "userId:", userId);
      const response = await searchByAddress(searchText, radius, userId, selectedType);
      if (response && response.data) {
        setResults(response.data);
        setHasSearched(true);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error Searching: ", error);
    }
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 500), [searchText, radius, isAuthenticated, user]);

  const handleSearchInputChange = (e: CustomEvent) => {
    setSearchText(e.detail.value!);
    debouncedHandleSearch();
  };

  const handleGeoSearch = async (latitude: number, longitude: number) => {
    try {
      const userId = user ? user.uid : '';
      const response = await searchByLocation(latitude, longitude, radius, userId, selectedType);
      setResults(response.data);
    } catch (error) {
      console.error('Error searching:', error);
    }
  };


  const handleRadiusChange = (value: number) => {
    const miles = value;
    const meters = miles * 1609.34; // Convert miles to meters
    setRadius(meters);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonSearchbar className='input-field' value={searchText} onIonChange={handleSearchInputChange}></IonSearchbar>
        <div className='flex ion-justify-content-end'>
            <IonSelect aria-label="radius" placeholder='Select Radius' value={(radius / 1609.34)} onIonChange={e => handleRadiusChange(e.detail.value)}>
              <IonSelectOption value={1}>1mi</IonSelectOption>
              <IonSelectOption value={5}>5mi</IonSelectOption>
              <IonSelectOption value={10}>10mi</IonSelectOption>
              <IonSelectOption value={15}>15mi</IonSelectOption>
              <IonSelectOption value={20}>20mi</IonSelectOption>
              <IonSelectOption value={25}>25mi</IonSelectOption>
              <IonSelectOption value={30}>30mi</IonSelectOption>
            </IonSelect>
            <IonSelect
              aria-label="type"
              placeholder="Select Type"
              value={selectedType}
              onIonChange={(e) => setSelectedType(e.detail.value)}
            >
              <IonSelectOption value="park">Park</IonSelectOption>
              <IonSelectOption value="natural_feature">Nature Trail</IonSelectOption>
            </IonSelect>
          <IonButton className='button primary' onClick={handleSearch}>Search</IonButton>
        </div>
        {hasSearched ?(
          <>
            <IonSegment value={view} onIonChange={e => setView(String(e.detail.value))}>
              <IonSegmentButton value="map">
                <IonLabel>Map</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="list">
                <IonLabel>List</IonLabel>
              </IonSegmentButton>
            </IonSegment>
            {view === 'map' ? (
              <MapView places={results} />
            ) : (
              <ListView places={results} />
            )}
            {/* filter */}
          </>
        ) : (
          <>
            
            <IonImg src='/images/forest-tree.png' alt='Tree' className="main-home-tree"/>
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
                  <p>Welcome to GreenHaven! Your gateway to discovering the best green spaces around you. Whether you're seeking tranquility in a serene park, the vibrant colors of a blooming garden, or the adventure of a scenic hiking trail, GreenHaven connects you to nature's finest spots. Our easy-to-use search feature lets you explore nearby green spaces by simply entering an address, zip code, or using your current location. Each place comes with rich details, user reviews, and stunning photos to help you choose your next outdoor adventure. Save your favorite spots and keep track of your recent searches to make planning your next visit a breeze. Dive in, explore, and let GreenHaven guide you to your perfect green escape.</p>
                </IonText>
                  <Link to="/login">
                    <IonButton expand="block" className='button primary'>Login</IonButton>
                  </Link>
               
                  <Link to="/register">
                    <IonButton expand="block" className='button primary'>Create Account</IonButton>
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

