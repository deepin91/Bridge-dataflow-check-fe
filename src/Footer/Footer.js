import style from './Footer.module.css';
import { Link } from 'react-router-dom';


import FacebookIcon from './FooterIcons/Facebook.svg';
import InstagramIcon from './FooterIcons/Instagram.svg';
import TwitterIcon from './FooterIcons/Twitter.svg';
import GithubIcon from './FooterIcons/Github.svg';
import BridgeBlackLogo from './FooterIcons/BridgeBlackLogo.png';


    const url = "https://github.com/Sihyun3/bridge_frontend"



    const Footer = () => {
        return (
            <>
                <footer>
                    <div className={style.container}>
                        <span></span>
                            <div className={style.snslogo}>

                                <a className={style.socialbtn}></a>
                                    <img src={FacebookIcon}></img>

                                <a className={style.socialbtn}></a>
                                    <img src={InstagramIcon}></img>

                                <a className={style.socialbtn}></a>
                                    <img src={TwitterIcon}></img>

                                <button className={style.socialbtn} style= {{bottom: '8px' , left: '12px'}}onClick={()=>{window.open(url)}}>
                                    <img src={GithubIcon}></img></button>
                                    
                                    
                        </div>

                        <div className={style.space}></div>
                            <img className={style.BridgeBlackLogo} src={BridgeBlackLogo} alt='브릿지 로고'></img>
                                <ul>
                                    <li>
                                        <a href="#">Legal policy</a>
                                    </li>
                                    <li>
                                        <a href="#">Status policy</a>

                                    </li>
                                    <li>
                                        <a href="#">Privacy policy</a>
                                    </li>
                                    <li>
                                        <a href="#">Terms of service</a>
                                    </li>
                                    {/* <li>
                                        <a href="#">About Us</a>
                                    </li> */}
                                </ul>




                    </div>
                    
                </footer>


            </>

        )
    }

    export default Footer;