function DatabaseIcon({ fill, stroke, size }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={`${size}em`}
            height={`${size}em`}
            viewBox="0 0 24 24"
        >
            <path d="M0 0h24v24H0z" fill="none" />
            <ellipse
                cx="12"
                cy="5"
                rx="9"
                ry="3"
                fill={fill}
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="M3 5v14a9 3 0 0 0 18 0V5"
                fill="none"
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
            <path
                d="M3 12a9 3 0 0 0 18 0"
                fill="none"
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
            />
        </svg>
    )
}

export default DatabaseIcon;
