import { Text, View } from 'react-native'
import React, { Component } from 'react'
import {Button} from 'native-base'

export default class Test extends Component {
  render() {
    return (
      <View>
      <Button onPress={() => console.log("hello world")}>Click Me</Button>
      </View>
    )
  }
}