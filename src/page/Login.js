
import React , { Component } from 'react';
import {
  Navigator ,
  View ,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Platform,
  Switch
} from 'react-native';
import TabShow from '../components/TabShow';
import Camera from 'react-native-camera';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Ionicons';
import { randomBg } from '../utils';
import connectComponent from '../utils/connectComponent';
import * as QrCodeComponent from './QrCode';
import About from './About';
const QrCode = connectComponent(QrCodeComponent);

class Login extends Component {
  constructor (props){
    super(props);
    this.toAbout = this.toAbout.bind(this);
    this.clearCache = this.clearCache.bind(this);
    this.logout = this.logout.bind(this);
  }

  toAbout (){
    const { navigator } = this.props;
    navigator && navigator.push({
      component : About,
      sceneConfig : Navigator.SceneConfigs.VerticalUpSwipeJump
    })
  }

  clearCache (){
    const { actions } = this.props;
    actions.toast('清除成功')
  }

  logout(){
    const { actions } = this.props;
    actions.logout();
    actions.toast('退出成功')
  }

  login (){
    const { navigator } = this.props;
    if(Platform.OS == 'ios'){
      Camera.checkDeviceAuthorizationStatus().then( (isAuth) =>{
        if(isAuth){
          navigator.push({
            component : QrCode
          })
        }else{
          actions.toast('请在设置中开启Noder对相机的访问')
        }
      }).catch( (err) =>{
        actions.toast('获取相机访问权错误');
      })
    }else{
      navigator.push({
        component : QrCode
      })
    }

  }

  renderHeader (){
    const {isLogin , User} = this.props;
    return (
      <View style={[styles.userHeader,{backgroundColor:randomBg()}]}>
        <View style={styles.userImgWrap}>
          <View style={styles.userImgBox}>
            {
              User && User.success ?
              <Image
                style={[styles.userImg]}
                source={{uri : User.data.avatar_url}}
              /> :
              <Image
                style={[styles.userImg]}
                source={{uri : 'http://test.imgs.wn518.com/upimages/ys-sales/2016-03-29/87e08bb58a0a9b57bcd035fbf6bb4e02_1_0_0_420_420_1.jpg'}}
              />
            }
          </View>
          <View style={styles.userName}>
            {
              0 && User && User.success ?
              <Text style={{textAlign:'center',color:textColor,fontSize:16}}>{User.data.loginname}</Text> :
              <TouchableOpacity onPress={this.login.bind(this)}>
              <Text style={{textAlign:'center',color:textColor,fontSize:16}}>登陆</Text>
              </TouchableOpacity>
            }
          </View>
        </View>
        {
          User && User.success ?
          <View style={styles.userInfo}>
          <Text style={{textAlign:'center',color:textColor}}>积分：{User.data.score || 0}</Text>
          <Text style={{textAlign:'center',color:textColor}}>注册时间：{moment(User.data.create_at).format('l')}</Text>
          </View>
          :null
        }
      </View>
    )
  }

  renderOptions (){
    const { User } = this.props;
    return (
      <View>
        <TouchableOpacity onPress={this.clearCache.bind(this)}>
        <View style={styles.itemOptions}>
          <Icon
            name='md-trash'
            size={ 20 }
            color='#333'
          />
          <Text style={styles.optionsText}>清除缓存</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity>
        <View style={styles.itemOptions}>
          <Icon
            name='md-sync'
            size={ 20 }
            color='#333'
          />
          <Text style={styles.optionsText}>检查更新</Text>
        </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.toAbout}>
        <View style={styles.itemOptions}>
          <Icon
            name='md-key'
            size={ 20 }
            color='#333'
          />
          <Text style={styles.optionsText}>关于</Text>
        </View>
        </TouchableOpacity>
        {
          User && User.data ?
          <TouchableOpacity
            onPress={this.logout}
          >
          <View style={styles.itemOptions}>
            <Icon
              name='md-power'
              size={ 20 }
              color='#333'
            />
            <Text style={styles.optionsText}
              onPress={this.logout}
            >
              注销
            </Text>
          </View>
          </TouchableOpacity>
          : null
        }

      </View>
    )
  }
  render (){
    const pointContent = (()=>{
      return (
        <Icon
          name='md-arrow-back'
          size={ 30 }
          color='rgba(255,255,255,1)'
        />
      )
    })();

    return (
      <View style={[styles.container]}>
        <View>
          {this.renderHeader()}
          {this.renderOptions()}
        </View>
        <TabShow {...this.props}
          content={pointContent}
          wrapStyle={styles.wrapStyle}
         />
      </View>
    )
  }
}

const { width , height } = Dimensions.get('window');
const userImgWidth = 80;
const textColor = '#fff'
const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor:'#f0f0f0'
  },
  itemOptions : {
    flexDirection : 'row',
    height : 50,
    borderBottomWidth : 1,
    borderTopWidth : 1,
    borderColor : '#eee',
    alignItems : 'center',
    paddingHorizontal : 8,
    // paddingVertical : 10
    marginTop : 10,
    backgroundColor : '#fff'
  },
  optionsText : {
    // lineHeight :40,
    fontSize : 15,
    paddingHorizontal : 3,
    color :'#333'
  },
  userImgWrap : {
    flex : 8,
    flexDirection : 'column',
    // alignItems : 'center',
    justifyContent : 'center'
  },
  userImgBox :{
    paddingTop:20,
    flexDirection : 'row',
    alignItems : 'center',
    justifyContent : 'center'
  },
  userName : {
    flex : 1,
    flexDirection : 'row',
    justifyContent : 'center',
    alignItems : 'center',
  },
  userInfo : {
    flex : 2,
    flexDirection : 'row',
    alignItems : 'center',
    paddingHorizontal : 10,
    justifyContent : 'space-between'
  },
  userHeader : {
    height :height/4
  },
  userImg : {
    width : userImgWidth,
    height : userImgWidth,
    borderRadius : userImgWidth/2
  },
  wrapStyle : {
    flex : 1,
    position:'absolute',
    left : 20,
    bottom : 25,
  },
})

export const LayoutComponent = Login;
export function mapStateToProps(state){
  return {
    User : state && state.User
  }
}
