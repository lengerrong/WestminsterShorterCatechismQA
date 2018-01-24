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
    this.splashImg = require('./res/img/Catechism-words.png');
    this.state = { isLoadingWCS : true }
    getLanguages().then(languages => {
      if (languages.indexOf('CN') != -1)
	    this.wcs = require('./wcs.cn.json');
      else
        this.wcs = require('./wcs.cn.json');
      this.splashTimer = 
        setTimeout(() => {
          this.setState({isLoadingWCS : false});
        }, 2000);
	});
  }

  componentWillUnmount() {
    clearTimeout(this.splashTimer);
  }
 
  splashScreenRender() {
    return (
	  <View style={styles.splashContainer}>
		<Image 
			source={this.splashImg}>
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
          <View style={styles.header}>
			<Text>
			  Westminster Shorter Catechism
            </Text>
          </View>
          <View style={styles.content}>
			<Text>
			  Westminster Shorter Catechism
            </Text>
          </View>
        </View>
	  )
    }
  }
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1
  },
  header: {
    backgroundColor: '#00FF7F',
    flex: 1
  },
  content: {
    backgroundColor: '#F5DEB3',
    flex: 13
  }
});
