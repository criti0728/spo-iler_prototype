# Sports Match Prediction Program

This program aims to predict the outcome of sports matches by analyzing the facial expressions of players, coaches, or other personnel involved in the game. Using advanced facial recognition and emotion analysis technologies, the program extracts emotions from facial expressions, evaluates game dynamics, and calculates the probability of victory. Users can also access the results and their associated photos through a personalized profile page.

---

# Detailed Design Document

## 1. Requirements Definition

The requirements for this project are categorized as follows:

### 1.1 User Features
- **Sign-up**: Allows users to create an account by entering their details.
- **Login/Logout**: Users securely access and exit the system.

### 1.2 Management Features
- **Role Management**: Restrict access to resources based on user roles.
- **Admin Page**: Manage all user information and activity logs.

### 1.3 Security Features
- **JWT-based Authentication**: Manage sessions using tokens.
- **Data Encryption**: Encrypt user passwords for secure storage.

### 1.4 Game Analysis Features
- Input the current status of the game and upload photos of game personnel.
- Extract emotions from facial expressions in the uploaded photos.
- Predict the flow of the game and calculate victory probabilities based on the extracted emotions.
- Display photos submitted for analysis on the user's profile page.

---

## 2. Use Case Diagram

### Actors
- **User**: Represents individuals interacting with the system.

### Use Cases
1. **Sign-up**: Create a new account.
2. **Login/Logout**: Authenticate users for system access.
3. **Profile Page Access**: View logs of previously analyzed photos.
4. **Game Data Input**: Submit game details and associated photos for analysis.
5. **Emotion Analysis**: Extract emotions from photos and calculate victory probabilities.

---

## 3. Database Structure (ERD)

This project utilizes NoSQL for stability, with tables generated through Hibernate. The main database structure is as follows:

| Table Name   | Columns                        | Description                     |
|--------------|--------------------------------|---------------------------------|
| **Role**     | `id`, `name`                  | Stores user role information.  |
| **User**     | `id`, `username`, `email`, `password` | Stores user details.          |
| **User_Role**| `user_id`, `role_id`          | Manages many-to-many relations.|

---

## 4. Class Diagram

The key classes in this project and their relationships are as follows:

### 4.1 User
- **Attributes**: `id`, `username`, `email`, `password`
- **Methods**: Authentication-related logic.

### 4.2 Role
- **Attributes**: `id`, `name`
- **Methods**: Role management logic.

### 4.3 EmotionAnalysis
- **Attributes**: `photo`, `emotions`, `victoryProbability`
- **Methods**: Analyze emotions and calculate winning probabilities.

### 4.4 AuthController
- Handles sign-up and login/logout functionality.

### 4.5 PhotoRepository
- Stores photo data and links them to analysis results.

---

## 5. Libraries and Frameworks

### Frontend
- **Vue.js**: A framework for building user interfaces, supporting component-based architecture for code reusability.
- **Vue Router**: Manages client-side routing for seamless navigation.
- **Vuex**: Simplifies application state management.
- **Axios**: Handles HTTP requests to the backend.

### Backend
- **Spring Boot**: Streamlines application setup and development.
- **Spring Security**: Provides high-level security for authentication and authorization.
- **Hibernate (JPA)**: Simplifies database operations by mapping objects to database tables.
- **JWT**: Ensures secure stateless authentication between client and server.

---

## 6. Reasons for Framework Choices

### Frontend
- **Vue.js**: Lightweight and efficient for developing SPA (Single Page Applications).
- **Vue Router**: Enhances user experience by enabling routing without page reloads.
- **Vuex**: Solves complex state synchronization across components.

### Backend
- **Spring Boot**: Provides an easy-to-setup environment for scalable development.
- **Spring Security**: Standardizes authentication and authorization processes to prevent vulnerabilities.
- **Hibernate (JPA)**: Ensures stability and ease of deployment by abstracting database interactions.
- **JWT**: Implements stateless authentication, reducing server load and enhancing scalability.

---

## 7. Face-Recognition Modeling and API Usage

### Modeling Process
1. **Image Preprocessing**:
   - Normalize image resolution and remove noise.
   - Crop photos to focus on faces using a face-detection library.

2. **Emotion Recognition**:
   - Use a pre-trained model (e.g., OpenCV or TensorFlow) to classify emotions such as happiness, anger, or sadness.
   - Assign a probability score to each detected emotion.

3. **Game Flow Analysis**:
   - Use detected emotions as input for a predictive model.
   - Evaluate game dynamics and calculate victory probabilities based on aggregated emotions.

### API Usage
- **Face Detection**:
   - OpenCV or Dlib for efficient face detection.
- **Emotion Classification**:
   - TensorFlow-based models for extracting emotion probabilities.
- **Backend Integration**:
   - Expose REST APIs for uploading photos and retrieving analysis results.
