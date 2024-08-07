import React, { useState } from 'react';
import { IonPage, IonHeader, IonContent, IonToolbar, IonTitle, IonInput, IonButton, IonToast, IonInputPasswordToggle } from '@ionic/react';
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

    try {
      const user = await loginUser(email,password);
      console.log('Logged in user:', user);
      history.push({
        pathname: '/home'
      });
    } catch (error:any) {
      console.error('Error logging in:', error);
      if (error.response && error.response.data){
        if (error.code === 'auth/user-not-found') {
          setToastMessage('No user found with this email.');
        } else if (error.code === 'auth/wrong-password') {
          setToastMessage('Incorrect password.');
        } else if (error.code === 'auth/invalid-email') {
          setToastMessage('The email address is not valid.');
        } else{
          setToastMessage('Error logging in. Please try again.');
        } 
      } else {
        setToastMessage("Network error. Please check your connection.")
      } 
      setShowToast(true);
    }
  };

  return (
    <IonPage className='page-container'>
      <IonContent className='form ion-padding'>
        <IonTitle className='text-center'>Login</IonTitle>
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
        <IonToast
          cssClass='toast-warning'
          position='middle'
          isOpen={showToast}
          message={toastMessage}
          duration={3000}
          onDidDismiss={() => setShowToast(false)}
        />
        <IonButton expand='block' className='button primary' onClick={handleLogin}>Login</IonButton>
        <div className='justify-between flex'>
          <div className='ion-text-start'>
            <Link className="c-tertiary" to='/Register'>Create Account</Link>
          </div>
          <div className='ion-text-end'>
            <Link className='c-tertiary' to='/ForgotPassword'>Forgot Password</Link>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
