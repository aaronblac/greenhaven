import React, { useEffect, useState } from "react";
import { auth } from '../../utility/firebaseConfig';
import { IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import { Link, useHistory } from "react-router-dom";
import {logoutUser} from "../../services/authService";

const TopMenu: React.FC = () => {
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const history = useHistory();
    const router = useIonRouter();

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

      const handleLogout = async () => {
        try{
            await logoutUser();
            setIsAuthenticated(false);
            closeMenu();
            history.push("/");
        } catch (error) {
            console.error("Error logging out: ", error);
        }
      }

    const closeMenu = () => {
        router.goBack();
    };

    return(
        <>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Menu</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            {isAuthenticated ?(<>
                <IonList>
                    {/* <IonItem> */}
                        {/* <a>Profile</a> */}
                    {/* </IonItem> */}
                    <IonItem button onClick={(closeMenu)}>
                        <Link color="tertiary" to="/favorites">Favorites</Link>
                    </IonItem>
                    <IonItem button onClick={handleLogout}>
                        <IonLabel color="tertiary">Logout</IonLabel>
                    </IonItem>
                </IonList>
            </>) : (<>
                <IonList>
                    <IonItem button onClick={(closeMenu)}>
                        <Link color="primary" to="/login">Login</Link>
                    </IonItem>
                    <IonItem button onClick={(closeMenu)}>
                        <Link color="primary" to="/register">Create Account</Link>
                    </IonItem>
                </IonList>
            </>) }
        </IonContent>
        </>
    )
}

export default TopMenu;