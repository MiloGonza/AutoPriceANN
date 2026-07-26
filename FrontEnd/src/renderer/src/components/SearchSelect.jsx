/* eslint-disable react/prop-types */
import { useState, useRef, useEffect, useMemo } from "react"

export default function SearchSelect({ options = [], value, onChange, placeholder = "Buscar...", label, disabled = false }) {
	const [open, setOpen] = useState(false)
	const [query, setQuery] = useState("")
	const ref = useRef(null)
	const inputRef = useRef(null)

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false)
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	useEffect(() => {
		if (open) {
			setQuery("")
			setTimeout(() => inputRef.current?.focus(), 0)
		}
	}, [open])

	const filtered = useMemo(() => {
		if (!query) return options
		const q = query.toLowerCase()
		return options.filter((o) => o.toLowerCase().includes(q))
	}, [options, query])

	const handleSelect = (option) => {
		onChange(option)
		setOpen(false)
	}

	return (
		<div className="relative" ref={ref}>
			{label && <label className="text-sm text-muted-text mb-1 block">{label}</label>}
			<button
				type="button"
				onClick={() => !disabled && setOpen(!open)}
				disabled={disabled}
				className="w-full border rounded-xl border-dark-border focus:border-lime-accent bg-transparent px-3 py-2 text-left text-white placeholder-gray-500 flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed"
			>
				<span className={value ? "text-white" : "text-gray-500"}>
					{value || placeholder}
				</span>
				<svg
					className={`w-4 h-4 text-muted-text transition-transform ${open ? "rotate-180" : ""}`}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polyline points="6 9 12 15 18 9" />
				</svg>
			</button>

			{open && (
				<div className="absolute z-50 mt-1 w-full bg-dark-card border border-dark-border rounded-xl overflow-hidden shadow-lg">
					<div className="p-2">
						<input
							ref={inputRef}
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Escriba para filtrar..."
							className="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:border-lime-accent"
						/>
					</div>
					<ul className="max-h-48 overflow-y-auto px-2 pb-2">
						{filtered.length > 0 ? (
							filtered.map((option) => (
								<li key={option}>
									<button
										type="button"
										onClick={() => handleSelect(option)}
										className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
											option === value
												? "bg-lime-accent/15 text-lime-accent"
												: "text-white hover:bg-dark-hover"
										}`}
									>
										{option}
									</button>
								</li>
							))
						) : (
							<li className="px-3 py-2 text-sm text-muted-text">
								Sin resultados
							</li>
						)}
					</ul>
				</div>
			)}
		</div>
	)
}
