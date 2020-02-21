import firebase from 'firebase';
import 'firebase/firestore'

const config = {
    apiKey: "AIzaSyCC015ZMKYLdGdyoe30lH6Pp3Yxkdg8imU",
    authDomain: "react-trello-6a33d.firebaseapp.com",
    databaseURL: "https://react-trello-6a33d.firebaseio.com",
    projectId: "react-trello-6a33d",
    storageBucket: "react-trello-6a33d.appspot.com",
    messagingSenderId: "833585539062",
    appId: "1:833585539062:web:492b34fe89bc64684049d7",
    measurementId: "G-Z3DCMK90EY"
}

firebase.initializeApp(config)

const db = firebase.firestore()
const firebaseAuth = firebase.auth()
const boardsRef = db.collection('boards')
const listsRef = db.collection('lists')
const cardsRef = db.collection('cards')

export {boardsRef, listsRef, cardsRef, firebaseAuth }