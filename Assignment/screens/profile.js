import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

class Profile extends Component{
  static navigationOptions = {
    header: null
  };

  render(){
    return (
        <View style={styles.container}>
          <Text style={styles.text}>About</Text>
		  <TouchableOpacity
		    style={styles.buttonContainer}
            onPress={() => this.props.navigation.goBack()}>
			<Text style={styles.buttonText}>Go to Home</Text>
		  </TouchableOpacity>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'violet'
  },
  text: {
    color: 'white',
    fontSize: 25
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

export default Profile;
