import React from 'react';
import { SafeAreaView, StatusBar, Text } from 'react-native';

export const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <Text>Hello Symbiot</Text>
      </SafeAreaView>
    </>
  );
};

export default App;
