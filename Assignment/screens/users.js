import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-web';

class Users extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      user_id: '',
      rendered_user_id: '',
      searchQuery: '',
      searchRes: [],
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
    this.setState({ searchRes: [] });
  }

  _searchUsers = () => {
    // Clear user data
    this.setState({
      first_name: '',
      last_name: '',
      email: '',
      rendered_user_id: '',
    });
    const { searchQuery } = this.state;
    const queryParameters = {
      q: searchQuery,
      search_in: 'all',
      limit: 20,
      offset: 0,
    };
  


    const queryString = Object.entries(queryParameters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
  
    fetch(`http://127.0.0.1:3333/api/1.0.0/search?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.props.token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
      })
      .then((responseJson) => {
        console.log(responseJson);
        
        const filteredResults = responseJson.filter(
          (user) => user.user_id && user.given_name && user.family_name && user.email
        );
        
        this.setState({ searchRes: filteredResults });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  
  
  
  _renderSearchResults = () => {
    const { searchRes } = this.state;
  
    if (!searchRes || !Array.isArray(searchRes)) {
      return null;
    }

    return searchRes.map((user, index) => (
      <View key={index} style={styles.resultContainer}>
        <Text>ID: {user.user_id}</Text>
        <Text>First Name: {user.given_name}</Text>
        <Text>Last Name: {user.family_name}</Text>
        <Text>Email: {user.email}</Text>
      </View>
    ));
  };
  
  
  

  render() {
    const { first_name, last_name, email, rendered_user_id} = this.state;
    return (
      <View style={styles.container}>
        <View style = {{borderRadius: 5, borderWidth: 3, borderColor: "white", padding: 10, backgroundColor: "#CAE9F5",}}>
          
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
          
          <TextInput
            style={{ height: 40, borderWidth: 1, width: "100%", backgroundColor: "white", borderRadius: 5, borderColor: "grey", padding: 5}}
            placeholder="Search"
            onChangeText={(text) => this.setState({ searchQuery: text })}
            value={this.state.searchQuery}
          />

          <TouchableOpacity onPress={this._searchUsers}>
            <View style={styles.btnContainer}>
              <Text style={styles.buttonText}>Search Users</Text>
            </View>
          </TouchableOpacity>

        </View>
        
        <ScrollView>
          {rendered_user_id ? (
            <View style={styles.dataContainer}>
              <Text>ID: {rendered_user_id}</Text>
              <Text>First Name: {first_name}</Text>
              <Text>Last Name: {last_name}</Text>
              <Text>Email: {email}</Text>
            </View>
          ) : null}
          <View>
            {this._renderSearchResults()}
          </View>
        </ScrollView>
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
      paddingTop: 50,
      backgroundColor: "lightblue",
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
        borderWidth: 3,
        borderColor: "#CAE9F5",
        borderRadius: 5,
        marginTop: 10,
        backgroundColor: "white",
      },
      resultContainer: {
        marginTop: 10,
        padding: 10,
        borderWidth: 3,
        borderColor: "#CAE9F5",
        backgroundColor: "white",
        borderRadius: 5,
      },
  });

export default Users;
