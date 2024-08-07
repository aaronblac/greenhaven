import { Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import {
  IonApp,
  IonButtons,
  IonCol,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonMenu,
  IonMenuButton,
  IonRouterOutlet,
  IonRow,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home } from 'ionicons/icons';
// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

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
import TopMenu from './components/TopMenu/top-menu';
import PlaceDetail from './pages/PlaceDetails';
import { useEffect, useState } from 'react';
import { auth } from './utility/firebaseConfig';

setupIonicReact();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
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

  return(
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
                <IonImg src='/images/forest-tree.png' alt='Tree' className="menu-tree"/>
                <IonTitle className='ion-no-padding'>GreenHaven</IonTitle>
              </IonRow>
            </IonGrid>
          </IonToolbar>
        </IonHeader>
        <IonTabs className='ion-padding'>
          <IonRouterOutlet id="main-content">
            <Route exact path="/home" >
              <Home  isAuthenticated={isAuthenticated} userId={user?.uid}/>
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
              <PlaceDetail  isAuthenticated={isAuthenticated} userId={user?.uid}/>
            </Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="home" href="/home">
              <IonIcon aria-hidden="true" icon={home} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};
export default App;
