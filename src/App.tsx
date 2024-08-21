import { Link, Route } from 'react-router-dom';
import { Redirect, useHistory } from 'react-router';
import {
  IonApp,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonLoading,
  IonMenu,
  IonMenuButton,
  IonRouterOutlet,
  IonRow,
  IonText,
  IonToolbar,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { useEffect, useState } from 'react';
import { auth } from './utility/firebaseConfig';
import { getDocument } from './services/firestoreService';
import TopMenu from './components/TopMenu/top-menu';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import PlaceDetail from './pages/PlaceDetails';
import WriteReview from './pages/WriteReview';
import Favorites from './pages/Favorites';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import './styles.scss';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.scss';

setupIonicReact();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);
        
        try {
          // Fetch the user's data from Firestore
          const userData = await getDocument(user.uid);
          setUsername(userData.username);
        } catch (error) {
          console.error("Error fetching user data: ", error);
          setUsername(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setUsername(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonMenu side="end" contentId="main-content">
          <TopMenu />
        </IonMenu>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="end">
              <IonMenuButton />
            </IonButtons>
            <IonGrid>
              <IonRow className="flex items-center gap-8">
                <Link to="/">
                  <IonImg src='/images/forest-tree.png' alt='Tree' className="menu-tree" />
                </Link>
                <IonText className='ion-no-padding'>GreenHaven</IonText>
              </IonRow>
            </IonGrid>
          </IonToolbar>
        </IonHeader>
        <IonLoading
          isOpen={loading}
          message={'Please wait...'}
          spinner="crescent"
        />
        {!loading && (
          <IonRouterOutlet id="main-content">
            <Route exact path="/home" >
              <Home isAuthenticated={isAuthenticated} userId={user?.uid} />
            </Route>
            <Route exact path="/Login">
              <Login />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route exact path="/ForgotPassword">
              <ForgotPassword />
            </Route>
            <Route exact path="/place/:placeId">
              <PlaceDetail isAuthenticated={isAuthenticated} userId={user?.uid} />
            </Route>
            <Route exact path="/write-review/:placeId">
              <WriteReview isAuthenticated={isAuthenticated} userId={user?.uid} username={username || ''}/>
            </Route>
            <Route exact path="/favorites" key={location.pathname}>
              <Favorites isAuthenticated={isAuthenticated} userId={user?.uid}/>
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
        )}
      </IonReactRouter>
    </IonApp>
  );
};
export default App;
