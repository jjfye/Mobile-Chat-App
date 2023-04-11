import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import * as EmailValidator from 'email-validator';

class Profile extends Component{
  constructor(props){
    super(props);

    this.state = {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        error: "", 
        user_id: "",
        submitted: false
    }
    this._onUpdateInfo =this._onUpdateInfo.bind(this);
  }

  _onUpdateInfo() {
    this.setState({ submitted: true });
  
    const updated_item = {};
  
    if (this.state.first_name) {
      updated_item.first_name = this.state.first_name;
    }
  
    if (this.state.last_name) {
      updated_item.last_name = this.state.last_name;
    }
  
    if (this.state.email) {
      if (!EmailValidator.validate(this.state.email)) {
        this.setState({ error: "Must enter valid email" });
        return;
      }
      updated_item.email = this.state.email;
    }
  
    if (this.state.password) {
      const PASSWORD_REGEX = new RegExp(
        "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
      );
      if (!PASSWORD_REGEX.test(this.state.password)) {
        this.setState({
          error:
            "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)",
        });
        return;
      }
      updated_item.password = this.state.password;
    }
  
    if (Object.keys(updated_item).length === 0) {
      this.setState({ error: "No fields have been updated" });
      return;
    }
  
    fetch(`http://127.0.0.1:3333/api/1.0.0/user/${this.state.user_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": this.props.token,
      },
      body: JSON.stringify(updated_item),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API response:", data);
        this.setState({
          first_name: '',
          last_name: '',
          password: '',
          email: '',

        });
      })
      .catch((error) => {
        console.error("API error:", error);
      });
  
    console.log(
      "Button clicked: " +
        this.state.first_name +
        " " +
        this.state.last_name +
        " " +
        this.state.email +
        " " +
        this.state.password
    );
    console.log("Validated and ready to send to the API");
  }

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
                <View style={{ flexDirection: "row", justifyContent: "center"}}>
                  <View style={styles.box}>
                    <View style={styles.formContainer}>
                      <View style={styles.email}>                      
                        <View style={styles.user_id}>
                      <Text>User ID:</Text>
                      <TextInput
                          style={{height: 40, borderWidth: 1, width: "100%", backgroundColor: "white", borderRadius: 5, borderColor: "grey"}}
                          placeholder="Enter User ID"
                          onChangeText={user_id => this.setState({user_id})}
                          defaultValue={this.state.user_id}
                      />

                      <>
                          {this.state.submitted && !this.state.user_id &&
                              <Text style={styles.error}>*User ID is required</Text>
                          }
                      </>
                    </View>


                    <Text>First Name:</Text>
                    <TextInput
                        style={{height: 40, borderWidth: 1, width: "100%", backgroundColor: "white", borderRadius: 5, borderColor: "grey"}}
                        placeholder="Enter First Name"
                        onChangeText={first_name => this.setState({first_name})}
                        defaultValue={this.state.first_name}
                    />

                    <>
                    </>
                </View>
                
                <View style={styles.last_name}>
                    <Text>Last Name:</Text>
                    <TextInput
                        style={{height: 40, borderWidth: 1, width: "100%", backgroundColor: "white", borderRadius: 5, borderColor: "grey"}}
                        placeholder="Enter Last Name"
                        onChangeText={last_name => this.setState({last_name})}
                        defaultValue={this.state.last_name}
                    />

                    <>
                    </>
                </View>

                <View style={styles.email}>
                    <Text>Email:</Text>
                    <TextInput
                        style={{height: 40, borderWidth: 1, width: "100%", backgroundColor: "white", borderRadius: 5, borderColor: "grey"}}
                        placeholder="Enter email"
                        onChangeText={email => this.setState({email})}
                        defaultValue={this.state.email}
                    />

                    <>
                    </>
                </View>

                <View style={styles.password}>
                    <Text>Password:</Text>
                    <TextInput
                        style={{height: 40, borderWidth: 1, width: "100%", backgroundColor: "white", borderRadius: 5, borderColor: "grey"}}
                        placeholder="Enter password"
                        onChangeText={password => this.setState({password})}
                        defaultValue={this.state.password}
                        secureTextEntry
                    />

                    <>
                    </>
                </View>

                <View style={styles.signupBtn}>
                    <TouchableOpacity onPress={this._onUpdateInfo}>
                        <View style={[styles.button,{width: "100%", height: "100%"}]}>
                            <Text style={styles.buttonText}>Update</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <>
              
              </>
            </View>
          </View>
        </View>
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
    width: "25%",
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
    textAlign: "center",
    fontSize: 20,
    color: '#fff'
  },
  container: {
    flex: 1,
    width: "100%",
    padding: 100,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'lightblue',
  },
  form: {
      flex: 1,
      justifyContent: 'center',
    },
  input: {
      marginBottom: 10,
      padding: 10,
      backgroundColor: '#ddd',
  },
  box: {
      width: "100%",
      height: "50%",
      padding: 20,
      backgroundColor: "#CAE9F5",
      borderColor: '#F0F8FF',
      borderWidth: 1.5,
      borderRadius: 10,
  },
  formContainer: {
      
  },
  email:{
    marginBottom: 5
  },
  password:{
    marginBottom: 30
  },
  signupBtn:{
      alignSelf: 'center',
      alignContent: 'center',
      backgroundColor: 'teal',
      width: '50%',
      borderRadius: 20,
      borderWidth: 1.3,
      borderColor: "grey",
      marginBottom: 30
      
  },
  signup:{
    justifyContent: "center",
    textDecorationLine: "underline"
  },
  button: {

  },
  buttonText: {
    textAlign: 'center',
    textAlignVertical: 'center',
    alignContent: 'center',
    padding: 15,
    color: 'white'
  },
  error: {
      color: "red",
      fontWeight: '900',
      marginBottom: 5,
  }
});

export default Profile;
