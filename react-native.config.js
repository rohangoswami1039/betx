module.exports = {
  dependencies: {
    'native-base': {
      // Disable Android platform for native-base v2.x as it doesn't need native linking
      platforms: {
        android: null,
      },
    },
  },
};