import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TextInput, TouchableOpacity } from 'react-native';

class Contact extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      contacts: [],
      user_id: '',
      error: '',
    };
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.fetchContacts();
  }

  //fetches for the list of data in contacts
  fetchContacts = () => {
    this.setState({ isLoading: true });
    fetch('http://127.0.0.1:3333/api/1.0.0/contacts', {
      headers: {
        'X-Authorization': this.props.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          contacts: responseJson,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Add function - adds in contacts using a given ID
  _onPressButton = () => {
    const { user_id } = this.state;
  
    // checks if input box is empty
    if (!user_id.trim()) {
      this.setState({ error: 'Must fill in field!' });
      return;
    }

    // Grabs the endpoint and sets it to POST method if input box isn't empty
    fetch(`http://127.0.0.1:3333/api/1.0.0/user/${user_id}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.props.token,
      },
    })
      .then((response) => {
        // adds user to contacts if response is true, outputs error if false.
        if (response.ok) {
          console.log('Successfully added contact with ID:', user_id);
          this.setState({ user_id: '', error: '' });
          // Re-renders the screen by updating it with the updated contacts.
          return this.fetchContacts();
        }else {
          console.log('Failed to add contact with ID:', user_id);
          this.setState({ error: 'Failed to add contact!' });
        }
      })
      .catch((error) => {
        console.error('API error:', error);
        this.setState({ error: 'Failed to add contact!' });
      });
    console.log('Button clicked: ' + user_id);
    console.log('Validated and ready to send to the API');
  };
  
  // Delete function
  _onDeleteButtonPress = () => {
    const { user_id } = this.state;
    if (!user_id.trim()) {
      this.setState({ error: 'Must fill in field!' });
      return;
    }
    fetch(`http://127.0.0.1:3333/api/1.0.0/user/${user_id}/contact`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': this.props.token,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Successfully deleted contact with ID: ${user_id}`);
          this.setState((prevState) => ({
            contacts: prevState.contacts.filter((c) => c.user_id !== parseInt(user_id)),
            user_id: '',
            error: '',
          }));
        } else {
          console.error(`Failed to delete contact with ID: ${user_id}`);
          this.setState({ error: 'Failed to delete contact!' });
        }
      })
      .catch((error) => {
        console.error('API error:', error);
        this.setState({ error: 'Failed to delete contact!' });
      });
  };
  
  render() {
    const { isLoading, contacts, user_id, error } = this.state;
    if (isLoading) {
      return (
        <View style={{ flex: 1, padding: 20 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={contacts}
          renderItem={({ item }) => (
            <View style={{ padding: 10 }}>
              <Text>ID: {item.user_id}</Text>
              <Text>First Name: {item.first_name}</Text>
              <Text>Last Name: {item.last_name}</Text>
              <Text>Email: {item.email}</Text>
            </View>
          )}
          keyExtractor={(item) => item.user_id.toString()}
        />

        <View style={{ padding: 10 }}>
          <TextInput
            style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
            onChangeText={(text) => this.setState({ user_id: text })}
            value={user_id}
            placeholder="Enter user ID"
            keyboardType="numeric"
          />

          {error && <Text style={{ color: 'red' }}>{error}</Text>}

          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this._onPressButton}>
            <Text style={styles.buttonText}>Add User</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonContainer, { backgroundColor: 'red' }]}
            onPress={this._onDeleteButtonPress}>
            <Text style={styles.buttonText}>Delete User</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.buttonContainer}
            onPress={this.fetchContacts}>
            <Text style={styles.buttonText}>Refresh Contacts</Text>
          </TouchableOpacity> */}

        </View>
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
