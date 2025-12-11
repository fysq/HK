
const app = getApp();
Page({
  data: {
    toggle:{
      'detail':'-',
      'des':'-',
      'more':'-'
    },
    barcolor:"",
    menuheight:0,
    menutop:0,
    swpindex:'1',
    imageUrls: [],
    desimg: [],
    imgdes: [],
    price: '',
    code: '',
    prodsinfo:"",
    imgpre:'',
    des:"",
    pid:"",
    canshow:true,
    showModal:false,
    sizeimg:'',
    modalContent: {
      title: '查看详情请联系客服',
      text: '电话：4000701899',
      imageUrl: 'https://a.zjglsw.com/i/HK/imgs/kefu.jpg?1' // 图片路径
    },
    choosesize:''
  },
  onLoad(e){
    console.log(e);
    // app.globalData.code='tttttttttt';
    // if(app.globalData.code==''){
    //   this.setData({
    //     "canshow":false,
    //     "showModal": true
    //   })
    // }else{
      const menuButtonInfo = app.globalData.menuButtonInfo;
      this.setData({
        'menutop':menuButtonInfo.top,
        'menuheight':menuButtonInfo.top+menuButtonInfo.height+10,
        'imgpre':app.globalData.prefix,
        'setinfo':app.globalData.setinfo,
        'pid':e.pid,
      });
  
      wx.request({
        url: app.globalData.posturl+"/getprodsinfo",
        method:"POST",
        data:{
          pid:e.pid
        },
        success:(e)=>{

          let imgdes = e.data.msg.imgdes
          imgdes.forEach((e,i)=>{
            imgdes[i]=e.split("##");
          })
          console.log(imgdes);
          this.setData({
            'prodsinfo':e.data.msg,
            'imageUrls':e.data.msg.imgs.map(img => this.data.imgpre + img),
            'desimg':e.data.msg.desimg.map(img => this.data.imgpre + img),
            'imgdes':imgdes,
            'swiperitem':e.data.msg.swiperitem,
            'sizeimg':e.data.msg.sizeimg

          });
        }
      })
    // }
  },
  choosesize(e){
    let size = e.currentTarget.dataset.size;
    let kucun = e.currentTarget.dataset.kucun;
    if(kucun>0){
      this.setData({
        choosesize:size
      })
    }
  },
  dealhtml(pre){
    // console.log(pre);
    const newhtml = pre.replace('src="uploads','style="width:100%" src="'+this.data.imgpre+'uploads');
    // console.log(newhtml);
    return newhtml;
  },
  update(e) {
    const currentPage = e.detail.current;
    this.setData({"swpindex":currentPage+1});
  },
  previewImage(e) {
    const current = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.imageUrls[current],
      urls: this.data.imageUrls
    });
    console.log(current);
    console.log(this.data.imageUrls[current]);
  },
  previewImage2(e) {
    const current = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.desimg[current],
      urls: this.data.desimg
    });
    console.log(current);
    console.log(this.data.desimg[current]);
  },
  toggle(e){
    let tgdom = e.currentTarget.dataset.tg;
    let toggle = this.data.toggle;
    if(toggle[tgdom]=='-'){
      toggle[tgdom] = "+";
      this.setData({"toggle":toggle});
    }else{
      toggle[tgdom] = "-";
      this.setData({"toggle":toggle});
    }
    // console.log(this.data.toggle);
  },
  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({'barcolor':"white"});
    }else{
      this.setData({'barcolor':""});
    }
    // 触发自定义事件，将滚动信息传递给组件
    // this.selectComponent('#navifation-bar').triggerEvent('pageScroll', e);
  },
  back() {
      wx.navigateBack()
  },
  close() {
      this.setData({
        showModal:false,
        canshow:true
      })
  },
  kefu(){
    wx.showModal({
        title: '提示',
        content: '跳转联系客服',
        showCancel: false
    });
  },
  pay(){
    if(app.globalData.code==''){
      this.setData({
        "canshow":false,
        "showModal": true
      })
    }else if(app.globalData.codeCanUse=='0'){
      let kefu = wx.getStorageSync('kefu');
        wx.showModal({
          title: '提示',
          content: '当前兑换码尚未激活，请联系客服 '+kefu+' 激活（卡号：'+app.globalData.cbid+'）',
          showCancel: false
      });
      
    }else{
      console.log(this.data.choosesize);
      if(!this.data.choosesize){
        wx.showToast({
          icon:'none',
          title: '请选择尺码',
        });
      }else{
        wx.navigateTo({
          url: '/pages/payment/payment?pid='+this.data.pid+'&size='+this.data.choosesize,
        })
      }
    }
  },
  showsize(){
    wx.previewImage({
      current: this.data.imgpre+this.data.sizeimg,
      urls: [this.data.imgpre+this.data.sizeimg]
    });
  },
  gohome(){
    wx.navigateTo({
      url: '/pages/index/index',
    })
  },
  gotoprod(e){
    let pid = e.currentTarget.dataset.pid;
    let ifgo = e.currentTarget.dataset.ifgo;
    if(ifgo){
      wx.navigateTo({
        url: '/pages/prods/prodinfo?pid='+pid,
      })
    }else{
      console.log("1");
    }
  }
});