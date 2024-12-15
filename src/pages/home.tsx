import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import QRScanner from "../components/qrScanner";
import XButton from "../components/XButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
const dWidth = Dimensions.get("window").width;

const clr1 = "mediumseagreen";

const ScanQRPage = () => {
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState<Student | null>();
  
  const navigator = useNavigation();

  type Student = {
    uid: string;
    first_name: string;
    last_name: string;
  }

  const openQRscanner = () => {
    setShowQR(true);
  };

  useEffect(() => {
    if(!qrCode) return;

    setTimeout(() => {
      setQrCode(null);  
    }, 10000);


  }, [qrCode]);

  useEffect(() => {
    navigator.addListener('beforeRemove',(e) => {e.preventDefault();});
  
    return () => {
      
    }
  }, [navigator])

  const onQrRead = async (qrtext: string) => {
    const student: Student = JSON.parse(qrtext);
    const storedStudents = JSON.parse(await AsyncStorage.getItem("students") ?? '') as Array<Student> || [];
    storedStudents.push(student);
    await AsyncStorage.setItem("students", JSON.stringify(storedStudents));
    setQrCode(student);
    setShowQR(false);
  };

  return (
    <View style={styles.page}>
      {qrCode ? (
        <View>
            <Text style={{ fontSize: 16, color: "black", marginBottom: 10 }}>
                Student Details
            </Text>
            <Text style={{ fontSize: 14, color: "black" }}>
                Nom Complet : {qrCode.first_name} {qrCode.last_name}  
            </Text>
            <Text style={{ fontSize: 13, color: "black" }}>
                UID : {qrCode.uid}
            </Text>
            
        </View>
      ) : null}
      <Ionicons
        name={"scan-circle-outline"}
        size={qrCode ? dWidth * 0.4 : dWidth * 0.75}
        color={clr1}
      />
      <TouchableOpacity onPress={() => openQRscanner()} style={styles.btn}>
        <Text style={{ color: clr1 }}>Scan QR</Text>
      </TouchableOpacity>
      <XButton text="Show list" onClick={()=>{
        navigator.navigate('list');
      }} >

      </XButton>
      {showQR ? <QRScanner onRead={onQrRead} /> : null}
    </View>
  );
};

export default ScanQRPage;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  btn: {
    backgroundColor: "transparent",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: "3%",
    width: "50%",
    borderWidth: 2,
    borderColor: clr1,
  },
  btnText: {
    color: clr1,
  },
});