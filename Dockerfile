FROM reactnativecommunity/react-native-android:latest
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

RUN npx eas build --platform android --local --output /app/app-release.apk