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

## 7. Face Recognition Modeling and Related API Usage
- The face recognition modeling in this project was built using the **face-api.js** package.
- Methods provided by the model, such as `matchDimensions` and `TinyFaceDetectorOptions`, were utilized to simplify method calls.
- For image detection and emotion analysis, a custom-trained model was applied.
  - The training process was conducted in a development environment equipped with a high-performance GPU.
  - The trained model was converted into the TensorFlow.js format, separating the weight information into a `shard1` file and the module for communication with Vue and other frameworks into a JSON file.

---

### 7-1. Face Detection Module
#### Files:
- **tiny_face_model-shard1**  
- **tiny_face_detector_model-weights_manifest.json**

#### Details:
- Used **TensorFlow.js** to detect human face contours.
- The `weights_manifest.json` file converts the detected face contours into a JSON format for communication with Vue.
- Utilized **CNN (Convolutional Neural Networks)** to detect faces, incorporating **Depthwise Separable Convolution** to optimize the model's lightweight nature.
- The model was trained with various image augmentations, such as brightness adjustment and rotation, to handle diverse lighting conditions and angles.
- A lightweight structure based on **MobileNet** was adopted to enable real-time analysis.

---

### 7-2. Facial Expression Recognition Module
#### Files:
- **face_expression_model-shard1**  
- **face_expression_model-weights_manifest.json**

#### Details:
- Used **TensorFlow.js** to recognize facial expressions of detected faces.
- The training was conducted with images designed for Korean emotion recognition, available via the following link:  
  [Korean Emotion Recognition Dataset](https://aihub.or.kr/aihubdata/data/view.do?currMenu=115&topMenu=100&aihubDataSe=realm&dataSetSn=82)
- Seven emotion labels were applied:
  - `neutral`, `sad`, `surprised`, `happy`, `angry`, `disgusted`, `scared`.
- Enabled GPU acceleration within browsers by leveraging **WebGL**.

