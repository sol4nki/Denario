import { registerRootComponent } from 'expo';


// import Homepage from './Homepage';
// import TokenSearch from './components/Search';
// import App from './App';
import Welcome from './welcome/Welcome';
// import Miscellaneous from './MiscPage/miscMain';
// import Biometric from './Biometric';
// import TradeSwap from './tradeSwap/TradeSwap';
// import RecentLogs from './activity/RecentLogs';

// import Miscellaneous from './miscPage/miscMain';
// import CoinDetails from './CoinDetails/coinDetails';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately

registerRootComponent(Welcome);

