function FolderIcon({ fill, stroke, size }) {
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
                d="M3 6a2 2 0 0 1 2-2h3.93a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 13.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
            />
        </svg>
    )
}

export default FolderIcon;