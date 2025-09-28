import React from 'react';
import style from './LoginStart.module.css';
import BridgeWhiteMainLogo from './BridgeWhiteLOGO.png';
import { NavLink } from 'react-router-dom';

function LoginStart() {
    return (
        
        <div className={style.login}>
            <img src={BridgeWhiteMainLogo} 
            alt="MainBridgeLOGO"/>
            <NavLink exact activeClassName="active" to="/login">LOGIN TO BRIDGE</NavLink>
        </div>
        
    )
}

export default LoginStart;