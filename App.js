import React, { Component } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { getLanguages } from 'react-native-i18n'

export default class App extends Component<{}> {
 
  constructor(props) {
    super(props);
    this.state = { isLoadingWCS : true }
    getLanguages().then(languages => {
      if (languages.indexOf('CN') != -1)
	    this.wcs = require('./wcs.cn.json');
      else
        this.wcs = require('./wcs.en.json');
	  //this.setState({isLoadingWCS : false});
	});
  }
 
  splashScreenRender() {
    return (
	  <View style={styles.splashContainer}>
		<Image 
			source={require('./res/img/Catechism-words.png')}>
        </Image>
	  </View>
    )
  }

  render() {
    if ( this.state.isLoadingWCS ) {
      return this.splashScreenRender();
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
             This is question
          </Text>
          <Text style={styles.instructions}>
             This is answer
          </Text>
          <Text style={styles.instructions}>
             This is scripture
          </Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00FF7F'
  }
});
