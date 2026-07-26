function HomeIcon({ fill, stroke, size }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={`${size}em`}
            height={`${size}em`}
            viewBox="0 0 24 24"
        >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
                fill={fill}
                stroke={stroke}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 19v-8.5a1 1 0 0 0-.4-.8l-7-5.25a1 1 0 0 0-1.2 0l-7 5.25a1 1 0 0 0-.4.8V19a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1"
            />
        </svg>
    )
}

export default HomeIcon;