/**
 * @format
 */

import {AppRegistry, StyleSheet} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


const RootComponent = () => (
  <GestureHandlerRootView style={styles.Container}>
    <App />
  </GestureHandlerRootView>
);

AppRegistry.registerComponent(appName, () => RootComponent);

const styles = StyleSheet.create({
  Container: {
    flex: 1, 
  }
});