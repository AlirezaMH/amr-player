/*
* -- AmrPlayer --
* props:
*  1. bool canPlay
*  2. bool isPlaying
* methods:
*  1. load(url)
*  1. play()
*  2. stop()
*  3. playback()
*  3. setOnEnded(callback)
*  3. setOnLoaded(callback)
*  3. setOnProgress(callback)
* */
var AmrPlayer = function(){
    this.init();
};

AmrPlayer.prototype = {
    init: function(){
        this.audioContext = null;
        this.bufferSource = null;
        this.blob = null;
        this.canPlay = false;
        this.isPlaying = false;
        this.onEnded = null;
        this.onLoaded = null;
        this.onProgress = null;
    },

    load: function(url){
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.onreadystatechange = function(e) {
            if ( xhr.readyState == 4 && xhr.status == 200 ) {
                self.blob = new Blob([xhr.response], {type: 'audio/mpeg'});
                self.genPLayer(function(){
                    self.canPlay = true;
                    self.onLoaded && self.onLoaded(self);
                });
            }
        };
        xhr.onprogress = function(e){
            if(e.lengthComputable){
                self.onProgress && self.onProgress(e);
            }
        };
        xhr.send();
        return this;
    },

    genPLayer: function(callback){
        var self = this;
        this.isPlaying = false;
        this.readBlob(this.blob, function(data){
            self.readAmrArray(data);
            callback && callback();
        });
    },

    readBlob: function(blob, callback) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = new Uint8Array(e.target.result);
            callback(data);
        };
        reader.readAsArrayBuffer(blob);
    },

    readAmrArray: function(array) {
        var samples = AMR.decode(array);
        if (!samples) {
            alert('Failed to decode!');
            return;
        }
        this.readPcm(samples);
    },

    readPcm: function(samples) {
        var self = this;
        var ctx = this.getAudioContext();
        this.bufferSource = ctx.createBufferSource();
        var buffer = ctx.createBuffer(1, samples.length, 8000);
        if (buffer.copyToChannel) {
            buffer.copyToChannel(samples, 0, 0)
        } else {
            var channelBuffer = buffer.getChannelData(0);
            channelBuffer.set(samples);
        }
        this.bufferSource.buffer = buffer;
        this.bufferSource.connect(ctx.destination);
        this.bufferSource.onended = function(){
            self.onEnded && self.onEnded(self);
            self.genPLayer();
        };
    },

    getAudioContext: function(){
        if (!this.audioContext) {
            if(window.AudioContext) {
                this.audioContext = new AudioContext();
            } else {
                this.audioContext = new window.webkitAudioContext();
            }
        }
        return this.audioContext;
    },

    play: function(){
        if(this.isPlaying) return;
        if( this.canPlay){
            this.bufferSource.start();
            this.isPlaying = true;
        }else{
            console.warn('can not play now');
        }
    },

    stop: function(){
        if(!this.isPlaying) return;
        this.bufferSource.stop();
        this.genPLayer();
    },

    playback: function(){
        this.isPlaying ? this.stop() : this.play();
    },

    setOnEnded: function(cb){
        this.onEnded = cb;
        return this;
    },

    setOnLoaded: function(cb){
        this.onLoaded = cb;
        return this;
    },

    setOnProgress: function(cb){
        this.onProgress = cb;
        return this;
    }
};