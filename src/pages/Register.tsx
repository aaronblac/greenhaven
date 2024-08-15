import React, { useState } from 'react';
import { IonPage, IonHeader, IonContent, IonToolbar, IonTitle, IonInput, IonButton, IonToast, IonInputPasswordToggle, IonGrid, IonRow, IonText } from '@ionic/react';
import '../styles.scss';
import { useHistory } from 'react-router';
import { registerUser } from '../services/authService';
import { AxiosError } from 'axios';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const history = useHistory();

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
      history.push("/login"); // Redirect to login after successful registration
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

  return (
    <IonPage className='page-container'>
      <IonContent className='ion-padding'>
        <IonGrid className='flex flex-column gap-8'>
          <IonRow>
            <IonText className='text-center full'>
              <h3>Register</h3>
            </IonText>
          </IonRow>
          <IonRow>
            <IonInput
              placeholder="Username"
              value={username}
              onIonChange={(e) => setUsername(e.detail.value!)}
              type="text"
            />
          </IonRow>
          <IonRow>
            <IonInput
              placeholder="Email"
              value={email}
              onIonChange={(e) => setEmail(e.detail.value!)}
              type="email"
            />
          </IonRow>
          <IonRow>
            <IonInput
              placeholder="Password"
              value={password}
              onIonChange={(e) => setPassword(e.detail.value!)}
              type="password"
            >
              <IonInputPasswordToggle color={'medium'} slot='end'/>
            </IonInput>
          </IonRow>
          <IonRow>
            <IonInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onIonChange={(e) => setConfirmPassword(e.detail.value!)}
              type="password"
            >
              <IonInputPasswordToggle color={'medium'} slot='end'/>
            </IonInput>
          </IonRow>
          <IonRow className='ion-padding'>
            <IonButton expand='block' className='button primary' onClick={handleRegister}>Register</IonButton>
          </IonRow>
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
