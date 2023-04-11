import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      user_id: '',
      rendered_user_id: '',
    };
    this._onUpdateInfo = this._onUpdateInfo.bind(this);
  }

  _onGetUser = (user_id) => {
    if (!user_id) {
      console.log('User ID is missing!');
      return;
    }

    fetch(`http://127.0.0.1:3333/api/1.0.0/user/${user_id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.props.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          first_name: responseJson.first_name,
          last_name: responseJson.last_name,
          email: responseJson.email,
          rendered_user_id: user_id,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  _onUpdateInfo() {
    this._onGetUser(this.state.user_id);
  }

  render() {
    const { first_name, last_name, email, rendered_user_id} = this.state;
    return (
      <View style={styles.container}>
        <View>
          <TextInput
            style={{ height: 40, borderWidth: 1, width: "100%", backgroundColor: "white", borderRadius: 5, borderColor: "grey", padding: 5}}
            placeholder="User ID"
            onChangeText={(text) => this.setState({ user_id: text })}
            value={this.state.user_id}
          />
          <TouchableOpacity onPress={this._onUpdateInfo}>
            <View style={styles.btnContainer}>
              <Text style={styles.buttonText}>Get User</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.dataContainer}>
          <Text>ID: {rendered_user_id}</Text>
          <Text>First Name: {first_name}</Text>
          <Text>Last Name: {last_name}</Text>
          <Text>Email: {email}</Text>
        </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },
    btnContainer: {
      alignSelf: 'center',
      alignContent: 'center',
      backgroundColor: '#222',
      width: "100%",
      borderRadius: 10,
      padding: 12,
      margin: 5,
    },
    buttonText: {
      textAlign: "center",
      fontSize: 20,
      color: '#fff',
    },
    dataContainer: {
        width: 250,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
      },
  });

export default Users;
