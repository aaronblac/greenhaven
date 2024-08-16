import React, { useEffect, useState } from "react";
import { auth, db } from '../../utility/firebaseConfig';
import { IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuButton, IonText, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import { Link, useHistory } from "react-router-dom";
import {logoutUser} from "../../services/authService";
import { getDocument } from "../../services/firestoreService";
import { doc, getDoc } from "firebase/firestore";
import { personCircleOutline } from "ionicons/icons";

const TopMenu: React.FC = () => {
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currUser, setCurrUser] = useState("");
    const history = useHistory();
    const router = useIonRouter();

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
            closeMenu();
            history.push("/");
        } catch (error) {
            console.error("Error logging out: ", error);
        }
      }

    const closeMenu = () => {
        router.goBack();
        document.querySelector('ion-menu')?.close();
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
                        <IonText>Menu</IonText>
                    )}
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {isAuthenticated ?(<>
                    <IonList>
                        {/* <IonItem> */}
                            {/* <a>Profile</a> */}
                        {/* </IonItem> */}
                        <IonItem button onClick={(closeMenu)}>
                            <Link to="/favorites">
                                <IonLabel color="tertiary">Favorites</IonLabel>
                            </Link>
                        </IonItem>
                        <IonItem button onClick={(closeMenu)}>
                            <Link to="/home">
                                <IonLabel color="tertiary">Home</IonLabel>
                            </Link>
                        </IonItem>
                        <IonItem button onClick={handleLogout}>
                            <IonLabel color="tertiary">Logout</IonLabel>
                        </IonItem>
                    </IonList>
                </>) : (<>
                    <IonList>
                        <IonItem button onClick={(closeMenu)}>
                            <Link color="primary" to="/home">Home</Link>
                        </IonItem>
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