import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export interface NavLinkItem {
  name: string;
  href: string;
  target?: string;
}

interface NavLinksProps {
  links: NavLinkItem[];
  className?: string;
}

function isExternalLink(link: NavLinkItem) {
  return link.target === '_blank' || !link.href.startsWith('/');
}

const NavLinks: React.FC<NavLinksProps> = ({ links, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const isActive = (path: string) => location.pathname === path;

  const renderLink = (link: NavLinkItem, mobile?: boolean, onNavigate?: () => void) => {
    const external = isExternalLink(link);
    const rowClass = mobile ? 'rounded-lg px-3 py-2 hover:bg-surface-high/80' : '';

    if (external) {
      return (
        <a
          key={`${link.name}-${link.href}`}
          href={link.href}
          target={link.target === '_blank' ? '_blank' : undefined}
          rel={link.target === '_blank' ? 'noopener noreferrer' : undefined}
          onClick={onNavigate}
          className={twMerge(
            'text-[13px] font-medium tracking-wider hover:text-primary',
            'transition-colors flex items-center gap-1 group',
            rowClass
          )}
        >
          {link.name}
          <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-0.5" />
        </a>
      );
    }

    const active = isActive(link.href);
    return (
      <Link
        key={`${link.name}-${link.href}`}
        to={link.href}
        onClick={onNavigate}
        className={twMerge(
          'text-[13px] font-medium tracking-wider transition-all relative py-1',
          active ? 'text-primary' : ' hover:text-white',
          rowClass
        )}
      >
        {link.name}
        {active && !mobile && (
          <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_rgba(19,236,91,0.6)]" />
        )}
      </Link>
    );
  };

  return (
    <div className={twMerge('relative flex items-center justify-end md:justify-center', className)}>
      <div className="hidden md:flex items-center gap-10">
        {links.map((link) => renderLink(link))}
      </div>

      <button
        type="button"
        className="md:hidden rounded-lg p-2 hover:bg-surface-high transition-colors -mr-1"
        aria-expanded={isOpen}
        aria-controls="mobile-nav"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setIsOpen((v) => !v)}
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="md:hidden fixed inset-0 z-40 bg-black/40"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
          />
          <div
            id="mobile-nav"
            className="w-full md:hidden absolute right-0 top-full z-50 mt-2 min-w-48 flex flex-col gap-0.5 rounded-xl border border-primary/30 bg-surface-high/90 p-2 shadow-lg backdrop-blur-xl"
          >
            {links.map((link) => renderLink(link, true, () => setIsOpen(false)))}
          </div>
        </>
      )}
    </div>
  );
};

export default NavLinks;
