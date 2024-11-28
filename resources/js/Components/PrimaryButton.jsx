export default function PrimaryButton({
    className = '',
    disabled,
    processing,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-[30px] border border-transparent bg-[#88ae75] justify-center text-center 
                px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white 
                transition duration-150 ease-in-out hover:bg-[#cd8b76] 
                focus:bg-[#cd8b76] focus:outline-none focus:ring-2 focus:ring-indigo-500 
                focus:ring-offset-2 active:bg-gray-900 ${
                    disabled ? 'opacity-25' : ''
                } ` +
                className +
                ` ${window.innerWidth < 640 ? 'px-6 py-3' : 'px-7 py-3.5'}`
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
