import React, { useCallback, useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage,  IonToolbar, IonLabel, IonImg, IonText, IonSelect, IonSelectOption, IonButton, IonSegment, IonSegmentButton} from '@ionic/react';
import { auth } from '../utility/firebaseConfig';
import { Link } from 'react-router-dom';
import { searchByAddress, searchByLocation } from '../services/searchService';
import MapView from '../components/SearchResults/map-view';
import ListView from '../components/SearchResults/list-view';
import CustomSearchbar from '../components/SearchBar/search-bar';
import { Place } from '../../functions/src/searchFunctions';
import { getApiKey } from '../services/apiService';


const Home: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [radius, setRadius] = useState(8046.72);//default meters (5mi)
  const [results, setResults] = useState<Place[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<string>('map');
  const [selectedType, setSelectedType] = useState<string>('');
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const key = await getApiKey();
        setApiKey(key);
      } catch (error) {
        console.error('Error fetching API key:', error);
      }
    };

    fetchApiKey();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
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
      if (response) {
        setResults(response);
        setHasSearched(true);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error Searching: ", error);
    }
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 300), [searchText, radius, isAuthenticated, user]);

  const handleSearchInputChange = (e: CustomEvent) => {
    setSearchText(e.detail.value!);
    debouncedHandleSearch();
  };

  const handleGeoSearch = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setSearchText(`${latitude},${longitude}`);
        try {
          const userId = user ? user.uid : '';
          console.log("Searching with geolocation:", latitude, longitude, "radius:", radius, "userId:", userId, "type:", selectedType);
          const response = await searchByLocation(latitude, longitude, radius, userId, selectedType);
          if (response) {
            setResults(response);
            setHasSearched(true);
          } else {
            console.error("Unexpected response structure:", response);
          }
        } catch (error) {
          console.error('Error searching:', error);
        }
      },
      (error) => {
        console.error("Error getting geolocation:", error);
      }
    );
  };


  const handleRadiusChange = (value: number) => {
    const miles = value;
    const meters = miles * 1609.34; // Convert miles to meters
    setRadius(meters);
  };

  return (
    <IonPage>
        <IonContent className='ion-padding'>
          <div className='page-container'>
            <IonText style={{fontSize:"0.85rem", display:"block", textAlign:"center"}} >Search by Address, Zip Code, City/State, or GeoLocation</IonText>
            <CustomSearchbar value={searchText} onIonChange={handleSearchInputChange} onGeoClick={handleGeoSearch}/>
            <div className='flex ion-justify-content-between ion-padding-horizontal'>
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
                  <IonSelectOption value="campground">Camping</IonSelectOption>
                  <IonSelectOption value="natural_feature">Natural Area</IonSelectOption>
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
                  <ListView places={results} isAuthenticated={isAuthenticated} />
                )}
              </>
            ) : (
              <>
                {isAuthenticated ?(
                <IonImg src='/images/forest-tree.png' alt='Tree' className="main-home-tree"/>
                ) : (
                  <>
                    <IonText className='my-24'>
                      <h3 className="text-center">What is GreenHaven?</h3>
                      <p>Welcome to GreenHaven! Your gateway to discovering the best green spaces around you. Whether you're seeking tranquility in a serene park, the vibrant colors of a blooming garden, or the adventure of a scenic hiking trail, GreenHaven connects you to nature's finest spots. Our easy-to-use search feature lets you explore nearby green spaces by simply entering an address, zip code, or using your current location. Each place comes with rich details, user reviews, and stunning photos to help you choose your next outdoor adventure. Save your favorite spots and keep track of your recent searches to make planning your next visit a breeze. Dive in, explore, and let GreenHaven guide you to your perfect green escape.</p>
                    </IonText>
                      <Link to="/login">
                        <IonButton expand="block" className='button primary'>Login</IonButton>
                      </Link>
                  
                      <Link to="/register">
                        <IonButton expand="block" className='button secondary'>Create Account</IonButton>
                      </Link>
                  </>
                )}
              </>
            )}
          </div>
        </IonContent>
    </IonPage>
  );
};

export default Home;

