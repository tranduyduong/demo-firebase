import React from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { StyleSheet, View } from "react-native";
import * as firebase from "firebase";
const firebaseConfig = {
  projectId: "devc-demo",
  databaseURL: "https://devc-demo.firebaseio.com",
  storageBucket: "devc-demo.appspot.com",
  locationId: "us-central",
  apiKey: "AIzaSyBD6KU3aApKnjIQkicj6e0EOwdvDQ-VyRA",
  authDomain: "devc-demo.firebaseapp.com",
  messagingSenderId: "978309730006",
};

firebase.initializeApp(firebaseConfig);

export default function ConversationPage(props) {
  const [messages, setMessages] = React.useState([
    {
      _id: props.navigation.state.params.id,
      text: props.navigation.state.params.last_message_content,
      createdAt: new Date(),
      user: {
        _id: props.navigation.state.params.id,
        name: props.navigation.state.params.first_name,
        avatar: props.navigation.state.params.avatar_url,
      },
    },
  ]);

  React.useEffect(() => {
    firebase
      .database()
      .ref("todos/")
      .on("value", function (snapshot) {
        console.log(snapshot.val());
        const data = snapshot.val();
        const msgs = Object.keys(data).map((key, obj) => data[key])
        console.log('msgs', msgs);
        setMessages(msgs);
      });
    const onChildAdd = firebase
      .database()
      .ref("/todos")
      .on("child_added", (snapshot) => {
        console.log("A new node has been added", snapshot.val());
        // GiftedChat.append(messages, [snapshot.val()]);
        // setMessages(messages.push(snapshot.val()))
      });

    // Stop listening for updates when no longer required
    return () =>
      firebase.database().ref("/todos").off("child_added", onChildAdd);
  }, []);
  const onSend = (message = {}) => {
    console.log("messages", message);
    const msg = {
      _id: new Date().getTime(),
      text: message.text,
      createdAt: new Date(),
      user: {
        _id: 1,
        name: "DuongTD",
        avatar: "https://nguoinoitieng.tv/images/nnt/96/0/bbji.jpg",
      },
    };

    firebase
      .database()
      .ref(`todos/${new Date().getTime()}`)
      .set(msg)
      .then((data) => {
        console.log("data", data);
      })
      .catch((error) => {
        console.log("error", error);
      });
      setMessages([msg, ...messages]);
  };
  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages[0])}
        user={{ _id: 0 }}
      />
    </View>
  );
}

ConversationPage.navigationOptions = {
  title: "Conversation",
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
  },
});
