import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toolbar from "./Toolbar";

const ReportPage = (props) => {
  const navigation = useNavigation();

  return (
    <View style={styles.allPage}>
      <Toolbar />

      <View style={styles.title}>
        <MaterialIcons name="update" size={50} color="black" />
        <Text style={styles.pageTitle}>דיווח: </Text>
      </View>

      <View style={styles.loc}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.butt, { backgroundColor: "#f6f9ff" }]}
            onPress={() =>
              navigation.navigate("ChooseClass", { param1: "ציונים" })
            }
          >
            <Text style={styles.text}>ציונים</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.butt, { backgroundColor: "#ecf2ff" }]}
            onPress={() =>
              navigation.navigate("ChooseClass", { param1: "נוכחות" })
            }
          >
            <Text style={styles.text}>נוכחות</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.loc}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.butt, { backgroundColor: "#e3ecff" }]}
            onPress={() =>
              navigation.navigate("ChooseClass", { param1: "מצב חברתי" })
            }
          >
            <Text style={styles.text}>מצב חברתי</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.butt, { backgroundColor: "#dae5ff" }]}
            onPress={() =>
              navigation.navigate("ChooseClass", { param1: "מצב נפשי" })
            }
          >
            <Text style={styles.text}>מצב נפשי</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.loc}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.butt, { backgroundColor: "#d1dfff" }]}
            onPress={() =>
              navigation.navigate("ChooseClass", { param1: " אלימות" })
            }
          >
            <Text style={styles.text}>אלימות</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.butt, { backgroundColor: "#c7d9fe" }]}
            onPress={() =>
              navigation.navigate("ChooseClass", { param1: "אירועים שונים" })
            }
          >
            <Text style={styles.text}>אירועים שונים</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.loc}>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.butt, { backgroundColor: "#bed2fe" }]}
            onPress={() =>
              navigation.navigate("ChooseClass", { param1: "נראות" })
            }
          >
            <Text style={styles.text}>נראות</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.butt, { backgroundColor: "#b5ccfe" }]}
            onPress={() =>
              navigation.navigate("ChooseClass", { param1: "תזונה" })
            }
          >
            <Text style={styles.text}>תזונה</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* <View style={styles.loc}>
            <View style={styles.row}>
                <TouchableOpacity style={[styles.butt, { backgroundColor:'#abc5fe' }]} onPress={() => navigation.navigate('ChooseClass', {param1:'שונות 1'})} >
                    <Text style={styles.text}>שונות1</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.butt, { backgroundColor:'#abc5fe' }]} onPress={() => navigation.navigate('ChooseClass', {param1:'שונות 2'})}>
                    <Text style={styles.text}>שונות2</Text>
                </TouchableOpacity>
            </View>
        </View> */}

      <TouchableOpacity
        style={styles.back}
        onPress={() => navigation.navigate("HomePage")}
      >
        <MaterialIcons name="navigate-next" size={24} color="black" />
        <Text>הקודם</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  allPage: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    //  flexDirection:'row',
    justifyContent: "space-around",
    alignItems: "center",
  },
  pageTitle: {
    color: "black",
    fontSize: 60,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  butt: {
    borderRadius: 20,
    width: 180,
    height: 65,
    marginHorizontal: 30,
    borderWidth: 1,
  },
  text: {
    fontSize: 30,
    textAlign: "center",
    padding: 10,
  },
  loc: {
    paddingTop: 30,
  },
  back: {
    padding: "30%",
  },
});

export default ReportPage;
