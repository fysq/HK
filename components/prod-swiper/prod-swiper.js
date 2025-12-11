Component({
    properties: {
        images: {
            type: Array,
            value: []
        },
        title: {
            type: String,
            value: ""
        },
        des: {
            type: String,
            value: ""
        },
        prodId: {
            type: String,
            value: ""
        },
        autoplay: {
            type: Boolean,
            value: false
        },
        interval: {
            type: Number,
            value: 5000
        },
        duration: {
            type: Number,
            value: 500
        }
    },
    data: {
        currentIndex: 0,
        imgpre:""
    },
    
    created(){
    const app = getApp();
    this.setData({
        imgpre:app.globalData.prefix
    });
    },
    methods: {
        changeIndicatorDots(e) {
            const currentIndex = e.detail.current;
            const prevIndex = this.data.currentIndex;

            // 停止上一个视频的播放
            if (this.properties.images[prevIndex] && this.properties.images[prevIndex]['value'].endsWith('.mp4')) {
                const videoContext = wx.createVideoContext(`video-${prevIndex}`, this);
                videoContext.pause();
            }

            // 播放当前视频
            if (this.properties.images[currentIndex] && this.properties.images[currentIndex]['value'].endsWith('.mp4')) {
                const videoContext = wx.createVideoContext(`video-${currentIndex}`, this);
                videoContext.play();
            }
            this.setData({
                currentIndex: e.detail.current
            });
            
        },
        tapImage(e) {
            // const index = e.currentTarget.dataset.index;
            // this.triggerEvent('imageTap', { index });
            // // console.log(this.properties.prodId);
            // wx.navigateTo({
            //   url: '/pages/prods/prodinfo?pid='+this.properties.prodId,
            // })
        }
    }
});    