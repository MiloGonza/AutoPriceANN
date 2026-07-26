function CrossHairIcon({ fill, stroke, size }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={`${size}em`}
            height={`${size}em`}
            viewBox="0 0 24 24"
        >
            <path
                d="M0 0h24v24H0z"
                fill="none"
            />
            <path
                fill={fill}
                stroke={stroke}
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2m8-16h2a2 2 0 0 1 2 2v2m-4 12h2a2 2 0 0 0 2-2v-2M9 12h6m-3-3v6" />
        </svg>

    )
}

export default CrossHairIcon