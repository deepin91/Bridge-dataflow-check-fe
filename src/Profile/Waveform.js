import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import play from '../Jam/play.png';
import JamBack from "../Jam/Rectangle 49.png";
// import style from "./wave.module.css";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min";
import style from './Waveform.module.css'
import image from '../Jam/musical-note.png'
import { VolumeMute, VolumeUp } from "@mui/icons-material";
import { Icon } from '@iconify/react';

// import base from './base.png'

const formWaveSurferOptions = ref => ({
    container: ref,
    waveColor: "#eee",
    progressColor: "OrangeRed",
    cursorColor: "OrangeRed",
    barWidth: 6,
    barRadius: 3,
    responsive: true,
    height: 60,
    normalize: true,
    partialRender: true,
    interact: true,
    plugins: [
        CursorPlugin.create({
            showTime: true,
            opacity: 1,
            customShowTimeStyle: {
                'background-color': '#000',
                color: '#fff',
                padding: '2px',
                'font-size': '10px'
            }
        })
    ]
});

const Waveform = forwardRef((props) => {
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const [playing, setPlay] = useState(false);
    const [volume, setVolume] = useState(0.5);

    const url = props.src

    //추가
    let [currentTime, setCurrentTime] = useState('');
    let [min, setMin] = useState(0);
    let [sec, setSec] = useState(0);
    let [totalTime, setTotalTime] = useState('');
    let [tMin, setTMin] = useState(0);
    let [tSec, setTSec] = useState(0);

    //추추가
    // let [pauseTime, setPauseTime] = useState(0);
    // let [pMin, setPMin] = useState(0);
    // let [pSec, setPSec] = useState(0);

    //import 해서 사용 //.current.함수 로 사용하기 위해 선언
    // useImperativeHandle(ref, () => ({
    //     // 부모 컴포넌트에서 사용할 함수를 선언
    //     PlayAll
    // }))


    // function PlayAll() {
    //     setPlay(!playing);
    //     wavesurfer.current.playPause();
    // }

    useEffect(() => {
        // setPlay(false);


        const options = formWaveSurferOptions(waveformRef.current);
        wavesurfer.current = WaveSurfer.create(options);
        console.log(url);
        wavesurfer.current.load(url);


        // wavesurfer.current.on("seek", function () {
        //   pauseTime = wavesurfer.current.getCurrentTime();
        //   setPauseTime(pauseTime);
        //   pMin = Math.floor(pauseTime / 60);
        //   setPMin(pMin);
        //   pSec = Math.round(pauseTime % 60);
        //   setPSec(pSec);
        // })

        wavesurfer.current.on("ready", function () {
            totalTime = wavesurfer.current.getDuration();
            setTotalTime(totalTime);
            tMin = Math.floor(totalTime / 60);
            setTMin(tMin);
            tSec = Math.round(totalTime - (tMin * 60));
            setTSec(tSec);

            // pauseTime = wavesurfer.current.getDuration();
            // setPauseTime(pauseTime);
        })

        wavesurfer.current.on("audioprocess", function () {
            if (wavesurfer.current) {
                wavesurfer.current.setVolume(volume);
                setVolume(volume);
                currentTime = wavesurfer.current.getCurrentTime();
                setCurrentTime(currentTime);
                min = Math.floor(currentTime / 60);
                setMin(min);
                sec = Math.round(currentTime % 60);
                setSec(sec);
            }
        });
        return () => wavesurfer.current.destroy();
    }, [url]);

    const handlePlayPause = () => {
        setPlay(!playing);
        wavesurfer.current.playPause();
    };

    const onVolumeChange = e => {
        const { target } = e;
        const newVolume = +target.value;

        if (newVolume) {
            setVolume(newVolume);
            wavesurfer.current.setVolume(newVolume || 1);
        }
    };

    // const [hover, setHover] = useState<string>('');

    // 멈춰 !!!!
    // let a = pMin + ":" + pSec
    // const [isHovering, setIsHovering] = useState(false);

    // const handleMouseOver = () => {
    //   setIsHovering(true);
    // };

    // const handleMouseOut = () => {
    //   setIsHovering(false);
    // };

    return (
        <>
            {/* <div style={{marginBottom: "40px"}}> */}
            {/* style={{ marginTop: 20 }} */}
            {/* <span className={style.pauseTime}> {a}</span> */}
            {/* <div style={ {float:"left",marginTop:30}} className="clearfix"> */}
            {/* <img alt="악기 이미지" src={base}/> */}
            {/* <span alt="재생 버튼" style={{ marginLeft: 10, width: 60, height: 60, marginTop: 37.5 }}> <button onClick={handlePlayPause}>{!playing ? <img className={style.button} src={play} /> : <img className={style.button} src={JamBack} />}</button></span> */}
            {/* <div > */}

            {/* </div> */}
            {/* </div> */}
            {/* <label htmlFor="volume">Volume</label>
                        <input
                            type="range"
                            id="volume"
                            name="volume"
                            min="0.01"
                            max="1"
                            step=".025"
                            onChange={onVolumeChange}
                            defaultValue={volume}
                        /> */}
            <div style={{ width: 700, marginLeft: 80 }}>
                <div id="waveform" ref={waveformRef} />
            </div>

            <div>
                <div style={{ marginLeft: "80px" }}>
                        <span>{min}:{sec}</span>
                    <div style={{ float: "right", marginRight: "100px" }}>
                    <span>{tMin}:{tSec}</span>
                    </div>
                </div>
            </div>

            {/* <p className ={style.explain} >{a}</p>  */}
            {/* <button onClick={test}>asdasd</button> */}
            <div style={{ marginBottom: "20px" }}>
                <h3 style={{ marginTop: "30px", textAlign: "center" }}>업로드한 파일 제목</h3>
                {/* style={{ marginTop: 20 }} */}
                {/* <span className={style.pauseTime}> {a}</span> */}
                <div style={{ marginTop: 30, textAlign: "center", marginBottom: "-10px" }} className="clearfix">
                    {/* <img alt="악기 이미지" src={base}/> */}

                    <span alt="재생 버튼" style={{ marginLeft: 10, width: 60, height: 60, marginTop: 37.5 }}> <button onClick={handlePlayPause}>{!playing ? <Icon icon="mdi:play" color="#6091eb" className={style.button}/> : <Icon icon="line-md:play-to-pause-transition" color="#6091eb" className={style.button}/>}</button></span>
                    <div >

                    </div>
                </div>

                <div style={{ textAlign: "center" , paddingBottom: "10px"}}>
                    <label htmlFor="volume">
                    <input
                        type="range"
                        id="volume"
                        name="volume"
                        min="0.01"
                        max="1"
                        step=".025"
                        onChange={onVolumeChange}
                        defaultValue={volume}
                    />
                    </label>

                </div>


            </div>

        </>
    );
}); export default Waveform