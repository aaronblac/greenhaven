import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonToast, IonInputPasswordToggle, IonGrid, IonRow, IonText } from '@ionic/react';
import { useHistory, useLocation } from 'react-router';
import { loginUser } from '../services/authService';
import { Link } from 'react-router-dom';
import { Place } from '../../functions/src/searchFunctions';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const history = useHistory();
  const location = useLocation<{ from?: string; placeId?: string; place?: Place; searchText?: string; results?: Place[]; view?: string }>();

  const handleLogin = async () => {
    if (!email || !password) {
      setToastMessage('Please enter both email and password.');
      setShowToast(true);
      return;
    }

    try {
      const user = await loginUser(email, password);
      if (location.state?.from) {
        history.replace({
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
        history.replace('/home');
      }
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

  const handleSubmit = (e: React.FormEvent)=> {
    e.preventDefault();
    handleLogin();
  }

  return (
    <IonPage className='page-container'>
      <IonContent className='form ion-padding'>
        <IonGrid className='flex flex-column gap-8'>
          <IonRow>
            <IonText className='text-center full'>
              <h3>Login</h3>
            </IonText>
          </IonRow>
          <form className="flex flex-column gap-16" onSubmit={handleSubmit}>
            <IonRow>
              <IonInput
                className='ion-padding-horizontal'
                label="Email"
                labelPlacement="stacked"
                value={email}
                onInput={(e: any) => setEmail(e.target.value)}
                type="email"
              />
            </IonRow>
            <IonRow>
              <IonInput
                className='ion-padding-horizontal'
                label="Password"
                labelPlacement="stacked"
                value={password}
                onInput={(e: any) => setPassword(e.target.value)}
                type="password"
              >
                <IonInputPasswordToggle color={'medium'} slot='end' />
              </IonInput>
            </IonRow>
            <IonRow>
              <IonButton expand='block' className='button primary' type='submit'>Login</IonButton>
            </IonRow>
          </form>
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
