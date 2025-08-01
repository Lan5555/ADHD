interface props{
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}

const Fab: React.FC<props> = ({ className, style, onClick }) => {
    return (
        <button
            className={`fixed bottom-4 right-2 w-16 h-16 rounded-full shadow-lg flex justify-center items-center ${className}`}
            style={{
                backgroundColor: 'blueviolet',
                color: 'white',
                ...style,
            }}
            onClick={onClick}
        >
            <span className="text-2xl">+</span>
        </button>
    );
};

export default Fab;

