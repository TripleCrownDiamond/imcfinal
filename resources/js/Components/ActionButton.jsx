export default function ActionButton({
    actionType = 'confirm', // 'confirm' or 'cancel'
    className = '',
    disabled,
    children,
    ...props
}) {
    const getButtonStyles = () => {
        switch (actionType) {
            case 'confirm':
                return `bg-green-500 hover:bg-green-600 focus:bg-green-600 active:bg-green-700 focus:ring-green-500`;
            case 'cancel':
                return `bg-red-500 hover:bg-red-600 focus:bg-red-600 active:bg-red-700 focus:ring-red-500`;
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <button
            {...props}
            className={
                `inline-flex items-center rounded-[30px] border border-transparent 
                px-7 py-3.5 text-xs font-semibold uppercase tracking-widest text-white 
                transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 
                active:bg-gray-900 ${getButtonStyles()} ` +
                (disabled ? 'opacity-25' : '') +
                ` ${window.innerWidth < 640 ? 'px-6 py-3' : 'px-7 py-3.5'}` +
                className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
