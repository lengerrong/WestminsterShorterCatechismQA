import React, { Component } from 'react';
import {
  Image,
  ImageBackground,
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
	  this.setState({isLoadingWCS : false});
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
        <ImageBackground
           style={styles.bgimg} 
           source={require('./res/img/wcs.png')}>
          <View style={styles.fgcontainer}>
            <Text style={styles.qa}>
               WCS WCS WCS
            </Text>
          </View>
        </ImageBackground>
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
  },
  bgimg: {
    flex: 1
  },
  fgcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  qa: {
    fontSize: 30,
    fontWeight: 'bold'
  }
});
