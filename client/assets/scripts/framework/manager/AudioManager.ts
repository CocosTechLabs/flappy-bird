
import {
    _decorator,
    error,
    find,
    resources,
    AudioSource,
    director
} from 'cc';
import { Singleton } from '../common/Singleton';
import { LogManager } from '../common/LogManager';

export class AudioManager extends Singleton {
    musicVolume: number
    soundVolume: number
    audios: any
    currentMusic: any;

    musicAs: AudioSource = null;
    effectAs: AudioSource = null;

    protected constructor() {
        super();
        this.musicVolume = 1
        this.soundVolume = 1
        this.audios = {};
        this.currentMusic = null;
    }

    initAudio() {
        // this.musicVolume = localStorage.getNumberData(ConstansConfig.SWITCH_MUSIC_KEY,1)
        // this.soundVolume = localStorage.getNumberData(ConstansConfig.SWITCH_SOUND_KEY,1)

        // LogManager.log("this.musicVolume==",this.musicVolume)
        // if(this.isClose()){
        //     cc.audioEngine.stopAllEffects()
        //     cc.audioEngine.stopMusic();
        // }else{
        //     if(this.currentMusic){
        //         this.playMusic(this.currentMusic,true,true)
        //     }
        // }
    }
    /**
     * 播放音乐
     * @param {String} name 音乐名称可通过constants.AUDIO_MUSIC 获取
     * @param {Boolean} loop 是否循环播放
     */
    playMusic(name, loop, mutex) {
        this.play(name, loop, true, mutex);
    }

    /**
     * 播放音效
     * @param {String} name 音效名称可通过constants.AUDIO_SOUND 获取
     * @param {Boolean} loop 是否循环播放
     */
    playSound(name, loop) {
        this.play(name, loop, false, false);
    }

    play(name, loop, isMusic, mutex) {
        LogManager.log("===this-isClose", this.isClose())
        let self = this;
        let audio = self.audios[name];

        // 手动暂停的 flag 在调用了 playMusic/playSound 后就改变。否则会造成无法播放啦
        if (audio) {
            audio.isManualStop = false;
            self.playClip(name, isMusic, mutex);
        } else {
            let path = 'audios/';
            if (isMusic) {
                path += 'music/';
            } else {
                path += 'sound/';
            }

            const url = path + name;
            resources.load(url, function (err, clip) {
                if (err) {
                    error(err.message || err);
                    return;
                }
                let info: any = {
                    clip: clip,
                    loop: loop,
                    isMusic: isMusic,
                };
                self.audios[name] = info;
                self.playClip(name, isMusic, mutex);
            });
        }
    }

    playClip(name, isMuisc, mutex) {
        if (!this.musicAs || !this.effectAs) {
            let node = find("AudioManager");
            let ass = node.getComponents(AudioSource);
            this.musicAs = ass[0];
            this.effectAs = ass[1];
            director.addPersistRootNode(node);
        }
        if (!this.musicAs || !this.effectAs) {
            return;
        }

        let as: AudioSource = null;
        if (isMuisc) {
            as = this.musicAs;
            this.currentMusic = name;
        }
        else {
            as = this.effectAs;
        }

        let info = this.audios[name];
        if (info.clip == as.clip && !as.playing) {
            as.play();
            return;
        }
        else {
            as.stop();
            as.clip = info.clip;
            as.play();
        }

        // let volume = this.musicVolume;
        // if (!isMuisc) {
        //     volume = this.soundVolume;
        // } 

        // if(this.isClose()){
        //     return 
        // }
        // this.currentMusic = name;
    }

    getCurrentMusic() {
        return this.currentMusic;
    }

    stop(name) {
        // if (this.audios.hasOwnProperty(name)) {
        //     let audioId = this.audios[name].audioId;
        //     if (typeof (audioId) !== "undefined")
        //         cc.audioEngine.stop(audioId);
        //     this.audios[name].isManualStop = true;
        // }
    }


    openMusic() {
        // LogManager.log("=this.currentMusic=",this.currentMusic)
        localStorage.setItem('SWITCH_MUSIC_KEY', '1');
        this.musicVolume = 1

        this.effectAs.volume = this.musicAs.volume = 1;
    }

    closeMusic() {
        // cc.audioEngine.pauseMusic()
        // cc.audioEngine.stopAllEffects()
        // localStorage.setItem('SWITCH_MUSIC_KEY',0)
        // this.musicVolume = 0

        this.effectAs.volume = this.musicAs.volume = 0;
    }



    isClose() {
        if (this.musicVolume == 0) {
            return true
        }

        return false
    }

    isOpen() {
        return this.musicAs.volume > 0;
    }


    changeState(name, flag) {
        // let audio = this.audios[name];
        // if (flag && audio.loop && !audio.isManualStop) {
        //     if (typeof audio.audioId === "number") {
        //         if (this.isAudioStarting(audio.audioId)) return;
        //     }

        //     this.playClip(name);
        // } else if (!flag) {
        //     if (typeof audio.audioId === "number") {
        //         if (this.isAudioStarting(audio.audioId)) {
        //             cc.audioEngine.stop(audio.audioId);
        //         }
        //     }
        // }
    }

    getConfiguration(isMusic) {
        let state;
        if (isMusic) {
            state = true //configuration.getGlobalData('music');
        } else {
            state = true //configuration.getGlobalData('sound');
        }

        // LogManager.log('Config for [' + (isMusic ? 'Music' : 'Sound') + '] is ' + state);

        return !state || state === 'true' ? true : false;
    }

    /**
     * 判断声音是否处于播放或初始化中（下载中）的状态
     */
    isAudioStarting(audioId) {
        let ret = false;
        // if (typeof audioId === 'number') {
        //     let state = cc.audioEngine.getState(audioId);
        //     ret = state === cc.audioEngine.AudioState.PLAYING || state === cc.audioEngine.AudioState.INITIALZING;

        //     // 微信小游戏中cc.audioEngine.getState(audioId)一旦加载就返回2.bug
        //     if (cc.sys.browserType === cc.sys.BROWSER_TYPE_WECHAT_GAME) {
        //         ret = ret || state === cc.audioEngine.AudioState.PAUSED;
        //     }
        // }

        return ret;
    }

    setVolume(id, volume) {
        // let state = cc.audioEngine.getState(id);
        // LogManager.log('### audioId ' + id + ' state is: ' + state);

        // cc.audioEngine.setVolume(id, volume);
    }
}

