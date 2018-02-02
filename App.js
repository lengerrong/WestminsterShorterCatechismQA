import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import ReactNativeLanguages from 'react-native-languages';
import I18n from './app/i18n/i18n'

const NORMAL_MODE = 0;
const MEMORY_MODE = 1;
const PLAY_MODE = 2;

function modeID(mode) {
  if (mode == NORMAL_MODE)
    return "normalmode";
  else if (mode == MEMORY_MODE)
    return "memorymode";
  else
    return "playmode";
}

export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.splashImg = require('./res/img/Catechism-words.png');
    this.state = { isLoadingWCS : true, contentMode : NORMAL_MODE, index : 0, modalVisible : false }

    ReactNativeLanguages.addEventListener('change', ({ language }) => {
      I18n.locale = language;
      this.loadWCS(language);
    });

    this.loadWCS(ReactNativeLanguages.language);
  }

  loadWCS(language) {
    this.splashTimer =
      setTimeout(() => {
        this.setState({isLoadingWCS : false});
      }, 2000);
    this.setState({isLoadingWCS : true});
    if (language.indexOf('zh') != -1)
      this.wcs = require('./wcs.zh.json');
    else
      this.wcs = require('./wcs.en.json');
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

  closeModal() {
    this.setState({modalVisible:false});
  }
  
  setIndex(index) {
    console.log("index " + index);
    index -= 1;
    if (this.state.index != index)
      this.state.index = index;
    this.setState({modalVisible:false});
  }

  genList(index, l) {
    let cl = [];
    for (var i = 0; i < 5; i++) {
      if (index > l)
        break;
      let ni = index;
      cl.push(<TouchableOpacity style={styles.listTextContainer} onPress={() => {this.setIndex(ni)}}>
         <Text style={styles.listText}>
           {index}
         </Text>
       </TouchableOpacity>);
      index += 1;
    }
    return cl;
  }

  genAllQAList() {
    let l = this.wcs.length;
    let index = 1;
    let list = [];
    while (1) {
      if (index > l)
        break;
      let cl = this.genList(index, l);
      if (cl.length > 0) {
        list.push(<View style={styles.listColumn}>
          {cl}
        </View>);
        index += cl.length;
      }
    }
    return list;
  }

  normalRender() {
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
        <ScrollView contentContainerStyle={styles.s}>
          <Text style={styles.ts}>
            {this.getS(this.state.index)}
          </Text>
        </ScrollView>
        <View style={styles.ad}>
        </View>
        <Modal
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => this.closeModal()}
          >
          <ScrollView contentContainerStyle={styles.list}>
            {this.genAllQAList()}
          </ScrollView>
        </Modal>
      </View>
    )
  }

  memoryRender() {
    return (
      <Text>
        memory render
      </Text>
    )
  }

  playRender() {
    return (
      <Text>
        play render
      </Text>
    )
  }

  getS(index) {
    return this.wcs[index].S.toString();
  }

  contentRender() {
    if (this.state.contentMode == NORMAL_MODE)
      return this.normalRender();
    else if (this.state.contentMode == MEMORY_MODE)
      return this.memoryRender();
    else
      return this.playRender();
  }

  optionRender() {
    if (this.state.isShowOption) {
      let modelist = [];
      if (this.state.contentMode == NORMAL_MODE) {
        modelist.push(MEMORY_MODE);
        modelist.push(PLAY_MODE);
      } else if (this.state.contentMode == MEMORY_MODE) {
        modelist.push(NORMAL_MODE);
        modelist.push(PLAY_MODE);
      } else {
        modelist.push(NORMAL_MODE);
        modelist.push(MEMORY_MODE);
      }
      return (
        <View style={styles.optionContainer}>
          <TouchableOpacity onPress={() => {this.setMode(modelist[0])}}>
            <Text style={styles.optionText}>
              {I18n.t(modeID(modelist[0]))}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {this.setMode(modelist[1])}}>
            <Text style={styles.optionText}>
              {I18n.t(modeID(modelist[1]))}
            </Text>
          </TouchableOpacity>
          {this.state.contentMode == NORMAL_MODE && (
          <TouchableOpacity onPress={() => {this.listAllQA()}}>
            <Text style={styles.optionText}>
              {I18n.t('qaindex')}
            </Text>
          </TouchableOpacity>)}
        </View>
      )
    } else {
      return null;
    }
  }

  listAllQA() {
    this.setState({isShowOption:false, modalVisible: true});
  }

  setMode(mode) {
    this.setState({isShowOption:false});
    this.setState({contentMode:mode});
  }

  showOption() {
    this.setState({isShowOption:!this.state.isShowOption});
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
          {this.optionRender()}
          <View style={styles.content}>
            {this.contentRender()}
          </View>
        </View>
	  )
    }
  }
}

var {wh, ww} = Dimensions.get('window');

console.log("(" + ww + ", " + wh + ")");

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
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
  s: {
  	justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0FFFF',
    margin: 10
  },
  ad: {
  	justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    margin: 10,
    borderRadius: 10,
    height: 100,
    alignSelf: 'flex-end'
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
  },
  ts: {
    margin: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
  optionContainer: {
    backgroundColor: '#808000'
  },
  optionText: {
    margin: 10,
    fontSize: 20,
    fontWeight: 'bold'
  },
  list: {
  	justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  listColumn: {
	flexDirection: 'row',
  	justifyContent: 'space-between',
    alignItems: 'center'
  },
  listTextContainer: {
    borderColor: '#808080',
  	justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    width: 64,
    height: 64,
    backgroundColor: '#FFFAF0'
  },
  listText: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});
