import React from 'react'
import { firebaseAuth } from '../firebase'
import { withRouter } from "react-router-dom";

const AuthContext = React.createContext()

class AuthProvider extends React.Component {
  state = {
    user: {},
    authMessage: '',
  }

  componentWillMount() {
    firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: {
            id: user.uid,
            email: user.email
          }
        })
      } else {
        this.setState({
          user: {}
        })
      }
    })
  }

  logIn = async (email, password, e) => {
    try {
      e.preventDefault()
      await firebaseAuth.signInWithEmailAndPassword(
        email,
        password
      )
      this.props.history.push(`/${this.state.user.id}/boards`)
    }
    catch (error) {
      this.setState({
        authMessage: error.message
      })
    }
  }

  signUp = async (email, password, e) => {
    try {
      e.preventDefault()
      await firebaseAuth.createUserWithEmailAndPassword(
        email,
        password)
      this.props.history.push(`/${this.state.user.id}/boards`)
    }
    catch (error) {
      this.setState({
        authMessage: error.message
      })
    }
  }

  logOut = () => {
    try {
      firebaseAuth.signOut()
      this.setState({
        user: {}
      })
      this.props.history.push('/')
    }
    catch (error) {
      this.setState({
        authMessage: error.message
      })
    };
  }

  render() {
    return (
      <AuthContext.Provider
        value={{
          user: this.state.user,
          logIn: this.logIn,
          signUp: this.signUp,
          logOut: this.logOut,
          authMessage: this.state.authMessage
        }}
      >
        {this.props.children}
      </AuthContext.Provider>
    )
  }
}

const AuthConsumer = AuthContext.Consumer

export default withRouter(AuthProvider)
export { AuthConsumer }

