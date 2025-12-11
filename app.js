// app.js
App({
  onLaunch: function (option) {
    if(option.scene!='1154'){
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)
      })
  
      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })
  
      updateManager.onUpdateFailed(function () {
        // 新版本下载失败
      })
    }
  
      this.j=0;
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
      this.globalData.menuButtonInfo = menuButtonInfo;

    this.fontLoaded = false; // 初始化字体加载状态
    this.getFonts("fzqk");
    // this.getFonts("ltxh");
    // console.log(menuButtonInfo);
  },
  globalData: {
      menuButtonInfo: null,
      posturl:'https://a.zjglsw.com/i/HK/app',
      prefix:"https://a.zjglsw.com/i/HK/"
  },
  getFonts(name) {
    let that = this;
    let url = "https://a.zjglsw.com/i/HK/dist/font/"; // 替换为你的服务器域名或 IP
    let source = 'url("' + url + name + '.ttf")';
    console.log(source);
    wx.loadFontFace({
      family: name, // 去掉文件后缀作为字体名称
      source: source,
      global: true, // 设置为全局生效
      success(res) {
        // console.log("load " + name + " success");
        that.fontLoaded = true; // 设置字体加载完成
      },
      fail(res) {
        that.j=that.j+1;
        if(that.j<3){
          that.getFonts(name)
        }
        console.log("load " + name + " failed");
        console.log(res); // 打印错误信息
      }
    });
  },
})
