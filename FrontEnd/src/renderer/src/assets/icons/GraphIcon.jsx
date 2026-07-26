function GraphIcon({ fill, stroke, size }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={`${size}em`}
            height={`${size}em`}
            viewBox="0 0 24 24"
        >
            <path
                d="M0 0h24v24H0z"
                fill={fill}
            />
            <g
                fill={fill}
                stroke={stroke}
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
            >
                <path
                    d="M3.5 4v13.5a3 3 0 0 0 3 3H20"
                />
                <path
                    d="m6.5 15l4.5-4.5l3.5 3.5L20 8.5"
                />
            </g>
        </svg>

    )
}

export default GraphIcon;