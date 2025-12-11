
const app = getApp();

Page({
  data: {
    bookinfo:{
      'toplist':[],
      'swiperitem':[],
    },
    topiclist:[],
    
    showModal: false, // 控制弹框的显示状态
    modalContent: {
      title: '客服联系方式',
      text: '电话：4008830807',
      imageUrl: 'https://a.zjglsw.com/i/HK/imgs/kefu.jpg?1' // 图片路径
    },
    
    barcolor:"",
    menuheight:0,
    menutop:0,
    pageheight:0,
    pagewidth:0,
    imgpre:"",
    setinfo:[],
    loading:true,
    right:30,
    bottom:30,
    left:400,
    top:500,
    startX: 0, // 开始触摸时的 X 坐标
    startY: 0, // 开始触摸时的 Y 坐标
    dragging: false, // 是否正在拖动
    floatshow:false,
    pixelRatio:1,
    code:'',
    showduihuan:false
  },
  onLoad(options) {
    let that = this;

    const windowInfo = wx.getWindowInfo();
    // console.log(windowInfo);
    const screenWidth = windowInfo.screenWidth; // 屏幕宽度（逻辑像素）
    const screenHeight = windowInfo.screenHeight; // 屏幕高度（逻辑像素）
    const pixelRatio = windowInfo.pixelRatio; // 像素比
    that.setData({
      'pageheight':screenHeight,
      'pagewidth':screenWidth,
      'pixelRatio':pixelRatio,
      'bottom':(screenHeight-160/pixelRatio)/2 * 1.3
    });
    if(options.scene){
        let [bid,code]=options.scene.split("-");
        console.log(bid,code);
        // console.log('pages/index/index?bid='+bid+'&code='+code);
        // wx.reLaunch({
        //   url: 'pages/index/index?bid='+bid+'&code='+code,
        //   success:function(){
        //   }
        // })
        options.bid = bid;
        options.code = code;
        // return;
    }
    const menuButtonInfo = app.globalData.menuButtonInfo;
    this.setData({
      'menutop':menuButtonInfo.top,
      'menuheight':menuButtonInfo.top+menuButtonInfo.height+10,
      'imgpre':app.globalData.prefix
    });

    console.log(options);
    if(options.bid && options.code){
      console.log('new')
      //保存到localstorage
      // wx.setStorage({
      //  bid:options.bid,
      //  code:options.code 
      // })
      wx.setStorageSync('bid',options.bid);
      wx.setStorageSync('code',options.code);

      this.initcode(options)



    }else{ 
      
      console.log('old')
      if(!options.home && wx.getStorageSync('bid') && wx.getStorageSync('code')){

        let opts = {
          'bid':wx.getStorageSync('bid'),
          'code':wx.getStorageSync('code')
        }
        this.initcode(opts)
      }


      app.globalData.bid='1';
      app.globalData.code='';
      app.globalData.codeCanUse=0;
      that.inithome();
    }
    
  },
  initcode(options){
    let that = this
    wx.request({
      url: app.globalData.posturl+'/initcode',
      method:"POST",
      data:{
        bid:options.bid,
        code:options.code,
      },
      success:function(e){
        // console.log(e);
        app.globalData.cbid=e.data.msg.cbid;
        const timestampByNow = Date.now();
        const timestampByNowInSeconds = Math.floor(timestampByNow / 1000);
        if(e.data.msg.length=='0'){
          console.log(1);
          app.globalData.bid='1';
          app.globalData.code='';
          app.globalData.codeCanUse=0;
        }else if(e.data.msg.status!='1'){
          console.log(2);
          wx.showToast({
            title: '兑换码尚未激活',
            icon:"none"
          })
          that.setData({
            code:options.code,
          })
          app.globalData.bid=options.bid;
          app.globalData.code=options.code;
          app.globalData.codeCanUse=0;
        }else if(e.data.msg.endtime<timestampByNowInSeconds){
          console.log(3);
          
          that.setData({
            code:options.code,
          })
          wx.showToast({
            title: '兑换码已过期',
            icon:"none"
          })
          app.globalData.bid=options.bid;
          app.globalData.code=options.code;
          app.globalData.codeCanUse=0;
        }else{
          that.setData({
            code:options.code,
          })
          console.log(4);
          app.globalData.bid=options.bid;
          app.globalData.code=options.code;
          app.globalData.codeCanUse=1;
        }
        that.inithome();
      },
      fail:function(e){
        console.log(e);
      }
    })
  },
  onReady(){
    let show = setInterval(() => {
      if(app.fontLoaded){
        console.log('show');
        this.setData({
        loading:false,
        })
        clearInterval(show);
      }
    }, 100);
  },
  onPageScroll: function (e) {
    if (e.scrollTop > 50) {
      this.setData({'barcolor':"white"});
    }else{
      this.setData({'barcolor':""});
    }

    if (e.scrollTop > this.data.pageheight) {
      this.setData({'floatshow':true});
    }else{
      this.setData({'floatshow':false});
    }


    // 触发自定义事件，将滚动信息传递给组件
    // this.selectComponent('#navifation-bar').triggerEvent('pageScroll', e);
  },
  inithome(){
    let that = this;
    wx.request({
      url: app.globalData.posturl+'/gethomeinfo',
      method:"POST",
      data:{
        bid:app.globalData.bid,
      },
      success:function(e){
        // console.log(e.data.msg);
        const data = e.data;
        // const data = new TextDecoder('utf-8').decode(new Uint8Array(e.data));
        // console.log(data);
        that.setData({
          bookinfo:data.msg.bookinfo,
          topiclist:data.msg.topiclist,
          setinfo:data.msg.setinfo
        });
        app.globalData.allpids = data.msg.bookinfo.pids
        app.globalData.setinfo = data.msg.setinfo

        
        wx.setStorageSync('kefu',data.msg.setinfo.kefu);
      }
    })
  },
  kefu(){
    // wx.showModal({
    //     title: '提示',
    //     content: '跳转联系客服',
    //     showCancel: false
    // });
    
    this.setData({
      showModal: true
    });
  },
  duihuan(){
    
    wx.navigateTo({
      url: '/pages/index/duihuan',
    })
  },
  gotolist(e){
    wx.navigateTo({
      url: '/pages/prods/prodlist',
    })
  },
  gototype(e){
    const tid = e.currentTarget.dataset.tid;
    wx.navigateTo({
      url: '/pages/prods/prodlist?tid='+tid,
    })
  },
  gotolink(e){
    
    const index = e.currentTarget.dataset.index;
    let topiclist = this.data.topiclist
    console.log(index,topiclist[index].linktype,topiclist[index].linkid);
    if(topiclist[index].linktype=='1'){
      wx.navigateTo({
        url: '/pages/prods/prodlist?tid='+topiclist[index].linkid,
      })
    }else if(topiclist[index].linktype=='2'){

      wx.navigateTo({
        url: '/pages/prods/prodinfo?pid='+topiclist[index].linkid,
      })
    }
  },
  scan(e){
    if(app.globalData.code){
      
    wx.navigateTo({
      url: '/pages/prods/prodlist',
    })

    }else{

        wx.scanCode({
        scanType:['qrCode', 'wxCode'],
        success: (res) => {
          if(res.path){
            console.log(res)
            wx.reLaunch({
              url: '/'+res.path,
              success: () => {
                console.log('跳转成功');
              },
              fail: (err) => {
                console.error('跳转失败:', err);
              }
            })
          }else{
              wx.showModal({
                title: '扫码失败',
                content: '请扫描正确的兑换码',
                showCancel: false
              });
            }
      }
  

    });
    }
  },
  hideModal() {
    this.setData({
      showModal: false
    });
  },
  onShareAppMessage(){
    let sharemsg={
      title: app.globalData.setinfo.sharetitle,  
      path: 'pages/index/index?bid='+app.globalData.bid+'&code='+app.globalData.code,
      imageUrl: this.data.imgpre+app.globalData.setinfo.shareimg,
    };
    console.log(sharemsg);
    return sharemsg;
  },
  onShareTimeline(){
    
    let sharemsg={
      title: app.globalData.setinfo.sharetitle,  
      query:'from=timeline',
      imageUrl: this.data.imgpre+app.globalData.setinfo.shareimg,
    };
    console.log(sharemsg);
    return sharemsg;
  },
  showbig(e){
    let imgsrc = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [imgsrc],
    })
  },
  
  onTouchStart(e) {
    console.log('ts')
    this.setData({
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      startright:this.data.right,
      startbottom:this.data.bottom,
      dragging: true
    });
  },
  onTouchMove(e) {
    const throttledMove = this.throttle((e) => {
      if (this.data.dragging) {
        console.log('tm');
        let dltright = this.data.startX - e.touches[0].clientX;
        let dltbottom = this.data.startY - e.touches[0].clientY;
        
        let newright = Math.max(0, Math.min(this.data.startright+dltright, this.data.pagewidth-30));
        let newbottom = Math.max(0, Math.min(this.data.startbottom+dltbottom, this.data.pageheight-100));
        // console.log(newright,newbottom)
        this.setData({
          right: newright,
          bottom: newbottom
        });
        // e.preventDefault(); // 阻止默认行为
      }
    },60);
    throttledMove(e);
  },
  // onTouchMove2(e) {
  //   const throttledMove = this.throttle((e) => {
  //     if (this.data.dragging) {
  //       console.log(e.touches[0]);
  //       // let dltright = this.data.startX - e.touches[0].clientX;
  //       // let dltbottom = this.data.startY - e.touches[0].clientY;
        
  //       // let newright = Math.max(0, Math.min(this.data.startright+dltright, this.data.pagewidth-30));
  //       // let newbottom = Math.max(0, Math.min(this.data.startbottom+dltbottom, this.data.pageheight-100));
  //       // console.log(newright,newbottom)
  //       this.setData({
  //         top: e.touches[0].clientY * this.data.pixelRatio,
  //         left: e.touches[0].clientX * this.data.pixelRatio
  //       });
  //       // e.preventDefault(); // 阻止默认行为
  //     }
  //   },30);
  //   throttledMove(e);
  // },
  onTouchEnd() {
    this.setData({
      dragging: false
    });
  },
  
  throttle(func, delay) {
    let timer = null;
    return function(...args) {
      if (!timer) {
        timer = setTimeout(() => {
          func.apply(this, args);
          timer = null;
        }, delay);
      }
    };
  },
})