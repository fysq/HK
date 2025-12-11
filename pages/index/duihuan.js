
const app = getApp();
Page({
  data: {
    barcolor:"",
    menuheight:0,
    menutop:0,
    imgpre:'',
    setinfo:[]
  },
  onLoad(e){
      const menuButtonInfo = app.globalData.menuButtonInfo;
      this.setData({
        'menutop':menuButtonInfo.top,
        'menuheight':menuButtonInfo.top+menuButtonInfo.height+10,
        'imgpre':app.globalData.prefix,
        'setinfo':app.globalData.setinfo,
      });
  },
  
  back() {
    wx.navigateBack()
},
});