/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import 'react-native-gesture-handler';
import { name as appName } from './app.json';

// Ensure app.json exists and contains the correct name
if (!appName) {
    throw new Error('app.json must contain a "name" property');
}

console.log('Registering app...');

AppRegistry.registerComponent(appName, () => App);
