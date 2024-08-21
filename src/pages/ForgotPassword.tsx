import { useState } from "react";
import {
  IonButton,
  IonContent,
  IonInput,
  IonText,
  IonGrid,
  IonCol,
  IonRow,
  IonToast,
  IonPage,
} from "@ionic/react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPasswordPage: React.FC = () => {
  const [emailVerification, setEmailVerification] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const auth = getAuth();

  const handleForgotPassword = () => {
    if (!emailVerification) {
      setInvalidMessage("Email field cannot be empty.");
      setInvalid(true);
      return;
    }

    sendPasswordResetEmail(auth, emailVerification)
      .then(() => {
        setSuccess(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(
          "Error sending password reset email:",
          errorCode,
          errorMessage
        );

        if (errorCode === "auth/user-not-found") {
          setInvalidMessage("Email does not exist.");
        } else if (errorCode === "auth/invalid-email") {
          setInvalidMessage("Invalid email address.");
        } else {
          setInvalidMessage("Error sending password reset email.");
        }

        setInvalid(true);
        setEmailVerification("");
      });
  };

  return (
    <IonPage className="page-container">
      <IonContent className="ion-padding">
        <IonGrid className="form">
          <IonRow>
            <IonCol className="text-center full" size="12">
              <IonText>
                <h3>Enter email below to reset password.</h3>
              </IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonInput
                type="email"
                className="input-field"
                label="Enter Email Address"
                labelPlacement="stacked"
                value={emailVerification}
                onIonChange={(e) => setEmailVerification(e.detail.value!)}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonButton
                shape="round"
                expand="block"
                className="button primary"
                onClick={handleForgotPassword}
              >
                Send Verification Email
              </IonButton>
            </IonCol>
          </IonRow>
          <div className="ion-text-start">
            <IonButton fill="clear" color={"tertiary"} routerLink="/Login">
              Back to Login
            </IonButton>
          </div>
          <IonToast
            isOpen={invalid}
            onDidDismiss={() => setInvalid(false)}
            message={invalidMessage}
            duration={2000}
          />
          <IonToast
            isOpen={success}
            onDidDismiss={() => setSuccess(false)}
            message="Password reset email sent. Email may take 5-10 minutes."
            duration={5000}
          />
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default ForgotPasswordPage;
