import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            {/* <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div> */}
            <div className="ml-1 flex justify-between items-center flex-1 text-left">
                <img src='/logo_prp.png' className='size-12' />
                <div className='flex flex-col gap-1 text-blue-700 dark:text-blue-400'>
                    <span className="mb-0.5 truncate leading-none font-semibold text-center">POLICLÍNICO</span>
                    <span className="mb-0.5 truncate leading-none font-semibold text-center">REYNA DE LA PAZ</span>
                </div>
            </div>
        </>
    );
}
