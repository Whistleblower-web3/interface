
import { Link } from "react-router-dom";
import { ProjectName } from "./projectName";
import "./index.css";
import { twMerge } from 'tailwind-merge';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string
}

export default function Brand({ size = 'md', className }: Props) {
    const sizeMap = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
        xl: 'w-14 h-14'
    }

    const textSizeMap = {
        sm: 'text-[10px] md:text-xs lg:text-sm',
        md: 'text-xs md:text-sm lg:text-base',
        lg: 'text-sm md:text-base lg:text-lg',
        xl: 'text-base md:text-lg lg:text-xl'
    }

    return (
        <Link to="https://wikitruth.xyz">
            <div className={twMerge("flex flex-row items-center gap-2", className)}>
                <div className={twMerge("rounded-xl flex items-center justify-center transition-all", sizeMap[size])}>
                    <div
                        className="logo-mask h-full w-full bg-primary"
                        role="img"
                        aria-label="Logo"
                    />
                </div>
                <div className="flex flex-col">
                    <ProjectName size={size} />
                    <p className={twMerge("text-white/50 tracking-wider", textSizeMap[size])}>
                        Whistleblower-web3
                    </p>

                </div>
            </div>
        </Link>
    );
}


