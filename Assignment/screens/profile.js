import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import * as EmailValidator from 'email-validator';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';

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
        submitted: false,
        profile_image: null,

    }
    this._onUpdateInfo =this._onUpdateInfo.bind(this);
  }

  async componentDidMount() {
    const profile_image = await this._getProfilePicture(this.state.user_id);
    this.setState({ profile_image });
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

  _uploadProfilePicture = async (user_id) => {
    try {
      const image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,

      });
      if (image && !image.canceled) {
    
        const selectedImage = image.assets[0];
        const fileExtension = selectedImage.uri.split('.').pop();
        const contentType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
        const blob = await (await fetch(selectedImage.uri)).blob();
        const response = await fetch(`http://127.0.0.1:3333/api/1.0.0/user/${user_id}/photo`, {
          method: 'POST',
          headers: {
            'Content-Type': contentType,
            'X-Authorization': this.props.token,

          },
          body: blob,

        });

        this.setState({ profile_image: selectedImage.uri });
  
        if (response.ok) {
          console.log('Successfully uploaded photo for user:', response);
          this.setState({ profile_image: selectedImage.uri });
          return true;
          
        } else {
          console.log('Failed to upload photo for user with ID:', user_id);
          const responseText = await response.text();
          console.error("Error response:", response);
          console.error("Response text:", responseText);
          return false;

        }
      } else {
        console.log('Cancelled image picker');
        return false;
      }

    } catch (error) {
      console.error('API error:', error);
      return false;
      
    }

  };

  render(){
    return (
      <>
      <View style={{backgroundColor: 'lightblue', flex: 1, padding: 30}}>
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        {this.state.profile_image ? (
          <Image
            source={{ uri: this.state.profile_image }}
            style={{ width: 100, height: 100 }}
          />
        ) : (
          <Text>Insert image to update profile picture</Text>
        )}
        <View style={[styles.btnContainer]}>
        <TouchableOpacity onPress={() => this._uploadProfilePicture(this.state.user_id)}>
          <Text style={styles.buttonText}>Upload Profile Picture</Text>
        </TouchableOpacity>
        </View>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 50  }}>
            <View style={styles.formContainer}>
              <View style={styles.email}>
                <View style={styles.user_id}>
                  <Text>User ID:</Text>
                  <TextInput
                    style={{ height: 40, borderWidth: 1, width: "100%", backgroundColor: "white", borderRadius: 5, borderColor: "grey" }}
                    placeholder="Enter User ID"
                    onChangeText={user_id => this.setState({ user_id })}
                    defaultValue={this.state.user_id} />
                  <>
                    {this.state.submitted && !this.state.user_id &&
                      <Text style={styles.error}>*User ID is required</Text>}
                  </>
                </View>

                <Text>First Name:</Text>
                <TextInput
                  style={{ height: 40, borderWidth: 1, width: "100%", backgroundColor: "white", borderRadius: 5, borderColor: "grey" }}
                  placeholder="Enter First Name"
                  onChangeText={first_name => this.setState({ first_name })}
                  defaultValue={this.state.first_name} />

                <>
                </>
              </View>
              <View style={styles.last_name}>
                <Text>Last Name:</Text>
                <TextInput
                  style={{ height: 40, borderWidth: 1, width: "100%", backgroundColor: "white", borderRadius: 5, borderColor: "grey" }}
                  placeholder="Enter Last Name"
                  onChangeText={last_name => this.setState({ last_name })}
                  defaultValue={this.state.last_name} />
                <>
                </>
              </View>
              <View style={styles.email}>
                <Text>Email:</Text>
                <TextInput
                  style={{ height: 40, borderWidth: 1, width: "100%", backgroundColor: "white", borderRadius: 5, borderColor: "grey" }}
                  placeholder="Enter email"
                  onChangeText={email => this.setState({ email })}
                  defaultValue={this.state.email} />
                <>
                </>
              </View>
              <View style={styles.password}>
                <Text>Password:</Text>
                <TextInput
                  style={{ height: 40, borderWidth: 1, width: "100%", backgroundColor: "white", borderRadius: 5, borderColor: "grey" }}
                  placeholder="Enter password"
                  onChangeText={password => this.setState({ password })}
                  defaultValue={this.state.password}
                  secureTextEntry />
                <>
                </>
              </View>

              <View style={styles.updateBtn}>
                <TouchableOpacity onPress={this._onUpdateInfo}>
                  <View style={[styles.button, { width: "100%" }]}>
                    <Text style={styles.buttonText}>Update</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity
                  style={[styles.btnContainer, {width:"100%"}]}
                  onPress={this._onLogOutButton}>
                  <Text style={styles.buttonText}>log out</Text>
                </TouchableOpacity>
              </View>

              <>

              </>
            </View>
          </View>
          </View>
          </> 
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
    width: "50%",
    borderRadius: 10,
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
  updateBtn:{
      alignSelf: 'center',
      alignContent: 'center',
      backgroundColor: 'teal',
      borderRadius: 20,
      borderWidth: 1.3,
      borderColor: "grey",
      marginBottom: 30
      
  },
  signup:{
    justifyContent: "center",
    textDecorationLine: "underline"
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
