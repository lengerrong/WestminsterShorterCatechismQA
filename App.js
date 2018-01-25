import React, { Component } from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { getLanguages } from 'react-native-i18n'

import I18n from './app/i18n/i18n'

const NORMAL_MODE = 0;
const MEMORY_MODE = 1;
const PLAY_MODE = 2;

export default class App extends Component<{}> {
  

  constructor(props) {
    super(props);
    this.splashImg = require('./res/img/Catechism-words.png');
    this.state = { isLoadingWCS : true, contentMode : NORMAL_MODE, index : 0 }
    getLanguages().then(languages => {
      console.log(languages);
      if (languages[0].indexOf('zh') != -1)
	    this.wcs = require('./wcs.zh.json');
      else
        this.wcs = require('./wcs.en.json');
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

  contentRender() {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.q}>
          <Text style={styles.tq}>
            {this.wcs[this.state.index].Q}
          </Text>
        </View>
        <View style={styles.a}>
          <Text style={styles.ta}>
            {this.wcs[this.state.index].A}
          </Text>
        </View>
      </View>
    )
  }

  showOption() {
    let newIndex = this.state.index + 1;
    if (newIndex >= this.wcs.length)
      newIndex = 0;
    this.setState({index:newIndex});
  }

  render() {
    if ( this.state.isLoadingWCS ) {
      return this.splashScreenRender();
    } else {
	  return (
		<View style={styles.container}>
          <View style={styles.header}>
			<Text style={styles.title}>
              {I18n.t('wcsqa')}
            </Text>
            <TouchableOpacity onPress={() => {this.showOption()}}>
              <Image
                style={styles.option}
                source={require('./res/img/nav_icon.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            {this.contentRender()}
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
    flex: 2,
  },
  header: {
    backgroundColor: '#00FF7F',
    flex: 1,
	flexDirection: 'row',
    alignItems: 'center',
  	justifyContent: 'space-around',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  option: {
    width:32,
    height:32
  },
  content: {
    backgroundColor: '#F5DEB3',
    flex: 12
  },
  contentContainer: {
    flex: 1,
  	justifyContent: 'flex-start'
  },
  q: {
    alignItems: 'center',
  	justifyContent: 'center',
    backgroundColor: '#EE82EE',
    margin: 10,
    borderRadius: 10
  },
  a: {
  	justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#48D1CC',
    margin: 10,
    borderRadius: 10
  },
  tq: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10
  },
  ta: {
    margin: 10,
    fontSize: 20,
    fontWeight: 'bold'
  }
});
