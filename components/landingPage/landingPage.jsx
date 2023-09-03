import Icon from '@/components/icons/icons'
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import DemoQuiz from './demoQuiz';


export default function LandingPage({ demoQuestions }) {
    const { data, status } = useSession();

    if (status === 'authenticated'){
        window.location.href = "/profile";
        return;
    }

    return(
        <div>
            <header className="pl-4 container pr-4 pt-5 py-6">
                <div className="flex items-center">
                    <div id="show-small-menu" className='mr-2'>
                        <Icon name={'Menu'} color={'black'} size={'30'} ></Icon>
                    </div>
                    <div id="close-small-menu" className='hidden mr-2'>
                        <Icon name={'X'} color={'black'} size={'30'}></Icon>
                    </div>
                    <div className="font-bold text-xl">BootPrep</div>
                    <div className="ml-auto border-0 p-2 px-4 rounded-md bg-slate-100 cursor-pointer">
                        <button onClick={() => signIn('google')}>
                            Login
                        </button>
                    </div>
                </div>
                <div id="small-menu" className="fixed container inset-0 top-16 z-1 p-6 pb-32 animate-in slide-in-from-bottom-80 hidden shadow-lg rounded-md">
                    <div className="relative grid z-2 rounded-md p-4 bg-white shadow-md">
                        <ul id="menu-list">
                            <li className="transition ease-in-out delay-150 p-2 cursor-pointer hover:bg-blue-300">
                                <a href="#features"> Features </a>
                            </li>
                            <li className="transition ease-in-out delay-150 p-2 cursor-pointer hover:bg-blue-300">
                                <a href="#"> Practice Tests </a>
                            </li>
                            <li className="transition ease-in-out delay-150 p-2 cursor-pointer hover:bg-blue-300">
                                <a href="#"> Question Bank </a>
                            </li>
                            <li className="transition ease-in-out delay-150 p-2 cursor-pointer hover:bg-blue-300">
                                <a href="#"> Contact Us </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
            <main className="flex-1">
                <section className="flex space-y-6 pb-8 pt-6">
                    <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center m-auto">
                        <div className="p-1 px-4 rounded-2xl  border-gray-800 border cursor-pointer text-sm mb-4 font-bold text-[15px] shadow-md">
                            <button>21,000+ Questions</button>
                        </div>
                        <h1 className=" font-semibold text-3xl">
                            The only competitive exam prep tool you need
                        </h1>
                        <p className="text-slate-500  text-justify-left leading-normal font-extralight pb-2 mt-4">
                            Ace your exams with our complete test prep solution. Practice tests, question bank, and online test series with leader-boards. Prepare with confidence, succeed with ease!
                        </p>
                        <div className="space-x-4 mt-10">
                            <a onClick={() => signIn('google')} className="ml-auto border shadow-purple-500 border-1 p-3 px-7 rounded-lg cursor-pointer shadow-md">Sign Up</a>
                            <a className="bg-black text-white border-1 p-3 px-6 shadow-green-500 rounded-lg cursor-pointer shadow-md">Mock Test</a>
                        </div>
                    </div>
                </section>
                <section id="demo-questions" className=" pb-10">
                    <div className="mx-auto grid justify-center gap-4 pt-8">
                        <div className="relative bg-white rounded-lg border bg-background">
                            <div className="flex flex-col justify-between rounded-md p-4 bg-slate-50 ">
                                <DemoQuiz demoQuestions={ demoQuestions }></DemoQuiz>
                            </div>
                        </div>
                    </div>
                </section>
                <section id="features" className="mt-3 container space-y-6 bg-gray-800 py-8">
                    <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                        <h2 className="text-center text-white font-heading text-3xl font-semibold leading-[1.1] sm">
                            Features
                        </h2>
                        <p className="max-w-[85%] leading-normal text-white font-extralight">
                            Here at MockDude our only mission is to help aspirants ease the exam prepration. Our plateform exclusively offers the following features.
                        </p>
                    </div>
                    <div className="mx-auto grid gap-4 md:grid-cols-2">
                        <div className="relative flex flex-row overflow-hidden bg-white rounded-lg border bg-background max-h-[13rem] shad">
                            <div className=" w-32  bg-blue-100">
                                <Image src="/icons/exam.png" width={80} height={70} className="p-2 ml-5 my-8"></Image>
                            </div>
                                <div className="w-52 p-2 space-y-2">
                                    <h3 className="font-bold flex items-center justify-center">Previous Year Papers</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Bridge the gap between preparation and success with the help of previous year papers.
                                    </p>
                                </div>
                        </div>
                        <div className="relative flex flex-row overflow-hidden bg-white rounded-lg border bg-background max-h-[13rem] shad">
                            <div className=" w-32 bg-blue-100">
                                <Image src="/icons/flask.png" width={80} height={70} className="p-2 ml-5 my-8"></Image>
                            </div>
                                <div className="w-52 p-2 space-y-2">
                                    <h3 className="font-bold flex items-center justify-center">Test Series</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Enhance your exam readiness with our meticulously crafted test series that offers a diverse range of practice tests.
                                    </p>
                                </div>
                        </div>
                        <div className="relative flex flex-row overflow-hidden bg-white rounded-lg border bg-background max-h-[13rem] shad">
                            <div className="w-32 bg-blue-100">
                                <Image src="/icons/mock.png" width={80} height={70} className="p-2 ml-5 my-8"></Image>
                            </div>
                                <div className="w-52 p-2 space-y-2">
                                    <h3 className="font-bold flex items-center justify-center">Mock Tests</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Get a taste of our test series with an invigorating mock test that mirrors the difficulty level and structure of the real exam.
                                    </p>
                                </div>
                        </div>
                        <div className="relative flex flex-row overflow-hidden bg-white rounded-lg border bg-background max-h-[13rem] shad">
                            <div className=" w-32 bg-blue-100">
                                <Image src="/icons/target.png" width={80} height={70} className="p-2 ml-5 my-8"></Image>
                            </div>
                                <div className="w-52 p-2 space-y-2">
                                    <h3 className="font-bold flex items-center justify-center">Question Bank</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Unleash your potential with a vast question bank tailored to meet your specific exam prepration needs.
                                    </p>
                                </div>
                        </div>
                    </div>
                </section>
            </main>
            <section className="pl-6 container pr-6 pt-6 py-6">
                <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                    <h2 className="text-center font-heading text-3xl font-semibold leading-[1.1] sm">
                        Good Luck!
                    </h2>
                    <p className="max-w-[85%] leading-normal text-slate-500 font-extralight">
                        We are committed to serve you <br/> with our best quality  <br/> content for your exam prep.
                    </p>
                </div>
            </section>
            <footer className="container items-center text-center py-4 bg-slate-200">
                <h1 className="font-bold">
                    BootPrep©
                </h1>
            </footer>
        </div>
    )
}