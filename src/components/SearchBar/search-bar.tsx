// components/CustomSearchbar.tsx
import React from "react";
import {
  IonSearchbar,
  IonButton,
  IonIcon,
  IonItem,
  IonList,
} from "@ionic/react";
import { locate } from "ionicons/icons";

interface CustomSearchbarProps {
  value: string;
  suggestions: string[];
  onIonChange: (e: CustomEvent) => void;
  onGeoClick: () => void;
  onSuggestionSelect: (suggestion: string) => void;
}

const CustomSearchbar: React.FC<CustomSearchbarProps> = ({
  value,
  suggestions,
  onIonChange,
  onGeoClick,
  onSuggestionSelect,
}) => {
  
  return (
    <div className="full" style={{ position: "relative" }}>
      <IonSearchbar
        value={value}
        onIonInput={onIonChange}
        className="ion-searchbar-clear-button input-field"
      />
      <IonButton
        fill="clear"
        style={{
          position: "absolute",
          right: "0.5rem",
          top: "50%",
          transform: "translateY(-60%)",
          cursor: "pointer",
        }}
        onClick={onGeoClick}
      >
        <IonIcon icon={locate} ios={locate} md={locate} color="secondary" />
      </IonButton>
      {suggestions.length > 0 && (
        <IonList
          className="suggestions"
          style={{
            position: "absolute",
            top: "100%",
            width: "100%",
            zIndex: 10,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <IonItem
              key={index}
              button
              onClick={() => onSuggestionSelect(suggestion)}
            >
              {suggestion}
            </IonItem>
          ))}
        </IonList>
      )}
    </div>
  );
};

export default CustomSearchbar;
