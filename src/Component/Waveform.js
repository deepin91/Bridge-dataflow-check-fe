import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import play from '../Jam/play.png';
import JamBack from "../Jam/Rectangle 49.png";
// import style from "./wave.module.css";
import CursorPlugin from "wavesurfer.js/dist/plugin/wavesurfer.cursor.min";
import style from './Waveform.module.css'
import image from '../Jam/musical-note.png'
import vocal from '../img/vocal.png'
import elect from '../img/elect.png'
import aco from '../img/acu.png'
import base from '../img/base.png'
import drum from '../img/drum.png'
import piano from '../img/piano.png'
import elseinstrument from '../img/elseinstrument.png'
// import VolumePlugin from "wavesurfer.js/dist/plugin/wavesurfer.volume.min";



import { Pause, PlayArrow, VolumeUpRounded } from "@mui/icons-material";
import { blue, grey } from "@mui/material/colors";

const Waveform = forwardRef((props, ref) => {
    const waveformRef = useRef(null);
    const wavesurfer = useRef(null);
    const [playing, setPlay] = useState(false);
    const [volume, setVolume] = useState(0.5);

    const url = props.src

    useEffect(() => { console.log("첫번째이펙트") }, [])

    const formWaveSurferOptions = ref => ({
        container: ref,
        waveColor: "#eee",
        progressColor: "LightBlue",
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
            // VolumePlugin.create()
        ]
    });



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
    useImperativeHandle(ref, () => ({
        // 부모 컴포넌트에서 사용할 함수를 선언
        PlayAll
    }))


    function PlayAll() {
        setPlay(!playing);
        wavesurfer.current.playPause();
    }

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
            // wavesurfer.current.setVolume(newVolume || 1);
            wavesurfer.current.setVolume(newVolume);
            // console.log(">>>>>>>>>>>" + volume);
            // console.log("=============" + wavesurfer.current.getVolume())
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
    const [img, setImg] = useState("");
    useEffect(() => {
        console.log(props.data)
        switch (props.data.cmInstrument) {
            case "여성보컬": setImg(vocal)
                break;
            case "남성보컬": setImg(vocal)
                break;
            case "일렉기타": setImg(elect)
                break;
            case "어쿠스틱기타": setImg(aco)
                break;
            case "베이스기타": setImg(base)
                break;
            case "드럼": setImg(drum)
                break;
            case "피아노": setImg(piano)
                break;
            case "신디사이저": setImg(piano)
                break;
            default:
                setImg(elseinstrument)
        }
    }, [])
    return (
        <>
            <div style={{ marginBottom: "60px" }}>
                {/* style={{ marginTop: 20 }} */}
                {/* <span className={style.pauseTime}> {a}</span> */}
                <div style={{ float: "left", marginTop: "-32px" }} className="clearfix">
                    <img alt="악기 이미지" style={{ width: "118px", height: "123px" }} src={img} />
                    <span alt="재생 버튼" style={{ marginLeft: 40, marginTop: 44, float: "right" }}> <button onClick={handlePlayPause}>{!playing ? <PlayArrow sx={{ fontSize: 40, color: blue[500] }} /> : <Pause sx={{ fontSize: 40, color: blue[500] }} />}</button></span>
                    {/* <div >
                        <label htmlFor="volume"><VolumeUpRounded sx={{ color: grey[400], fontSize: 24 }} /></label>
                        <input
                            type="range"
                            id="volume"
                            name="volume"
                            min="0"
                            max="1"
                            step=".025"
                            onChange={onVolumeChange}
                            // value={volume}

                        />
                    </div> */}
                </div>

                <div style={{ width: 800, marginLeft: 220 }}>
                    <div id="waveform" ref={waveformRef} />
                </div>
                <div style={{ marginLeft: "220px", marginTop: "5px" }}>
                    <span>{min}:{sec}</span>

                    <span style={{ marginLeft: "740px" }}>{tMin}:{tSec}</span>
                </div>
                {/* <p className ={style.explain} >{a}</p>  */}
                {/* <button onClick={test}>asdasd</button> */}


            </div>

        </>
    );
}); export default Waveform