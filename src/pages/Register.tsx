import React, { useState } from 'react';
import { IonPage, IonHeader, IonContent, IonToolbar, IonTitle, IonInput, IonButton } from '@ionic/react';
import { registerUser } from '../services/authService';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const user = await registerUser(email, password);
      console.log('Registered user:', user);
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Register</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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
        />
        <IonButton className='button button-primary' onClick={handleRegister}>Register</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Register;
