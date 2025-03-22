import 'dotenv/config'
export default {
  "expo": {
    "name": "HalalExpress",
    "slug": "frontend",
    "scheme": "frontend",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.ampol321.frontend",
      "config": {
        "googleMaps": {
          "apiKey": "AIzaSyBb5KicFxg9zwfu05AjPuacFyT0AtwW6sE"
        }
      },
      "googleServicesFile": "./google-services.json"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "firebase": {
        "apiKey": "AIzaSyChi4RK2bphEVRwJ_Ma_GNmr2sljXEXeJM",
        "authDomain": "halalexpress-86dbb.firebaseapp.com",
        "projectId": "halalexpress-86dbb",
        "storageBucket": "halalexpress-86dbb.firebasestorage.app",
        "messagingSenderId": "239431572065",
        "appId": "1:239431572065:web:d9ec84ad5922158044a820",
      },
      "eas": {
        "projectId": "67884e58-e57c-4668-8358-1cb93cb57fbb"
      }
    },
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
    ]
  }
}