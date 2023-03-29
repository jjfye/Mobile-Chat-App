import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

class Profile extends Component{
  static navigationOptions = {
    header: null
  };

  _onLogOutButton = () => {
    fetch('http://127.0.0.1:3333/api/1.0.0/logout', {
      method: 'POST',
      headers: {
        'X-Authorization': this.props.token
      }
    })
    .then(response => {
      console.log('API response:', response);
      navigation.navigate('Login');
    })
    .catch(error => {
      console.error('API error:', error);
      // Handle the error from the API server
      this.setState({ error: "Please try again" });
    });
  }

  render(){
    return (
      <View style={{ flexDirection: "row", justifyContent: "center"}}>
        <TouchableOpacity
          style={[styles.btnContainer]}
          onPress={this._onLogOutButton}>
          <Text style={styles.buttonText}>log out</Text>
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
  btnContainer: {
    alignSelf: 'center',
    alignContent: 'center',
    backgroundColor: '#222',
    width: "37%",
    borderRadius: 10,
    padding: 12,
    margin: 20,
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
