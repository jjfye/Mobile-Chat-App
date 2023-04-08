import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Linking } from 'react-native';

import * as EmailValidator from 'email-validator';

export default class LoginScreen extends Component {

    constructor(props){
        super(props);
    
        this.state = {
            email: "",
            password: "",
            error: "", 
            submitted: false
        }
    
        this._onPressButton = this._onPressButton.bind(this)
    }
    
    _onPressButton(){
        this.setState({submitted: true})
    
        if(!(this.state.email && this.state.password)){
            this.setState({error: "Must enter email and password"})
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
    
        fetch('http://127.0.0.1:3333/api/1.0.0/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('API response:', data);
            // Handle the response from the API server
            if(data.token) {
                this.props.onLogin(data.token);
            } else {
                this.setState({ error: "Invalid email or password" });
            }
        })
        .catch(error => {
            console.error('API error:', error);
            // Handle the error from the API server
            this.setState({ error: "Please try again" });
        });
    
        console.log("Button clicked: " + this.state.email + " " + this.state.password)
        console.log("Validated and ready to send to the API")
    }
    
    _onSignUpPressed() {
        this.props.navigation.navigate('SignUp');
    }
    

    render(){
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.box}>

                <View style={styles.formContainer}>
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
            
                    <View style={styles.loginbtn}>
                        <TouchableOpacity onPress={this._onPressButton}>
                            <View style={[styles.button,{width: "100%", height: "100%"}]}>
                                <Text style={styles.buttonText}>Login</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <>
                        {this.state.error &&
                            <Text style={styles.error}>{this.state.error}</Text>
                        }
                    </>
            
                    <View>
                    <TouchableOpacity onPress={() => this._onSignUpPressed()}>
                        <Text style={styles.signup}>Need an account?</Text>
                    </TouchableOpacity>
                    </View>
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
    loginbtn:{
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