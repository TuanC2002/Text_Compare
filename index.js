/**
 * @format
 */
import { AppRegistry } from 'react-native';
import { React, useCallback, useState, useRef } from 'react';
import { name as appName } from './app.json';
import { StyleSheet, Text, SafeAreaView, Button, ScrollView, View, ImageBackground, Image, TextInput, TouchableWithoutFeedback, Keyboard, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs'
import Highlighter from './highlight.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Worddiff } from './findDiff';


// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';


//////////////////////////////////////////////
AppRegistry.registerComponent(appName, () => App);

const logo = { uri: 'https://reactnative.dev/img/tiny_logo.png', width: 64, height: 64 };
const background = { uri: 'https://images.pexels.com/photos/2310713/pexels-photo-2310713.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' };
const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

const App = () => {
  
  ///#########################  CÁC SCREENS  ###################################///

  function HomeScreen({ navigation }) {
    const [name, setName] = useState(" ");
    return(
      <SafeAreaView style={styles.container1}>
        <Text>{"\n"}</Text>
        <StatusBar barStyle="light-content" />
        <KeyboardAvoidingView behavior='height' style={styles.container1}>
          <Text style={styles.title3}>TEXT COMPARE APP</Text>
          <Text style={styles.title}>MỘT ỨNG DỤNG CỦA TEAM DTDT</Text>
          <Image source={logo} style={{ alignSelf: 'center' }} />
          <TouchableWithoutFeedback style={styles.container2}
            onPress={Keyboard.dismiss}
            >
            <View style={styles.logoContainer}>
              <View style={styles.infoContainer}>
                <Text style={styles.title}>Thông tin người dùng</Text>
                <TextInput style={styles.input}
                  placeholder="Nhập tên của bạn"
                  placeholderTextColor='rgba(255,255,255,0.8)'
                  onChangeText={value => setName(name)}
                  returnKeyType='next'
                  //blurOnSubmit={false}
                />
                {/* <ScrollView keyboardDismissMode='none' scrollEnabled={false}> */}
                <TouchableOpacity style={styles.buttonContainer}>
                  <Button
                    title="Bắt đầu"
                    color="#f28482"
                    onPress={() => navigation.navigate('Main')}
                  />
                </TouchableOpacity>
                {/* </ScrollView> */}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
    
  }

  state = {
    TextInputValue: '', // for onChangeText handler
    newText: '', // for button onClick handler
  }
  onPress = () => {
    this.setState({
      newText: this.state.TextInputValue,
    });
  }

  function MainScreen({ navigation }) {
    ///set value
    const [nameFile1, setnameFile1] = useState("Chọn File số 1");
    const [nameFile2, setnameFile2] = useState("Chọn File số 2");
    const [fileData1, setFileData1] = useState("");//////biến lưu dư liệu text 1
    const [fileData2, setFileData2] = useState("");//////biến lưu dữ liệu text 2
    const [numofLineFile1, setnumofLineFile1] = useState(0);
    const [numofLineFile2, setnumofLineFile2] = useState(0);
    const [search_word1, setsearchWord1] = useState("");
    const [search_word2, setsearchWord2] = useState("");
    const [fileData3, setFileData3] = useState("");
    const [fileData4, setFileData4] = useState("");
    const [lstDiff1,setlstDiff1] =useState([]);
    const [lstDiff2,setlstDiff2] =useState([]);


    ///////////////////////////////////////////////
    //////////////////// pick file ////////////////

    let ChoseFile1 = useCallback(async () => {
      try {
        let response1 = await DocumentPicker.pickSingle();
        setnameFile1(response1.name);
        readFile1(response1.uri);
      } catch (err) {
        console.warn(err);
      }
    }, []);

    let ChoseFile2 = useCallback(async () => {
      try {
        let response2 = await DocumentPicker.pickSingle();
        setnameFile2(response2.name);
        readFile2(response2.uri);
      } catch (err) {
        console.warn(err);
      }
    }, []);

    /////////////////////read file///////////////////

    let readFile1 = async (path) => {
      let response = await (await RNFS.readFile(path)).toString();
      while (response[response.length - 1] == '\n') {
        response = response.slice(0, -1);
      }
      setFileData1(response); //set the value of response to the fileData Hook.
      setnumofLineFile1(response.split("\n").length);
      setnumchar1(response.length);
    };

    let readFile2 = async (path) => {
      let response = await (await RNFS.readFile(path)).toString();
      while (response[response.length - 1] == '\n') {
        response = response.slice(0, -1);
      }
      setnumofLineFile2(response.split("\n").length);
      // setnumchar2(response.length);
      setFileData2(response); //set the value of response to the fileData Hook.
    };
    ////////////////////count char, line///////////////////

    let return1 = async (text) => {
      while (text[text.length - 1] == '\n') {
        text = text.slice(0, -1);
      }
      setnumofLineFile1(text.split("\n").length);
      setFileData1(text);
      // setnumchar1(text.split(" ").length);
    }
    let return2 = async (text) => {
      while (text[text.length - 1] == '\n') {
        text = text.slice(0, -1);
      }
      setnumofLineFile2(text.split("\n").length);
      setFileData2(text);
      // setnumchar2(text.split(" ").length);
    }
    function SwapText() {
      setFileData1(fileData2);
      setFileData2(fileData1);
    }

    function Compare() {
      const lstDiff = Worddiff(fileData1,fileData2);
      setlstDiff1(lstDiff[0]);
      setlstDiff2(lstDiff[1]);

      setFileData3(fileData1);
      setFileData4(fileData2);
    }
    /////////////////////////////////////////////////
    return (
      <ScrollView style={styles.container}>
        <Text>{"\n"}</Text>
        <Button title="Go back" color="#d62828" onPress={() => navigation.goBack()} />
        <ImageBackground source={background} resizeMode="stretch" style={styles.image}>
          {/* <Text>Người dùng: {name}</Text> */}
          <Text>{"\n"}</Text>
          <Text style={styles.title3}>TEXT COMPARE APP</Text>
          <Text>{"\n"}</Text>

          <View style={styles.fixToText}>
            <Button
              title="Reset 🔑"
              color="#d62828"
              onPress={() => {
                setnameFile1("Chọn file số 1")
                setnameFile2("Chọn file số 2")
                setFileData1("Text số 1")
                setFileData2("Text số 2")
                setnumofLineFile1("0")
                setnumofLineFile2("0")
                setsearchWord1("Tìm kiếm")
                setsearchWord2("Tìm kiếm")
              }}
            />
            {/* <Button
              title="Lịch sử 🔒"
              color="#52b788"
              onPress={() => navigation.navigate('History')}
            /> */}
          </View>

          <Text>{"\n"}</Text>
          <Text style={styles.normal}>Các cách thực hiện:</Text>
          <Text style={styles.unnormal}>- Chọn 2 file txt để so sánh{"\n"}
            - Paste text vào 2 text box{"\n"}</Text>

          <SafeAreaView style={styles.normal}>
            <Text style={styles.filename}>File 1 📁</Text>
            <View style={styles.innerContainer}>
              <TextInput
                placeholder={nameFile1}
                style={styles.textStyle}
                editable={false}
              />
              <Button
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                color="#f9c74f"
                title="Chọn 📑"
                onPress={ChoseFile1}
              />
            </View>

            <Text>{"\n"}</Text>

            <Text style={styles.filename}>File 2 📁</Text>
            <View style={styles.innerContainer}>
              <TextInput
                placeholder={nameFile2}
                style={styles.textStyle}
                editable={false}
              />
              <Button
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}
                title="Chọn 📑"
                color="#f9c74f"
                onPress={ChoseFile2}
              />
            </View>
          </SafeAreaView>

          <Text>{"\n"}</Text>

          <Text style={styles.normal}>Text đã nhập 📖</Text>

          <SafeAreaView style={styles.normal}>
            <Text style={styles.filename2}>Text 1 📃</Text>
            <View style={styles.innerContainer}>
              <TextInput
                padding={5}
                placeholder="Tìm kiếm"
                style={styles.textStyle2}
                onChangeText={newtext => setsearchWord1(newtext)}
              />
            </View>

            <Text>{"\n"}</Text>
            <Highlighter
              placeholder="Text số 1"
              scrollEnabled={true}
              textAlignVertical='top'
              highlightStyle={{ backgroundColor: 'yellow' }}
              searchWords={[search_word1]}
              textToHighlight={fileData1}
              multiline={true}
              numberOfLines={10}
              style={styles.textBox}
              editable={true}
              onChangeText={text => return1(text)}
            />
            <Text style={styles.filename}>Số dòng: {numofLineFile1}</Text>

            <Button
              title="Đổi vị trí 2 text"
              onPress={() => SwapText()}
            // onPress={()=>{console.log(fileData1)}}
            />

            <Text>{"\n"}</Text>

            <Text style={styles.filename2}>Text 2 📃</Text>
            <View style={styles.innerContainer}>
              <TextInput
                padding={5}
                placeholder="Tìm kiếm"
                style={styles.textStyle2}
                editable={true}
                onChangeText={text => setsearchWord2(text)}
              />
            </View>

            <Text>{"\n"}</Text>
            <Highlighter
              placeholder="Text số 2"
              scrollEnabled={true}
              textAlignVertical='top'
              highlightStyle={{ backgroundColor: 'yellow' }}
              searchWords={[search_word2]}
              textToHighlight={fileData2}
              multiline={true}
              numberOfLines={10}
              style={styles.textBox}
              editable={true}
              onChangeText={text => return2(text)}

            />
            <Text style={styles.filename}>Số dòng: {numofLineFile2}</Text>
          </SafeAreaView>

          <Text>{"\n"}</Text>


          <Text style={styles.normal}>Compare Text 📒📒</Text>


          <Text>{"\n"}</Text>

          <SafeAreaView>
            <View style={styles.fixToText2}>
              <Button
                title="So sánh và hiện tất cả"
                onPress={() => Compare()}
              />

              <Text>{"\n"}</Text>

            </View>
            {/* <Text style={styles.filename2}>Text 1 📃</Text>
            <TextInput
              placeholder={fileData2}
              style={styles.textBox}
              multiline={true}
              numberOfLines={10}
              textAlignVertical='top'
              editable={false}
              scrollEnabled={true}
              value={fileData3}
            />

            <Text>{"\n"}</Text>

            <Text style={styles.filename2}>Text 2 📃</Text>
            <TextInput
              placeholder={fileData2}
              style={styles.textBox}
              multiline={true}
              numberOfLines={10}
              textAlignVertical='top'
              editable={false}
              scrollEnabled={true}
              value={fileData4}
            /> */}
            <Text style={styles.filename2}>Text 1 </Text>
            <Highlighter
              placeholder="Text số 1"
              scrollEnabled={true}
              textAlignVertical='top'
              highlightStyle={{ backgroundColor: 'red' }}
              searchWords={[""]}
              textToHighlight={fileData3}
              multiline={true}
              numberOfLines={10}
              style={styles.textBox}
              editable={false}
            />

            <Text>{"\n"}</Text>

            <Text style={styles.filename2}>Text 2 </Text>
            <Highlighter
              placeholder="Text số 2"
              scrollEnabled={true}
              textAlignVertical='top'
              highlightStyle={{ backgroundColor: 'red' }}
              searchWords={lstDiff2}
              textToHighlight={fileData4}
              multiline={true}
              numberOfLines={10}
              style={styles.textBox}
              editable={false}
            />
            <Text>{"\n"}</Text>

          </SafeAreaView>

          <StatusBar style="auto" />
        </ImageBackground>
      </ScrollView>
    );
  }
  // const ClickHistoryButton = () => {
  //   const [clickHistory, setClickHistory] = useState([]);
  //   const handleClick = () => { setClickHistory([...clickHistory, new Date().toISOString()]); };
  //   return (<button onPress={handleClick}> {clickHistory.length > 0 ? `Clicked ${clickHistory.length} times` : 'Click me'} </button>);
  // };
  function HistoryScreen({ navigation }) {
    return (
      <ScrollView style={styles.container}>
        <Text>{"\n"}</Text>
        <Button title="Go back" color="#d62828" onPress={() => navigation.goBack()} />
        <View style={styles.fixToText}>
          <TextInput
            scrollEnabled={true}
            textAlignVertical='top'
            highlightStyle={{ backgroundColor: 'yellow' }}
            multiline={true}
            numberOfLines={1000}
            style={styles.textBox}
            editable={false}
          />
          <TextInput
            scrollEnabled={true}
            textAlignVertical='top'
            highlightStyle={{ backgroundColor: 'yellow' }}
            multiline={true}
            numberOfLines={1000}
            style={styles.textBox}
            editable={false}
          />
        </View>
      </ScrollView>
    );
  }

  function MyStack() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        
        <Stack.Screen
          name="Text Compare App"
          component={HomeScreen}
          screenOption={{ animationEnabled: true, animationTypeForReplace: 'pop' }}
        />


        <Stack.Screen
          name="Main"
          component={MainScreen}
          screenOption={{ animationEnabled: true, animationTypeForReplace: 'pop' }}
        />


        <Stack.Screen
          name="History"
          component={HistoryScreen}
          screenOption={{ animationEnabled: true, animationTypeForReplace: 'pop' }}
        />
      </Stack.Navigator>
    );
  }

  ////////########## CHẠY #########//////////////
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

