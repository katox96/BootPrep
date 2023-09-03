import Icon from '@/components/icons/icons'
import Head from 'next/head';
import { signOut } from 'next-auth/react';

export const Header = () => {

    function home(){
        window.location.href = "/profile";
    }

    return(
        <header className="p-2 px-4 shadow-md sticky">
            <Head>
            <script src="https://code.jquery.com/jquery-3.6.4.min.js" integrity="sha256-oP6HI9z1XaZNBrJURtCoUT5SUnxFr8s3BzRl+cbzUq8=" crossorigin="anonymous"></script>
            <script src="/js/index.js"/>
            </Head>
            <div className="flex items-center">
                <div id="show-small-menu" className='mr-2'>
                    <Icon name={'Menu'} color={'black'} size={'30'} ></Icon>
                </div>
                <div id="close-small-menu" className='hidden mr-2'>
                    <Icon name={'X'} color={'black'} size={'30'}></Icon>
                </div>
                <div onClick={() => home()} className="font-bold text-2xl cursor-pointer">BootPrep</div>
            </div>
            <div id="small-menu" className="fixed container inset-0 top-14 z-1 animate-in slide-in-from-bottom-80 hidden shadow-lg rounded-md">
                <div className="relative grid z-2 rounded-md p-4 bg-white shadow-md">
                    <ul id="menu-list">
                        <li className="transition ease-in-out delay-150 p-2 cursor-pointer hover:bg-blue-300">
                            <button onClick={ signOut }>Sign Out</button>
                        </li>
                        <li className="transition ease-in-out delay-150 p-2 cursor-pointer hover:bg-blue-300">
                            <a href="#"> Contact Us </a>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
}