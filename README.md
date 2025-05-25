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
