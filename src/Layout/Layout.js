import { Link } from 'react-router-dom';
import style from './Layout.module.css';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';

const Layout = () => {
    return (
        <>
            <div className={style.layout}>
                <Header/>

                <main className={style.main}>
                    
                </main>

                <Footer />
            </div>
     
        </>

    )
}

export default Layout;