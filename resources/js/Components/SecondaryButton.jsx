export default function SecondaryButton({
    type = 'button',
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            type={type}
            className={
                `inline-flex items-center rounded-[30px] border border-gray-300 bg-black justify-center text-center 
                px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white shadow-sm 
                transition duration-150 ease-in-out hover:bg-[#cd8b76] focus:bg-[#cd8b76] 
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                disabled:opacity-25 ${
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
