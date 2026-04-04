import Brand from "@/components/brand";
import NavLinks from "@/components/base/navLinks";
import { Container } from "@/components/Container";
import LoginDropdown from "@/components/login";
import { useMemo } from "react";

const baseMenuItems = [
    { name: "Marketplace", href: "/" },
    { name: "Create", href: "/create" },
    { name: "Staking", href: "/staking" },
    { name: "DAO", href: "/dao" },
    { name: "Token", href: "/token" },
];

const getDappMenu = () => {
    return baseMenuItems;
};


export default function Header() {

    const dappMenu = useMemo(() => getDappMenu(), []);


    return (
        <header className="w-full bg-black/70 backdrop-blur sticky top-0 z-50 border-b border-border/30">
            <Container className="py-3 flex items-center justify-between">
                <Brand />
                <nav className="flex gap-2 md:gap-4 lg:gap-5 items-center">
                    <NavLinks
                        links={dappMenu}
                    />
                    <LoginDropdown size="sm" />
                </nav>
            </Container>
        </header>
    );
}
