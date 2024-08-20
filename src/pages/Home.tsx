import React, { useCallback, useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonToolbar, IonLabel, IonImg, IonText, IonSelect, IonSelectOption, IonButton, IonSegment, IonSegmentButton, IonGrid, IonRow } from '@ionic/react';
import { Link, useLocation } from 'react-router-dom';
import { fetchPlaceDetails, searchByAddress, searchByLocation } from '../services/searchService';
import MapView from '../components/SearchResults/map-view';
import ListView from '../components/SearchResults/list-view';
import CustomSearchbar from '../components/SearchBar/search-bar';
import { Place } from '../../functions/src/searchFunctions';
import { getApiKey } from '../services/apiService';
import { getRecentViews } from '../services/userService';
import { Geolocation } from '@capacitor/geolocation';

interface HomeProps {
  isAuthenticated: boolean;
  userId?: string;
}

export interface SearchState {
  searchText: string;
  results: Place[];
  view: string;
  from?:string;
}

const Home: React.FC<HomeProps> = ({ isAuthenticated, userId }) => {
  const location = useLocation<SearchState>();
  const [searchText, setSearchText] = useState<string>(location.state?.searchText || '');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [radius, setRadius] = useState(8046.72);//default meters (5mi)
  const [results, setResults] = useState<Place[]>(location.state?.results || []);
  const [hasSearched, setHasSearched] = useState(!!location.state?.results);
  const [view, setView] = useState<string>(location.state?.view || 'map');
  const [selectedType, setSelectedType] = useState<string>('');
  const [recentlyViewed, setRecentlyViewed] = useState<Place[]>([]);
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
  
    const fetchRecentlyViewed = async () => {
      if (isAuthenticated && userId) {
        try {
          const userRecentViews = await getRecentViews(userId);
          console.log("user Favorites id", userRecentViews);
  
          // Fetch full Place details for each recently viewed item
          const recentViewed = await Promise.all(
            userRecentViews.map(async (placeId: string) => {
              const placeDetails = await fetchPlaceDetails(placeId);
              return placeDetails;
            })
          );
  
          setRecentlyViewed(recentViewed);
          console.log("recently viewed: ", recentViewed);
        } catch (error) {
          console.error("Error fetching user recently viewed places: ", error);
          setRecentlyViewed([]);
        }
      }
    };
  
    fetchApiKey();
    fetchRecentlyViewed();
  
    // Restore previous state if it exists
    if (location.state?.results && location.state?.searchText) {
      setResults(location.state.results);
      setSearchText(location.state.searchText);
      setView(location.state.view || 'map');
      setHasSearched(true);
    } else if (!location.state) {
      // Clear state if location.state is not present
      setSearchText('');
      setResults([]);
      setHasSearched(false);
      setView('map');
    }
  }, [isAuthenticated, userId]); 

  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  const handleSearch = async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));

    if (latitude !== null && longitude !== null) {
      // Perform search by location
      try {
        const userIdParam = userId || '';
        console.log("Searching with geolocation (Capacitor):", latitude, longitude, "radius:", radius, "userId:", userIdParam, "type:", selectedType);
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
    } else if (searchText) {
      // Perform search by address
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
        console.error("Error Searching:", error);
      }
    } else {
      console.error("Please enter an address or use geolocation.");
    }
  };

  const handleGeoSearch = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      setLatitude(latitude);
      setLongitude(longitude);
      setSearchText(`${latitude}, ${longitude}`);
      console.log("Geolocation set:", latitude, longitude);
    } catch (error) {
      console.error("Error getting geolocation using Capacitor:", error);
    }
  };

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 300), [searchText, radius, isAuthenticated, userId]);

  const handleSearchInputChange = (e: CustomEvent) => {
    setSearchText(e.detail.value!);
    debouncedHandleSearch();
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
          <IonGrid>
            <IonRow>
              <IonText className="full" style={{ fontSize: "0.85rem", display: "block", textAlign: "center" }} >Search by Address, Zip Code, City/State, or GeoLocation</IonText>
            </IonRow>
            <IonRow>
              <CustomSearchbar value={searchText} onIonChange={handleSearchInputChange} onGeoClick={handleGeoSearch} />
            </IonRow>
            <IonRow className='flex ion-justify-content-between items-center ion-padding-horizontal full'>
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
                <IonButton className='button primary small' onClick={handleSearch}>Search</IonButton>
            </IonRow>
              {hasSearched ? (
                <IonRow className='mt-16'>
                  <IonSegment value={view} onIonChange={e => setView(String(e.detail.value))}>
                    <IonSegmentButton value="map">
                      <IonLabel>Map</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="list">
                      <IonLabel>List</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>
                  {view === 'map' ? (
                    <MapView searchText={searchText} places={results} />
                  ) : (
                    <ListView searchText={searchText} places={results} isAuthenticated={isAuthenticated} userId={userId} />
                  )}
                </IonRow>
              ) : (
                <>
                  <IonRow>
                    <IonImg src="/images/GHTextLogoGreen.png" alt="GreenHavenText" style={{marginTop:"2rem"}}/>
                  </IonRow>
                  <IonRow>
                    <IonImg src='/images/forest-tree.png' alt='Tree' className="main-home-tree" />
                  </IonRow>    
                  {isAuthenticated ? (
                    <IonRow>
                      <ListView searchText={searchText} places={recentlyViewed} isAuthenticated={isAuthenticated}/>
                    </IonRow>
                  ) : (
                    <>
                      <IonRow>
                        <IonText className='my-24 full'>
                          <h3 className="text-center">Welcome to GreenHaven!</h3>
                          <p className='text-center'>Your gateway to discovering the best green spaces around you.</p>
                        </IonText>
                      </IonRow>           
                      <IonRow>
                        <Link className='full' to="/login">
                          <IonButton expand="block" className='button primary'>Login</IonButton>
                        </Link>
                      </IonRow>
                      <IonRow>
                        <Link className='full' to="/register">
                          <IonButton expand="block" className='button secondary'>Create Account</IonButton>
                        </Link>                  
                      </IonRow>
                    </>
                  )}
                </>
              )}
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

