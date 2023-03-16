import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

import * as EmailValidator from 'email-validator';

export default class SignUp extends Component {

    constructor(props){
        super(props);

        this.state = {
            first_name: "",
            last_name: "",
            email: "",
            password: "",
            error: "", 
            submitted: false
        }

        this._onPressButton = this._onPressButton.bind(this)
    }

    _onPressButton(){
        this.setState({submitted: true})
      
        if(!(this.state.first_name.trim() && this.state.last_name.trim() && this.state.email.trim() && this.state.password.trim())){
          this.setState({error: "Must fill in fields!"})
          return;
        }
      
        if(!EmailValidator.validate(this.state.email)){
          this.setState({error: "Must enter valid email"})
          return;
        }
      
        const PASSWORD_REGEX = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
        if(!PASSWORD_REGEX.test(this.state.password)){
          this.setState({error: "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)"})
          return;
        }
      
        const new_item = {
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email: this.state.email,
          password: this.state.password
        };
      
        fetch('http://127.0.0.1:3333/api/1.0.0/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(new_item)
        })
        .then(response => response.json())
        .then(data => {
          console.log('API response:', data);
        })
        .catch(error => {
          console.error('API error:', error);
        });
      
        console.log("Button clicked: " + this.state.first_name + " " + this.state.last_name + " " + this.state.email + " " + this.state.password)
        console.log("Validated and ready to send to the API")
      }
      

    render(){
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.box}>

                <View style={styles.formContainer}>
                    <View style={styles.email}>
                        <Text>First Name:</Text>
                        <TextInput
                            style={{height: 40, borderWidth: 1, width: "100%", backgroundColor: "white", borderRadius: 5, borderColor: "grey"}}
                            placeholder="Enter First Name"
                            onChangeText={first_name => this.setState({first_name})}
                            defaultValue={this.state.first_name}
                        />

                        <>
                            {this.state.submitted && !this.state.first_name &&
                                <Text style={styles.error}>*first name is required</Text>
                            }
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
                            {this.state.submitted && !this.state.last_name &&
                                <Text style={styles.error}>*Last Name is required</Text>
                            }
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
                            {this.state.submitted && !this.state.email &&
                                <Text style={styles.error}>*Email is required</Text>
                            }
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
                            {this.state.submitted && !this.state.password &&
                                <Text style={styles.error}>*Password is required</Text>
                            }
                        </>
                    </View>
            
                    <View style={styles.signupBtn}>
                        <TouchableOpacity onPress={this._onPressButton}>
                            <View style={[styles.button,{width: "100%", height: "100%"}]}>
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <>
                        {this.state.error &&
                            <Text style={styles.error}>{this.state.error}</Text>
                        }
                    </>
                </View>
            </View>
        </ScrollView>
            
        )
    }

}

const styles = StyleSheet.create({
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