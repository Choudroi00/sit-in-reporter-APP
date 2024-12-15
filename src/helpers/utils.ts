import AsyncStorage from "@react-native-async-storage/async-storage";



export const storeData = async (k: string, value: string) => {
    await AsyncStorage.setItem(k, value);
}