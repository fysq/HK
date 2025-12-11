Component({
  properties: {
    title: {
      type: String,
      value: '女装'
    },
    topImageSrc: {
      type: Array,
      value: []
    },
    productList: {
      type: Array,
      value: []
    },
    buttonText: {
      type: String,
      value: '探索更多'
    }
  },
  data: {
    "imgpre":'',
    "currentIndex":'',
    "swiperHeight":0
  },
  created(){
    const app = getApp();
    this.setData({
        imgpre:app.globalData.prefix
    });
    // console.log(this.data);
  },
  methods: {
    
    changeIndicatorDots(e) {
      
      const currentIndex = e.detail.current;
      const prevIndex = this.data.currentIndex;

      // 停止上一个视频的播放
      if (this.properties.topImageSrc[prevIndex] && this.properties.topImageSrc[prevIndex]['value'].endsWith('.mp4')) {
          const videoContext = wx.createVideoContext(`video-${prevIndex}`, this);
          videoContext.pause();
      }

      // 播放当前视频
      if (this.properties.topImageSrc[currentIndex] && this.properties.topImageSrc[currentIndex]['value'].endsWith('.mp4')) {
          const videoContext = wx.createVideoContext(`video-${currentIndex}`, this);
          videoContext.play();
      }
      this.setData({
          currentIndex: e.detail.current
      });
    },
    gotolist:function(e){
      wx.navigateTo({
        'url':'/pages/prods/prodlist'
      })
    },
    
  computeImgHeight(e) {
    const windowInfo = wx.getWindowInfo();
    const winWid = windowInfo.screenWidth; // 屏幕宽度（逻辑像素）
    // const winWid = wx.getSystemInfoSync().windowWidth; // 获取当前屏幕的宽度
    const imgHeight = e.detail.height; // 获取图片的实际高度
    const imgWidth = e.detail.width; // 获取图片的实际宽度
    const swiperH = winWid * imgHeight / imgWidth; // 等比例计算 swiper 的高度
    // console.log(swiperH)
    this.setData({
      swiperHeight: swiperH, // 动态设置 swiper 高度
    });
  },
  }
})