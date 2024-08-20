import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonToast, IonInputPasswordToggle, IonGrid, IonRow, IonText } from '@ionic/react';
import '../styles.scss';
import { useHistory, useLocation } from 'react-router';
import { registerUser } from '../services/authService';
import { AxiosError } from 'axios';
import { Place } from '../../functions/src/searchFunctions';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isRegisterAttempted, setIsRegisterAttempted] = useState(false);
  const history = useHistory();
  const location = useLocation<{ from?: string; placeId?: string; place?: Place; searchText?: string; results?: Place[]; view?: string }>();

  useEffect(() => {
    if (isRegisterAttempted) {
      handleRegister();
    }
  }, [email, password, username, confirmPassword]);

  const handleRegister = async () => {

    if (!username || !email || !password || !confirmPassword) {
      setToastMessage("All fields are required");
      setShowToast(true);
      return;
    }
  
    if (password !== confirmPassword) {
      setToastMessage("Passwords do not match, try again.");
      setShowToast(true);
      return;
    }
  
    try {
      const user = await registerUser(email, password, username); 
      console.log("Registered user:", user);
      
    // Redirect back to the previous page
    if (location.state?.from) {
      history.push({
        pathname: location.state.from,
        state: {
          placeId: location.state.placeId,
          place: location.state.place,
          searchText: location.state.searchText,
          results: location.state.results,
          view: location.state.view,
        },
      });
    } else {
      history.push('/home');
    }
    } catch (error) {
      console.error("Error registering:", error);
      
      // Handling error and setting appropriate message
      if (error instanceof AxiosError && error.response && error.response.data && error.response.data.message) {
        setToastMessage(error.response.data.message);
      } else {
        setToastMessage(`Error registering user. ${error}`);
      }
      
      setShowToast(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegisterAttempted(true);
  }

  return (
    <IonPage className='page-container'>
      <IonContent className='ion-padding'>
        <IonGrid className='flex flex-column gap-8'>
          <IonRow>
            <IonText className='text-center full'>
              <h3>Register</h3>
            </IonText>
          </IonRow>
          <form className='flex flex-column gap-16' onSubmit={handleSubmit}>
            <IonRow>
              <IonInput
                label="Username"
                labelPlacement="stacked"
                value={username}
                onIonChange={(e) => setUsername(e.detail.value!)}
                type="text"
              />
            </IonRow>
            <IonRow>
              <IonInput
                label="Email"
                labelPlacement="stacked"
                value={email}
                onIonChange={(e) => setEmail(e.detail.value!)}
                type="email"
              />
            </IonRow>
            <IonRow>
              <IonInput
                label="Password"
                labelPlacement="stacked"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value!)}
                type="password"
              >
                <IonInputPasswordToggle color={'medium'} slot='end'/>
              </IonInput>
            </IonRow>
            <IonRow>
              <IonInput
                label="Confirm Password"
                labelPlacement="stacked"
                value={confirmPassword}
                onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                type="password"
              >
                <IonInputPasswordToggle color={'medium'} slot='end'/>
              </IonInput>
            </IonRow>
            <IonRow>
              <IonButton expand='block' className='button primary' type='submit'>Register</IonButton>
            </IonRow>
          </form>
        </IonGrid>
        <IonToast
          cssClass='toast-warning'
          position='middle'
          isOpen={showToast}
          message={toastMessage}
          duration={3000}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
