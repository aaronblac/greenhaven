import { Route } from 'react-router-dom';
import { Redirect } from 'react-router';
import {
  IonApp,
  IonButtons,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenu,
  IonMenuButton,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, home, square, triangle } from 'ionicons/icons';
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

setupIonicReact();

const App: React.FC = () => (
  
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
          <IonTitle>GreenHaven</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonTabs className='ion-padding'>
        <IonRouterOutlet id="main-content">
          <Route exact path="/home" >
            <Home />
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
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon aria-hidden="true" icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="Login" href="/Login">
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>Login</IonLabel>
          </IonTabButton>
          <IonTabButton tab="register" href="/register">
            <IonIcon aria-hidden="true" icon={square} />
            <IonLabel>Register</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
