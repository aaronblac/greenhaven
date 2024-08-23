# greenhaven
GreenHaven App

## Overview

GreenHaven is an Ionic React application designed to help users discover and review natural spaces like parks, campgrounds, and wildlife areas. The app allows users to search for these places, view details, add them to favorites, and write or read reviews. The app is built with Firebase for authentication, Firestore for data storage, and Google Maps API for location-based searches and mapping.

## Features

- **User Authentication:** Users can register, log in, and reset their passwords using Firebase Authentication.
- **Search:** Users can search for places by address or location, filter by distance and type, and view autocomplete suggestions provided by the Google Places API.
- **Favorites:** Users can save places to their favorites list and manage these preferences. Firebase Firestore is used to store and retrieve the list of favorite places.
- **Reviews:** Users can submit and read reviews for different places. Reviews are stored in Firebase Firestore and accessed through Firebase Functions.
- **Google Maps Integration:** The app uses Google Maps to display places and allow users to interact with markers. Custom markers are used to enhance the visual representation.
- **Recent Views:** The app tracks recently viewed places and allows users to revisit them easily.

## Project Structure

### Pages

1. **Home:** The landing page after login that displays a search bar and recently viewed places.
2. **Login:** Allows users to sign in using their email and password.
3. **Register:** Allows new users to create an account.
4. **ForgotPassword:** Provides an interface for users to reset their password by sending a verification email.
5. **PlaceDetail:** Displays detailed information about a selected place, including images, reviews, and an option to write a review.
6. **WriteReview:** Enables users to submit a review for a place.
7. **Favorites:** Shows the list of places that a user has marked as favorites.

### Components

1. **MapView:** 
   - Displays a Google Map with markers for places based on search results.
   - Handles marker clicks to navigate to the `PlaceDetail` page.
   - Custom markers are used, with specific images representing different places.
  
2. **CustomSearchbar:** 
   - A search bar component with support for autocomplete suggestions and geolocation-based searches.
   - Includes a list of suggestions below the search bar.
   - Used on the Home page to search for places.

3. **ReviewList:** 
   - Displays a list of reviews for a specific place.
   - Reviews can come from GreenHaven's own database or from Google Places.
   - The component formats the review's timestamp and displays ratings with star icons.

4. **TopMenu:** 
   - A component used within the `IonMenu` to display a side menu with navigation options.
   - Provides quick access to different parts of the app like Home, Favorites, and Logout.

5. **ListView:** 
   - Displays a list of places in a scrollable list.
   - Each list item includes place details such as name, address, and rating.
   - Users can click on a list item to navigate to the `PlaceDetail` page.

### Services

1. **authService:** 
   - Handles user authentication with Firebase, including registering, logging in, and sending password reset emails.

2. **reviewService:** 
   - Manages review submissions and fetching reviews for places and users through Firebase Functions.
   - Includes methods like `submitReview`, `getReviewForPlace`, and `getUserReviews`.

3. **searchService:** 
   - Handles searching for places by address or location using the Google Places API.
   - Fetches place details and provides autocomplete suggestions.
   - Includes methods like `searchByAddress`, `searchByLocation`, `fetchPlaceDetails`, and `getAutocompleteSuggestions`.

4. **userService:** 
   - Manages user-related operations such as fetching and updating user favorites and recent views.
   - Includes methods like `getUserFavorites`, `addToFavorites`, `removeFromFavorites`, `getRecentViews`, and `updateRecentViews`.

5. **apiService:** 
   - Fetches the Google Maps API key from a secure location (e.g., an environment variable or a configuration file).
   - Ensures that the API key is available for components like `MapView`.

### Firebase Functions and API Endpoints

The backend of the application is powered by Firebase Functions, which handle various API requests and interact with Firestore. Below is a list of the available API endpoints and their functionality:

#### Authentication Endpoints

- **POST `/register`**
  - Registers a new user.
- **POST `/login`**
  - Logs in an existing user.
- **POST `/logout`**
  - Logs out the user.

#### Review Endpoints

- **POST `/reviews`**
  - Adds a new review for a specific place.
  - **Request Body:**
    - `userId`: ID of the user submitting the review.
    - `placeId`: ID of the place being reviewed.
    - `userRating`: Rating given by the user.
    - `comment`: Review comment.
    - `username`: Username of the reviewer.
    - `createdAt`: Timestamp of the review.
- **GET `/reviews`**
  - Retrieves reviews for a specific place based on `placeId`.
- **GET `/user-reviews`**
  - Retrieves all reviews submitted by a specific user based on `userId`.

#### Favorites and Recent Views Endpoints

- **GET `/get-favorites`**
  - Retrieves a list of favorite places for a specific user based on `userId`.
- **POST `/add-favorites`**
  - Adds a place to the user's favorites list.
  - **Request Body:**
    - `userId`: ID of the user.
    - `placeId`: ID of the place to be added to favorites.
- **POST `/remove-favorite`**
  - Removes a place from the user's favorites list.
  - **Request Body:**
    - `userId`: ID of the user.
    - `placeId`: ID of the place to be removed from favorites.
- **POST `/update-recent-views`**
  - Updates the list of recently viewed places for a user.
  - **Request Body:**
    - `userId`: ID of the user.
    - `placeId`: ID of the place to be added to recent views.
- **GET `/get-recent-views`**
  - Retrieves the list of recently viewed places for a specific user based on `userId`.

#### Search Endpoints

- **GET `/search-address`**
  - Searches for places based on a provided address.
  - **Query Parameters:**
    - `address`: Address to search for.
    - `radius`: Radius in meters within which to search.
    - `type`: Type of places to search for.
- **GET `/search-location`**
  - Searches for places based on geographical coordinates.
  - **Query Parameters:**
    - `latitude`: Latitude of the location.
    - `longitude`: Longitude of the location.
    - `radius`: Radius in meters within which to search.
    - `type`: Type of places to search for.
- **GET `/autocomplete`**
  - Provides autocomplete suggestions for place names or addresses based on user input.
  - **Query Parameters:**
    - `input`: The partial input text for which suggestions are needed.
- **GET `/place-details`**
  - Retrieves detailed information about a specific place based on `placeId`.

#### Miscellaneous Endpoints

- **GET `/api-key`**
  - Retrieves the Google Maps API key used by the application.

## Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/aaronblac/greenhaven.git
   cd greenhaven
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Firebase:**
   - Create a Firebase project.
   - Add Firebase configuration to `firebaseConfig.js`.
   - Enable Firebase Authentication, Firestore, and Firebase Functions.

4. **Set Up Google Maps API:**
   - Get an API key from Google Cloud Console.
   - Add the API key to your environment variables or directly into the app.

5. **Run the App:**
   ```bash
   npm start
   ```

## Deployment

For deployment, you can use Firebase Hosting or any other static hosting service. Ensure that Firebase Functions are deployed properly to handle the backend services.

## Contributing

Contributions are welcome! Please create a pull request with your proposed changes and ensure they are well-documented.
