module.exports = {
  name: 'SpendWise',
  slug: 'expensetracker',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  extra: {
    eas: {
      projectId: "a107f421-bf19-455d-8d46-28675c3ccd00"
    }
  },
  ios: {
    bundleIdentifier: "com.spendwise.expensetracker",
    buildNumber: "1.0.0"
  },
  android: {
    package: 'com.spendwise.expensetracker',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    }
  },
  plugins: [
    "expo-router",
    "expo-splash-screen"
  ],
  scheme: "expensetracker",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash-icon.png",
    imageWidth: 200,
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  }
};