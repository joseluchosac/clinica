import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            {/* <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div> */}
            <div className="text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-md">
                <img src='/logo_prp.png' />
            </div>
            <div className='flex flex-col text-blue-700 dark:text-blue-400 font-ptserif font-bold ml-6 text-[0.95rem]'>
                <span className="mb-0.5 truncate leading-none font-semibold text-center">POLICLÍNICO</span>
                <span className="mb-0.5 truncate leading-none font-semibold text-center">REYNA DE LA PAZ</span>
            </div>
        </>
    );
}
