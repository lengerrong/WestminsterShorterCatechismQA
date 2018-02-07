import React, { Component } from 'react';
import {
  Image,
  Modal,
  PanResponder,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import ReactNativeLanguages from 'react-native-languages';
import I18n from './app/i18n/i18n'

export default class App extends Component<{}> {

  constructor(props) {
    super(props);
    this.splashImg = require('./res/img/Catechism-words.png');
    this.state = { isLoadingWCS : true, index : 0, modalVisible : false }

    ReactNativeLanguages.addEventListener('change', ({ language }) => {
      I18n.locale = language;
      this.loadWCS(language);
    });

    this.loadWCS(ReactNativeLanguages.language);
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => {
        if (this.state.modalVisible)
          return false;
        return true
      },
      onStartShouldSetPanResponderCapture: (evt, gestureState) => {
        if (this.state.modalVisible)
          return false;
        return true
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (this.state.modalVisible)
          return false;
        return true
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        if (this.state.modalVisible)
          return false;
        return true
      },
      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
        if (gestureState.dx > 5 || gestureState.dx < -5) {
          let ni = this.state.index;
          if (gestureState.dx < 0) {
            ni++;
          } else {
            ni--;
          }
          if (ni < 0)
            ni = this.wcs.length - 1;
          if (ni >= this.wcs.length)
            ni = 0;
          this.setState({index:ni});
        }
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    });
  }

  loadWCS(language) {
    this.splashTimer =
      setTimeout(() => {
        this.setState({isLoadingWCS : false});
      }, 1000);
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

  renderAnswer(answer) {
    let ans = [];
    let text = answer;
    let pi = text.indexOf("[");
    while (pi != -1) {
      let pt = text.substring(0, pi);
      text = text.substring(pi+1);
      pi = text.indexOf("]");
      let ht = text.substring(0, pi);
      text = text.substring(pi+1);
      if (pt.length > 0) {
        ans.push(
            <Text style={styles.nfont}>
              {pt}
            </Text>
        );
      }
      if (ht.length > 0) {
        ans.push(
            <Text style={styles.subfont}>
              {ht}
            </Text>
        );
      }
      pi = text.indexOf("[");
    }
    if (text.length > 0) {
      ans.push(
          <Text style={styles.nfont}>
            {text}
          </Text>
      );
    }
    return ans;
  }

  genScripture(S) {
    let s = [];
    let f = 1;
    for (i in S) {
      let st = S[i].T;
      if (!f) {
        st = "; " + st;
      } else {
        f = false;
      }
      s.push(<Text style={styles.sfont}>{st}</Text>);
    }
    return s;
  }

  renderScripture(S) {
    let s = [];
    for (i in S) {
      let st = S[i].T + "    " + S[i].C;
      s.push(<Text style={styles.ssfont}>{st}</Text>)
    }
    return s;
  }

  renderScriptureDetail(S) {
    let s = [];
    let si = 0;
    for (i in S) {
      if (S[i].length) {
        let ss = this.renderScripture(S[i]);
        let st = I18n.t('scripture');
        si = si + 1;
        st = st.replace('index', String(si));
        s.push(<View>
            <View style={styles.sss}>
              <Text style={styles.ssfont}>
                {st}
              </Text>
            </View>
            <View style={styles.ssc}>
              {ss}
            </View>
          </View>)
      }
    }
    return s;
  }

  normalRender() {
    let qs = I18n.t('question');
    qs = qs.replace('index', String(this.state.index+1));
    return (
      <View style={styles.contentContainer} {...this._panResponder.panHandlers}>
        <View style={styles.qas}>
          <View style={styles.qac}>
            <View style={styles.qal}>
              <Text style={styles.bfont}>
                {qs}
              </Text>
            </View>
            <View style={styles.qar}>
              <Text style={styles.bfont}>
                {this.wcs[this.state.index].Q}
              </Text>
            </View>
          </View>
          <View style={styles.qac}>
            <View style={styles.qal}>
              <Text style={styles.bfont}>
                {I18n.t('answer')}
              </Text>
            </View>
            <View style={styles.qar}>
              <Text>
                {this.renderAnswer(this.wcs[this.state.index].A)}
              </Text>
            </View>
          </View>
          <ScrollView contentContainerStyle={styles.s}>
            {this.renderScriptureDetail(this.wcs[this.state.index].S)}
          </ScrollView>
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

  listAllQA() {
    this.setState({modalVisible: true});
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
            <TouchableOpacity onPress={() => {this.listAllQA()}}>
              <Image
                style={styles.option}
                source={require('./res/img/nav_icon.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            {this.normalRender()}
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
    flex: 1,
  },
  header: {
    backgroundColor: '#00FF7F',
    height:50,
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
    backgroundColor: '#F0FFFF',
    flex: 1
  },
  contentContainer: {
    flex: 1,
  	justifyContent: 'flex-start'
  },
  qas: {
    flex: 1,
  },
  qac: {
    backgroundColor: '#87CEFA',
    flexDirection: 'row'
  },
  qal: {
    flex: 2,
    alignItems: 'flex-end',
    padding:1
  },
  qar: {
    flex: 5,
    alignItems: 'flex-start',
    padding:1
  },
  nfont : {
    fontSize: 20
  },
  bfont: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  subfont: {
    fontSize: 13
  },
  sfont: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  ssfont: {
    fontSize: 18,
    margin: 5
  },
  sss: {
  },
  ssc: {
    paddingLeft: 20
  },
  s: {
  	justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#F0FFFF',
    padding: 10
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
