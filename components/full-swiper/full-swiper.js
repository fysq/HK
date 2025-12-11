Component({
    properties: {
        images: {
            type: Array,
            value: {}
        },
        topdes: {
            type: Array,
            value: {}
        },
        autoplay: {
            type: Boolean,
            value: true
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
        imgpre:"",
        isActive:['riseup']
    },
    created(){
        const app = getApp();
        const menuButtonInfo = app.globalData.menuButtonInfo;
        this.setData({
          'menutop':menuButtonInfo.top,
          'menuheight':menuButtonInfo.top+menuButtonInfo.height+10,
          'imgpre':app.globalData.prefix
        });
        // console.log(this.data);
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
                    isActive:[]
                });
                let act = this.data.isActive;
                act[currentIndex]='riseup';
                // console.log(act);
                this.setData({
                    currentIndex,
                    isActive:act
                });
        },
        tapImage(e) {
            const index = e.currentTarget.dataset.index;
            this.triggerEvent('imageTap', { index });
            console.log(e);
        }
    }
});    