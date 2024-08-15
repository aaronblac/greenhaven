import React, { useState } from 'react';
import { IonPage, IonHeader, IonContent, IonToolbar, IonTitle, IonInput, IonButton, IonToast, IonInputPasswordToggle, IonGrid, IonRow, IonText } from '@ionic/react';
import { useHistory } from 'react-router';
import axios from 'axios';
import { loginUser } from '../services/authService';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    if (!email || !password) {
      setToastMessage('Please enter both email and password.');
      setShowToast(true);
      return;
    }

    try {
      const user = await loginUser(email, password);
      console.log('Logged in user:', user);
      history.push({
        pathname: '/home'
      });
    } catch (error: any) {
      console.error('Error logging in:', error);
      if (error.response && error.response.data) {
        if (error.code === 'auth/user-not-found') {
          setToastMessage('No user found with this email.');
        } else if (error.code === 'auth/wrong-password') {
          setToastMessage('Incorrect password.');
        } else if (error.code === 'auth/invalid-email') {
          setToastMessage('The email address is not valid.');
        } else {
          setToastMessage('Error logging in. Please try again.');
        }
      } else {
        setToastMessage(error.code)
      }
      setShowToast(true);
    }
  };

  return (
    <IonPage className='page-container'>
      <IonContent className='form ion-padding'>
        <IonGrid className='flex flex-column gap-8'>
          <IonRow>
            <IonText className='text-center full'>
              <h3>Login</h3>
            </IonText>
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
              <IonInputPasswordToggle color={'medium'} slot='end' />
            </IonInput>
          </IonRow>
          <IonRow className='ion-padding'>
            <IonButton expand='block' className='button primary' onClick={handleLogin}>Login</IonButton>
          </IonRow>
          <IonRow>
            <div className='justify-between flex full'>
              <div className='ion-text-start'>
                <Link className="c-tertiary" to='/Register'>Create Account</Link>
              </div>
              <div className='ion-text-end'>
                <Link className='c-tertiary' to='/ForgotPassword'>Forgot Password</Link>
              </div>
            </div>
          </IonRow>
          <IonToast
            cssClass='toast-warning'
            position='middle'
            isOpen={showToast}
            message={toastMessage}
            duration={3000}
            onDidDismiss={() => setShowToast(false)}
          />
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Login;
