import style from './BackToTop.module.css';
import { useEffect, useState } from "react";
import { Icon } from '@iconify/react';


function BackToTop() {

    const [showButton, setShowButton] = useState(false);

    const scrollToTop = () => {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        })

    }
    useEffect(() => {
        const handleShowButton = () => {
            if (window.scrollY > 500) {
                setShowButton(true)
            } else {
                setShowButton(false)
            }
        }

        console.log(window.scrollY)
        window.addEventListener("scroll", handleShowButton)
        return () => {
            window.removeEventListener("scroll", handleShowButton)
        }
    }, [])

    return showButton && (
        <div className={style.scroll_container}>
            <button id={style.top} onClick={scrollToTop} type="button" > 
            <Icon icon="iconamoon:arrow-up-1-thin" width="32" height="32"/> </button>
            
        </div>

    )
}


export default BackToTop;




