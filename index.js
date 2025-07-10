import { registerRootComponent } from "expo";
import 'react-native-get-random-values';
import App from "./App";
import { LogBox } from "react-native";


LogBox.ignoreLogs([
  "VirtualizedLists should never be nested", 
]);

registerRootComponent(App);
