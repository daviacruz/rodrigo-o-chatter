import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';
import {Dialogflow_V2} from 'react-native-dialogflow';

import {dialogflowConfig} from './env';

const BOT_USER = {
  _id: 2,
  name: 'FAQ Bot',
  avatar:
    'https://cdn.discordapp.com/attachments/727479740050571294/764150873038389288/Nimbel.png',
};

const App = () => {
  const [messages, setMessages] = useState([
    {
      _id: 1,
      text:
        'Hi! I am the FAQ bot 🤖 from Nimbel.\n\nHow may I help you with today?',
      createdAt: new Date(),
      user: BOT_USER,
    },
  ]);

  const sendBotResponse = (text) => {
    const msg = {
      _id: messages.lenght + 1,
      text,
      createdAt: new Date(),
      user: BOT_USER,
    };

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, [msg]),
    );
  };

  const handleGoogleResponse = (result) => {
    sendBotResponse(result.queryResult.fulfillmentMessages[0].text.text[0]);
  };

  const onSend = (newMessages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages),
    );

    const message = newMessages[0].text;
    Dialogflow_V2.requestQuery(
      message,
      (result) => handleGoogleResponse(result),
      (error) => console.log(error),
    );
  };

  useEffect(() => {
    Dialogflow_V2.setConfiguration(
      dialogflowConfig.client_email,
      dialogflowConfig.private_key,
      Dialogflow_V2.LANG_ENGLISH_US,
      dialogflowConfig.project_id,
    );
  }, []);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => onSend(newMessages)}
        user={{
          _id: 1,
        }}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