/////########## EXPORT #########//////////////
export default App;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title1: {
    flex: 0.1,
    fontSize: 32,
    color: 'black',
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  normal: {
    flex: 0.1,
    fontSize: 25,
    color: 'black',
    textAlign: 'left',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  filename2: {
    flex: 0.1,
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  unnormal: {
    flex: 0.1,
    fontSize: 20,
    color: 'black',
    textAlign: 'left',
    justifyContent: 'center',
    fontStyle: 'italic'
  },
  title2: {
    flex: 0.5,
    fontSize: 32,
    color: 'black',
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  filename: {
    flex: 0.1,
    fontSize: 15,
    color: 'black',
    textAlign: 'left',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  innerContainer: {
    // flex: 1,  
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

  },
  textStyle: {
    width: "75%",
    backgroundColor: "white",
    fontSize: 20,
    borderWidth: 0.5,
    borderRadius: 10,
    //ScrollView: true,
    //multiline:true
  },
  textStyle2: {
    width: "75%",
    backgroundColor: "white",
    fontSize: 8,
    fontStyle: 'italic',
    borderWidth: 0.5,
    borderRadius: 10,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: "100%",
  },
  fixToText2: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: "100%"
  },
  textBox: {
    padding: 1,
    flex: 1,
    backgroundColor: "white",
    fontSize: 20,
    borderWidth: 0.5,
    borderRadius: 10,
    fontWeight: 'bold',
    //ScrollView: true,
  },
  container1: {
    flex: 1,
    backgroundColor: '#6b9080',
    flexDirection: 'column',
  },
  container2: {
    flex: 1,
    backgroundColor: '#6b9080',
    flexDirection: 'column',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 128,
    height: 56,
  },
  title: {
    color: '#f7c744',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 0,
    opacity: 0.9
  },
  infoContainer: {
    //position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 200,
    padding: 20,
    //backgroundColor: 'red'
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#FFF',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderRadius: 10,
  },
  buttonContainer: {
    //backgroundColor: '#f7c744',
    paddingVertical: 2,
    flex:0.5
  },
  buttonText: {
    textAlign: 'center',
    color: 'rgb(32, 53, 70)',
    fontWeight: 'bold',
    fontSize: 18
  },
  title3: {
    flex: 0.5,
    fontSize: 32,
    color: 'yellow',
    textAlign: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 0,
  },
});
