import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0A19',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerStyle:{
    height:50,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginTop:0,
    backgroundColor:'#0D0A19',
    paddingHorizontal:10,
    borderBottomWidth:2,
    shadowColor:"#bea9fe",
    elevation:0,
    borderColor:"#0d0a19",
    borderRadius:5
    },
    detailsContainer:{
        flexDirection: "row",
        alignItems:"center"
    },
  coinName:{
    padding:2,
    color: "white",
    fontWeight: "bold",
    marginHorizontal: 5,
    fontFamily:"Verdana",
    fontSize: 20,
  },
  rankContainer:{ 
    backgroundColor: '#4b4b4b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5, 
  },
  });
export default styles;