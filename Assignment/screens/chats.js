import { StyleSheet, View, Text, Button,TouchableOpacity } from 'react-native';
import React, { Component } from 'react';


class Chats extends Component{
  static navigationOptions = {
    header: null
  };

  render(){
    const navigation = this.props.navigation;

    return(
        <View style={styles.container}>
          <Text style={styles.text}>Chats</Text>
		  <TouchableOpacity
		    style={styles.buttonContainer}
            onPress={() => this.props.navigation.navigate('About')}>
			<Text style={styles.buttonText}>Go to About Me</Text>
		  </TouchableOpacity>
		  <TouchableOpacity
		    style={styles.buttonContainer}
            onPress={() => this.props.navigation.navigate('Contact')}>
			<Text style={styles.buttonText}>Go to my Contact</Text>
		  </TouchableOpacity>
		  
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ebebeb'
  },
  text: {
    color: '#101010',
    fontSize: 24,
    fontWeight: 'bold'
  },
  buttonContainer: {
    backgroundColor: '#222',
    borderRadius: 5,
    padding: 10,
    margin: 20
  },
  buttonText: {
    fontSize: 20,
    color: '#fff'
  }
});

export default Chats;