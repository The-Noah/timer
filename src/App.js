/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from "react";
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Picker,
  Platform
} from "react-native";
import {Alert} from "react-native";

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#07121B",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    width: screen.width / 2,
    height: screen.width / 2,
    marginTop: 48,
    borderWidth: 10,
    borderColor: "#89AAFF",
    borderRadius: screen.width / 2,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonStop: {
    borderColor: "#FF851B"
  },
  buttonText: {
    fontSize: 45,
    color: "#89AAFF"
  },
  buttonTextStop: {
    color: "#FF851B"
  },
  timerText: {
    height: 100,
    color: "#FFF",
    fontSize: 90
  },
  picker: {
    width: 40,
    ...Platform.select({
      android: {
        marginLeft: 10,
        backgroundColor: "#07121B",
        color: "#FFF"
      }
    })
  },
  pickerItem: {
    marginRight: 10,
    color: "#FFF",
    fontSize: 20
  },
  pickerContainer: {
    height: 100,
    flexDirection: "row",
    alignItems: "center"
  }
});

/**
 * 
 * @param {number} number
 */
const formatNumber = (number) => `0${number}`.slice(-2);

/**
 * 
 * @param {number} time
 */
const getRemaining = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  return {minutes: formatNumber(minutes), seconds: formatNumber(seconds)};
};

const createArray = (length) => {
  const arr = [];
  let i = 0;
  while(i < length){
    arr.push(i.toString());
    i++;
  }

  return arr;
}

const AVAILABLE_MINUTES = createArray(10);
const AVAILABLE_SECONDS = createArray(60);

export default class App extends React.Component{
  state = {
    remainingSeconds: 5,
    isRunning: false,
    selectedMinutes: "0",
    selectedSeconds: "5"
  };

  interval = null;

  componentDidUpdate(prevProps, prevState){
    if(this.state.remainingSeconds === 0 && prevState.remainingSecodns !== 0){
      this.stop();
    }
  }

  componentWillUnmount(){
    if(this.interval){
      clearInterval(this.interval);
    }
  }

  start = () => {
    this.setState((state) => ({
      remainingSeconds: parseInt(state.selectedMinutes) * 60 + parseInt(state.selectedSeconds),
      isRunning: true
    }));

    this.interval = setInterval(() => {
      this.setState((state) => ({
        remainingSeconds: state.remainingSeconds - 1
      }));
    }, 1000);
  };

  stop = () => {
    clearInterval(this.interval);
    this.interval = null;
    this.setState({remainingSeconds: 5, isRunning: false});
  };

  renderPickers = () => {
    return <View style={styles.pickerContainer}>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedMinutes}
        onValueChange={(value) =>
          this.setState({selectedMinutes: value})
        }
        mode="dropdown"
      >
        {AVAILABLE_MINUTES.map((value) => <Picker.Item key={value} label={value} value={value}/>)}
      </Picker>
      <Text style={styles.pickerItem}>minutes</Text>
      <Picker
        style={styles.picker}
        itemStyle={styles.pickerItem}
        selectedValue={this.state.selectedSeconds}
        onValueChange={(value) =>
          this.setState({selectedSeconds: value})
        }
        mode="dropdown"
      >
        {AVAILABLE_SECONDS.map((value) => <Picker.Item key={value} label={value} value={value}/>)}
      </Picker>
      <Text style={styles.pickerItem}>seconds</Text>
    </View>;
  }

  render(){
    const {minutes, seconds} = getRemaining(this.state.remainingSeconds);

    return <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#07121B"/>
      {this.state.isRunning ? <>
        <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
        <TouchableOpacity onPress={this.stop} style={[styles.button, styles.buttonStop]}>
          <Text style={[styles.buttonText, styles.buttonTextStop]}>Stop</Text>
        </TouchableOpacity>
      </> : <>
        {this.renderPickers()}
        <TouchableOpacity onPress={this.start} style={styles.button}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </>}
    </View>
  }
};
