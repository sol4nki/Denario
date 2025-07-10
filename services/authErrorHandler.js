import {Alert} from "react-native";

export default function authErrorHandler(error,navigation){

    ir (error.message === "NOT_AUTHENTICATED"){
        Alert.alert (
            "Authentication Required",
            "Please authenticate with biometric to continue",
           
           [
             {text: "Go to biometric." ,onPress : () => {navigation.navigate("Biometric")} },
             {text: "Cancel", onPress : () => {navigation.goBack()} }

           ]
        )
    }

}