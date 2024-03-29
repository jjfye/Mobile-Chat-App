import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';

class Contact extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      contacts: [],
      user_id: '',
      error: '',
      showBlocked: false,
    };
  }

  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    await this.fetchContacts();
  }
  
  fetchContacts = async () => {
    this.setState({ isLoading: true });
    try {
      const response = await fetch('http://127.0.0.1:3333/api/1.0.0/contacts', {
        headers: {
          'X-Authorization': this.props.token,
        },
      });
      const responseJson = await response.json();
      console.log(responseJson);
      const contacts = await Promise.all(
        responseJson.map(async (contact) => {
          const photo = await this._getProfilePicture(contact.user_id);
          return { ...contact, photo };
        })
      );
      this.setState({
        isLoading: false,
        contacts,

      });
    } catch (error) {
      console.error(error);
    }

  };

  //fetches for the list of data in blocked
  fetchBlocked = () => {
    this.setState({ isLoading: true });
  
    // Changes endpoints depending on showBlocked state
    const endpoint = this.state.showBlocked
      ? 'http://127.0.0.1:3333/api/1.0.0/contacts'
      : 'http://127.0.0.1:3333/api/1.0.0/blocked';
  
    fetch(endpoint, {
      headers: {
        'X-Authorization': this.props.token,
      },
    })
      .then((response) => response.json())
      .then(async (responseJson) => {
        console.log(responseJson);
  
        // Fetch profile pictures for the users
        const contacts = await Promise.all(
          responseJson.map(async (contact) => {
            const photo = await this._getProfilePicture(contact.user_id);
            return { ...contact, photo };
          })
        );
  
        this.setState({
          isLoading: false,
          contacts,
          // Toggle showBlocked
          showBlocked: !this.state.showBlocked, 
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

  // Add function - adds in contacts using a given ID
  _onBlockButtonPress = () => {
    const { user_id } = this.state;
  
    // checks if input box is empty
    if (!user_id.trim()) {
      this.setState({ error: 'Must fill in field!' });
      return;
    }

    // Grabs the endpoint and sets it to POST method if input box isn't empty
    fetch(`http://127.0.0.1:3333/api/1.0.0/user/${user_id}/block`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': this.props.token,
      },
    })
      .then((response) => {
        // adds user to contacts if response is true, outputs error if false.
        if (response.ok) {
          console.log('Successfully blocked contact with ID:', user_id);
          this.setState({ user_id: '', error: '' });
          
          // Re-renders the screen by updating it with the updated contacts.
          return this.fetchContacts();
        }else {
          console.log('Failed to block contact with ID:', user_id);
          this.setState({ error: 'Failed to block contact!' });
        }
      })
      .catch((error) => {
        console.error('API error:', error);
        this.setState({ error: 'Failed to block contact!' });
      });
    console.log('block button clicked: ' + user_id);
    console.log('Validated and ready to send to the API');
  };

  _onUnblockButtonPress = () => {
    const { user_id } = this.state;
    if (!user_id.trim()) {
      this.setState({ error: 'Must fill in field!' });
      return;
    }
    fetch(`http://127.0.0.1:3333/api/1.0.0/user/${user_id}/block`, {
      method: 'DELETE',
      headers: {
        'X-Authorization': this.props.token,
      },
    })
      .then((response) => {
        if (response.ok) {
          console.log(`Successfully unblocked contact with ID: ${user_id}`);
          this.setState((prevState) => ({
            contacts: prevState.contacts.filter((c) => c.user_id !== parseInt(user_id)),
            user_id: '',
            error: '',

          }));
        } else {
          console.error(`Failed to unblock contact with ID: ${user_id}`);
          this.setState({ error: 'Failed to unblock contact!' });

        }
      })
      .catch((error) => {
        console.error('API error:', error);
        this.setState({ error: 'Failed to unblock contact!' });
        
      });

  };


  _getProfilePicture = async (user_id) => {
    try {
      const response = await fetch(`http://127.0.0.1:3333/api/1.0.0/user/${user_id}/photo`, {
        method: 'GET',
        headers: {
          'Accept': 'image/jpeg, image/png',
          'X-Authorization': this.props.token,
        },
      });
      if (response.ok) {
        console.log('Successfully got photo:', user_id);
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        return imageUrl;
      } else {
        console.log('Failed to get photo with ID:', user_id);
        return null;
      }
    } catch (error) {
      console.error('API error:', error);
      return null;
    }

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
      <View style={{ flex: 1, backgroundColor: "lightblue"}}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            {this.state.showBlocked ? 'Blocked' : 'Contacts'}
          </Text>
        </View>
        <FlatList data={contacts} renderItem={({ item }) => {
          return (
            <View style={{ padding: 10}}>
              <View style={styles.btnContactsContainer}>
                <View style={{ alignItems: "center",}}>
                  {item.photo && (
                    <Image
                      source={{ uri: item.photo }}
                      style={{ width: 100, height: 100, borderRadius: "50%"}}
                    />
                  )}
                </View>
                <Text>ID: {item.user_id}</Text>
                <Text>First Name: {item.first_name}</Text>
                <Text>Last Name: {item.last_name}</Text>
                <Text>Email: {item.email}</Text>
              </View>
            </View>
          );
        }}
        
        keyExtractor={(item) => item.user_id.toString()}
        />
        <View style={{ borderRadius: 5, borderColor: "white", margin: 40, borderWidth: 3, backgroundColor: "#CAE9F5",}}>
          <View style={{ padding: 10 }}>
            <TextInput
              style={{ height: 40, borderWidth: 1, width: "100%", backgroundColor: "white", borderRadius: 5, borderColor: "grey", padding: 5}}
              onChangeText={(text) => this.setState({ user_id: text })}
              value={user_id}
              placeholder="Enter user ID"
              keyboardType="numeric"
            />
            
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            
            <View style={{ flexDirection: "row", justifyContent: "center"}}>
              <TouchableOpacity
                style={styles.btnContainer}
                onPress={this._onPressButton}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnContainer, { backgroundColor: 'red' }]}
                onPress={this._onDeleteButtonPress}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "center"}}>
              <TouchableOpacity
                style={[styles.btnContainer]}
                onPress={this._onUnblockButtonPress}>
                <Text style={styles.buttonText}>Unblock</Text>
              </TouchableOpacity>
            </View> 
            <View style={{ flexDirection: "row", justifyContent: "center"}}>
              <TouchableOpacity
                style={[styles.btnContainer]}
                onPress={this.fetchBlocked}>
                <Text style={styles.buttonText}>{this.state.showBlocked ? 'Contacts' : 'Blocked'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={[styles.btnContainer, { backgroundColor: 'red' }]}
                  onPress={this._onBlockButtonPress}>
                  <Text style={styles.buttonText}>Block</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* <TouchableOpacity
            style={styles.btnContainer}
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
  btnContainer: {
    alignSelf: 'center',
    alignContent: 'center',
    backgroundColor: '#222',
    width: "37%",
    borderRadius: 10,
    padding: 12,
    margin: 20,
  },
  btnContactsContainer: {
    alignSelf: 'center',
    alignContent: 'center',
    backgroundColor: '#222',
    width: "50%",
    borderRadius: 10,
    backgroundColor: "white",
    borderColor: "#CAE9F5",
    borderWidth: 3,
    padding: 12,
    margin: 5,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    color: '#fff',
  },
  titleContainer: {
    alignItems: 'start',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: 'white',
  },
  titleText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Contact;
