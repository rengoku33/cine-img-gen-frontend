# imageify - text to image generator
* built using react frontend and node backend (typescript on both sides)
• utilizes starryai API for image generation
• 

## frontend usage
This is the frontend code, you need to separately install backend from here: https://github.com/rengoku33/cine-img-gen-backend
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/rengoku33/cine-img-gen-frontend.git
   cd cine-img-gen-frontend
   npm i
   ```
2. Go to google dev console and create web app for oAuth, configure the app and generate client_id
3. Create .env in root directory
   ```bash
   REACT_APP_GOOGLE_CLIENT_ID=your_client_id
   ```
4. Run the app
   ```bash
   npm start
   ```
## project screenshots
![Screenshot 2025-05-25 213819](https://github.com/user-attachments/assets/6573c9b7-7e7b-475e-9880-fc4ebc5083e7)

![Screenshot 2025-05-26 000606](https://github.com/user-attachments/assets/8f8ec273-cb10-4d81-ba1c-15e90c1cc10a)

## Notes:
* The image generations might not be precise due to the approach I am following to achieve extended free version
* if you run out of attempts, simply logout and login
* no user data is collected, there is no database at all from my side
