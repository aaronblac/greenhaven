import React, { useEffect, useState } from "react";
import { auth } from '../../utility/firebaseConfig';
import { IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonTitle, IonToolbar } from "@ionic/react";
import { Link, useHistory } from "react-router-dom";
import {logoutUser} from "../../services/authService";

const TopMenu: React.FC = () => {
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const history = useHistory()

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
            history.push("/");
        } catch (error) {
            console.error("Error logging out: ", error);
        }
      }

    return(
        <>
        <IonHeader>
            <IonToolbar>
                <IonButtons slot="start">
                    <IonMenuButton>
                        {/* <IonIcon icon={close} /> */}
                    </IonMenuButton>
                </IonButtons>
                <IonTitle>Menu</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent>
            {isAuthenticated ?(<>
                <IonList>
                    {/* <IonItem> */}
                        {/* <a>Profile</a> */}
                    {/* </IonItem>
                    <IonItem>
                        <Link to="/favorites">Favorites</Link>
                    </IonItem> */}
                    <IonItem button onClick={handleLogout}>
                        <IonLabel>Logout</IonLabel>
                    </IonItem>
                </IonList>
            </>) : (<>
                <IonList>
                    <IonItem>
                        <Link to="/login">Login</Link>
                    </IonItem>
                    <IonItem>
                        <Link to="/register">Create Account</Link>
                    </IonItem>
                </IonList>
            </>) }
        </IonContent>
        </>
    )
}

export default TopMenu;