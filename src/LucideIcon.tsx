import {
	ChevronDown,
	ChevronUp,
	CircleCheckBig,
	CircleX,
	Github,
	Home,
	Linkedin,
} from 'lucide-solid'

export type LucideProps = {
	size?: number
	strokeWidth?: number
	class?: string
}

export const Expand = ChevronDown

export const Collapse = ChevronUp

export const Homepage = Home

export const LinkedIn = Linkedin

export const GitHub = Github

export const OK = CircleCheckBig

export const Error = CircleX
