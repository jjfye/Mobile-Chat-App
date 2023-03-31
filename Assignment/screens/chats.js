import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { Component } from 'react';
import { ScrollView } from 'react-native-web';


class Chats extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      chats: [],
      chatData: null,
    };
  }

  static navigationOptions = {
    header: null,
  };

  //fetches for the list of chat data
  fetchChats = () => {
    if (!this.props.token) {
      console.log('Token is missing!');
      return;
    }
  
    this.setState({ isLoading: true });
    console.log('Headers:', {
      'X-Authorization': this.props.token,
    });
    fetch('http://127.0.0.1:3333/api/1.0.0/chat', {
      headers: {
        'X-Authorization': this.props.token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          chats: responseJson,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  componentDidMount() {
    this.fetchChats();
  }

  _onPressButton = (chatId) => {
    if (!chatId) {
      console.log('Chat ID is missing!');
      return;
    }
  
    fetch(`http://127.0.0.1:3333/api/1.0.0/chat/${chatId}`, {
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
          chatData: responseJson,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <FlatList
              data={this.state.chats}
              renderItem={({ item }) => (
                <View style={styles.chatContainer}>
                  <TouchableOpacity
                    style={styles.btnContainer}
                    onPress={() => this._onPressButton(item.chat_id)}>
                    <Text style={styles.chatName}>{item.name}</Text>
                    <Text style={styles.chatCreator}>
                      Created by: {item.creator.first_name} {item.creator.last_name}
                    </Text>
                    <Text style={styles.chatMessage}>
                      Last message: {item.last_message.message}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.chat_id.toString()}
            />
            {this.state.chatData && (
              <ScrollView>
              <View style={styles.chatDataContainer}>
                <Text style={styles.chatDataTitle}>{this.state.chatData.name}</Text>
                <Text style={styles.chatDataCreator}>
                  Admin: {this.state.chatData.creator.first_name} {this.state.chatData.creator.last_name}
                </Text>
                <Text style={styles.chatDataMembersTitle}>Members</Text>
                <FlatList
                  data={this.state.chatData.members}
                  renderItem={({ item }) => (
                    <Text style={styles.chatDataMember}>{item.first_name} {item.last_name}</Text>
                  )}
                  keyExtractor={(item) => item.user_id.toString()}
                />
                <Text style={styles.chatDataMessagesTitle}>Chat</Text>
                <FlatList
                  data={this.state.chatData.messages.reverse()}
                  renderItem={({ item }) => (
                    <View style={styles.chatDataMessageContainer}>
                      <Text style={styles.chatDataMessage}>{item.author.first_name} {item.author.last_name}: {item.message}</Text>
                    </View>
                  )}
                  keyExtractor={(item) => item.message_id.toString()}
                />
              </View>
              </ScrollView>
            )}
          </>
        )}
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
  chatContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  chatCreator: {
    fontStyle: 'italic',
    marginTop: 5,
  },
  chatMessage: {
    marginTop: 5,
  },
  chatDataContainer: {
    width: 360,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  chatDataCreator: {
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  chatDataTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 5,
  },
  chatDataMembersTitle: {
    fontWeight: 'bold',
    fontSize: 16
  },
  chatDataMember: {
    fontStyle: 'italic',
    marginBottom: 2,
  },
  chatDataMessagesTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  chatDataMessageContainer:{
    marginBottom: 5,
  },
  chatDataMessage: {
    fontSize: 14,
  },
});


export default Chats;