import { StyleSheet,Platform,StatusBar } from "react-native";
const miscStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0D0A19",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 40,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    color: "#EEEEEE",
    fontFamily: "Quicksand_600SemiBold",
    marginBottom: 30,
  },
  buttonsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    width: "90%",
    marginBottom: 20,
  },
  button: {
    width: "30%",
    height:"80", 
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 20,
    marginHorizontal:5
  },
  buttonLabel: {
    color: "white",
    fontSize: 12,
    fontFamily: "Quicksand_400Regular",
    marginTop: 6,
    textAlign: "center",
  },
  articlesContainer: {
    maxHeight:290,
    marginBottom:10,
    width: "90%",
  },
  articleCard: {
    backgroundColor: "#1C1B2A",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  articleTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
    fontFamily: "Quicksand_600SemiBold",
  },
  articleSummary: {
    color: "#CCCCCC",
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "Quicksand_400Regular",
  },
  viewNewsButton: {
  backgroundColor: "#4D96FF",
  paddingVertical: 12,
 paddingHorizontal:20,
  borderRadius: 25,
  marginBottom: 15,
  alignSelf: "center",
  shadowColor: "#000",
  shadowOpacity: 0.3,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 5,
  elevation: 8,
},
viewNewsText: {
  color: "white",
  fontSize: 16,
  fontWeight: "600",
  fontFamily: "Quicksand_600SemiBold",
},
modalOverlay:{
  backgroundColor:"#0d0a19",
  flex:1

},
modalContent:{
   backgroundColor:"#0d0a19",
  flex:1,
  justifyContent:"space-between"
},
modalTitle:{
  color: "white",
  fontSize: 20,
  fontWeight: "600",
  fontFamily: "Quicksand_600SemiBold",
  alignSelf:"center"
},
modalTitleHolder:{

}
});
export default miscStyles;