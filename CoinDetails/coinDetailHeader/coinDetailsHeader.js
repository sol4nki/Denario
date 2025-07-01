import React from "react";
import { View, Text, Image,StyleSheet } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
//import { useNavigation } from "@react-navigation/native";
//import { useWatchlist } from "watchlist stored place";
import styles from "./styles";

const CoinDetailsHeader = (props) => {
  const image=require("./favicon.png")
  const { coinId, symbol, marketCapRank } = props;
  //const navigation = useNavigation();
  //const { watchlistCoinIds, storeWatchlistCoinId, removeWatchlistCoinId } = useWatchlist();

  //const checkIfCoinIsWatchlisted = () => {true};
   // watchlistCoinIds.some((coinIdValue) => coinIdValue === coinId);

  //const handleWatchlistCoin = () => {true};
//     if (checkIfCoinIsWatchlisted()) {
//       return removeWatchlistCoinId(coinId)
//     }
//     return storeWatchlistCoinId(coinId)
   

  
    return (
    <View style={styles.headerStyle}>

       {//GO BACK
       } 

      <Ionicons
        name="chevron-back-sharp"
        size={20}
        color="#BEA9FE"
        //onPress={() => navigation.goBack()}
      />

      {// NAME - RANK - LOGO
      }
      <View style={styles.detailsContainer}>
        <Image source={image} style={{ width: 15, height: 15 }} />
        <Text style={styles.coinName}>{symbol.toUpperCase()}</Text>
        <View style={styles.rankContainer}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
            #{marketCapRank}
          </Text>
        </View>
      </View>

      {
        //WATCHLIST ICON
      }
      <FontAwesome
        name={"star"}
        size={20}
        color={"white"}
    
        
      />
    </View>
  );
}

export default CoinDetailsHeader;