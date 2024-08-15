import React, { useCallback, useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonLabel, IonImg, IonText, IonSelect, IonSelectOption, IonButton, IonSegment, IonSegmentButton } from '@ionic/react';
import { auth } from '../utility/firebaseConfig';
import { Link } from 'react-router-dom';
import { searchByAddress, searchByLocation } from '../services/searchService';
import MapView from '../components/SearchResults/map-view';
import ListView from '../components/SearchResults/list-view';
import CustomSearchbar from '../components/SearchBar/search-bar';
import { Place } from '../../functions/src/searchFunctions';
import { getApiKey } from '../services/apiService';

interface HomeProps {
  isAuthenticated: boolean;
  userId?: string;
}

const Home: React.FC<HomeProps> = ({ isAuthenticated, userId }) => {
  const [searchText, setSearchText] = useState('');
  const [radius, setRadius] = useState(8046.72);//default meters (5mi)
  const [results, setResults] = useState<Place[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
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
      const userIdParam = userId || '';
      console.log("Searching with address:", searchText, "radius:", radius, "userId:", userIdParam);
      const response = await searchByAddress(searchText, radius, userIdParam, selectedType);
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

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 300), [searchText, radius, isAuthenticated, userId]);

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
          const userIdParam = userId || '';
          console.log("Searching with geolocation:", latitude, longitude, "radius:", radius, "userId:", userIdParam, "type:", selectedType);
          const response = await searchByLocation(latitude, longitude, radius, userIdParam, selectedType);
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
          <IonText style={{ fontSize: "0.85rem", display: "block", textAlign: "center" }} >Search by Address, Zip Code, City/State, or GeoLocation</IonText>
          <CustomSearchbar value={searchText} onIonChange={handleSearchInputChange} onGeoClick={handleGeoSearch} />
          <div className='flex ion-justify-content-between ion-padding-horizontal'>
            <IonSelect aria-label="radius" interface='popover' placeholder='Select Radius' value={(radius / 1609.34)} onIonChange={e => handleRadiusChange(e.detail.value)}>
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
              interface='popover'
              value={selectedType}
              onIonChange={(e) => setSelectedType(e.detail.value)}
            >
              <IonSelectOption value="park">Park</IonSelectOption>
              <IonSelectOption value="campground">Camping</IonSelectOption>
              <IonSelectOption value="natural_feature">Natural Area</IonSelectOption>
            </IonSelect>
            <IonButton className='button primary' onClick={handleSearch}>Search</IonButton>
          </div>
          {hasSearched ? (
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
                <ListView places={results} isAuthenticated={isAuthenticated} userId={userId} />
              )}
            </>
          ) : (
            <>
              <IonImg src='/images/forest-tree.png' alt='Tree' className="main-home-tree" />
              {isAuthenticated ? (
                <ListView places={[]} isAuthenticated={isAuthenticated}/>
              ) : (
                <>
                  <IonText className='my-24'>
                    <h3 className="text-center">What is GreenHaven?</h3>
                    <p className='text-center'>Welcome to GreenHaven! Your gateway to discovering the best green spaces around you. Whether you're seeking tranquility in a serene park, the vibrant colors of a blooming garden, or the adventure of a scenic hiking trail, GreenHaven connects you to nature's finest spots.</p>
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

