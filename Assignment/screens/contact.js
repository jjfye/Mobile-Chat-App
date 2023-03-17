import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';

class Contact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      contacts: [],
    };
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    fetch('http://127.0.0.1:3333/api/1.0.0/contacts', {
      headers: {
        'X-Authorization': this.props.token
      }
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          contacts: responseJson.contacts,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.contacts}
          renderItem={({ item }) => (
            <View style={{ padding: 10 }}>
              <Text>ID: {item.id}</Text>
              <Text>First Name: {item.first_name}</Text>
              <Text>Last Name: {item.last_name}</Text>
              <Text>Email: {item.email}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'steelblue',
  },
  text: {
    color: 'white',
    fontSize: 25,
  },
  buttonContainer: {
    backgroundColor: '#222',
    borderRadius: 5,
    padding: 10,
    margin: 20,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
});

export default Contact;
