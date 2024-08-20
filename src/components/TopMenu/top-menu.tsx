import React, { useEffect, useState } from "react";
import { auth, db } from '../../utility/firebaseConfig';
import { IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonText, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import { Link, useHistory, useLocation } from "react-router-dom";
import {logoutUser} from "../../services/authService";
import { getDocument } from "../../services/firestoreService";
import { doc, getDoc } from "firebase/firestore";
import { personCircleOutline } from "ionicons/icons";
import { SearchState } from "../../pages/Home";

const TopMenu: React.FC = () => {
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currUser, setCurrUser] = useState("");
    const history = useHistory();
    const location = useLocation<SearchState>();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
            setIsAuthenticated(true);
            try{
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                  setCurrUser(userDoc.data()?.username || user.email); 
                }
              } catch (error) {
                console.error("Error fetching user document: ", error);
            }
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
            history.replace({
                pathname: "/home",
                state: {} // Clear the state by passing an empty object
            });
            document.querySelector('ion-menu')?.close();
        } catch (error) {
            console.error("Error logging out: ", error);
        }
      }

    const closeMenuAndNavigate = (path:string) => {
        document.querySelector('ion-menu')?.close();
        history.push({
            pathname:path,
            state: {
                from: location.pathname,
                searchText: location.state?.searchText,
                results: location.state?.results,
                view: location.state?.view,
            }
        })
    };

    return(
        <>
            <IonHeader>
                <IonToolbar>
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4 ion-padding">
                            <IonIcon style={{fontSize:"1.5rem"}} color="primary" icon={personCircleOutline} ios={personCircleOutline} md={personCircleOutline}/>
                            <IonText>{currUser}</IonText>
                        </div>
                    ) : (
                        <IonText className="ion-padding-horizontal">Menu</IonText>
                    )}
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {isAuthenticated ?(<>
                    <IonList>
                        {/* <IonItem> */}
                            {/* <a>Profile</a> */}
                        {/* </IonItem> */}
                        <IonItem button onClick={() => closeMenuAndNavigate("/favorites")}>
                                <IonLabel color="tertiary">Favorites</IonLabel>
                        </IonItem>
                        <IonItem button onClick={() => closeMenuAndNavigate("/home")}>
                                <IonLabel color="tertiary">Home</IonLabel>
                        </IonItem>
                        <IonItem button onClick={handleLogout}>
                            <IonLabel color="tertiary">Logout</IonLabel>
                        </IonItem>
                    </IonList>
                </>) : (<>
                    <IonList>
                        <IonItem button onClick={() => closeMenuAndNavigate("/home")}>
                            <IonLabel color="primary">Home</IonLabel>
                        </IonItem>
                        <IonItem button onClick={() => closeMenuAndNavigate("/login")}>
                            <IonLabel color="primary">Login</IonLabel>
                        </IonItem>
                        <IonItem button onClick={() => closeMenuAndNavigate("/register")}>
                            <IonLabel color="primary">Create Account</IonLabel>
                        </IonItem>
                    </IonList>
                </>) }
            </IonContent>
        </>
    )
}

export default TopMenu;