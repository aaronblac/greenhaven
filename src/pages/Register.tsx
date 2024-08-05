import React, { useState } from 'react';
import { IonPage, IonHeader, IonContent, IonToolbar, IonTitle, IonInput, IonButton, IonToast, IonInputPasswordToggle } from '@ionic/react';
import '../styles.scss';
import { useHistory } from 'react-router';
import { registerUser } from '../services/authService';

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
      const user = registerUser(email,password,username);
      console.log("Registered user:", user);
      history.push({
        pathname: "/home",
      });
    } catch (error: any) {
      console.error("Error registering:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setToastMessage(error.response.data.message);
      } else {
        setToastMessage("Error registering user. Please try again.");
      }
      setShowToast(true);
    }
  };

  return (
    <IonPage className='page-container'>
      <IonContent className='ion-padding'>
        <IonTitle className='ion-text-center'>Register</IonTitle>
        <IonInput
          placeholder="Username"
          value={username}
          onIonChange={(e) => setUsername(e.detail.value!)}
          type="text"
        />
        <IonInput
          
          placeholder="Email"
          value={email}
          onIonChange={(e) => setEmail(e.detail.value!)}
          type="email"
        />
        <IonInput
          
          placeholder="Password"
          value={password}
          onIonChange={(e) => setPassword(e.detail.value!)}
          type="password"
        >
          <IonInputPasswordToggle color={'medium'} slot='end'/>
        </IonInput>
        <IonInput
          
          placeholder="Confirm Password"
          value={confirmPassword}
          onIonChange={(e) => setConfirmPassword(e.detail.value!)}
          type="password"
        >
          <IonInputPasswordToggle color={'medium'} slot='end'/>
        </IonInput>
        <IonToast
          cssClass='toast-warning'
          position='middle'
          isOpen={showToast}
          message={toastMessage}
          duration={3000}
          onDidDismiss={() => setShowToast(false)}
        />
        <IonButton expand='block' className='button primary' onClick={handleRegister}>Register</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Register;
