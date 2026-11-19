import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { AdminIcon } from '../AdminIcon';
import { BADGE_CLASSES, type NavItemDef } from '../../data/adminNavConfig';

interface Props {
  item: NavItemDef;
  isCollapsed: boolean;
  onCloseMobile: () => void;
}

export const SidebarNavItem: React.FC<Props> = ({ item, isCollapsed, onCloseMobile }) => {
  const location = useLocation();

  const isPublicView = item.href.includes('?view=');
  const isSettings = item.id === 'settings';
  const isActive = isSettings
    ? location.search.includes('settings')
    : isPublicView
      ? location.pathname + location.search === item.href
      : item.end
        ? location.pathname === item.href
        : location.pathname.startsWith(item.href);

  const badgeStyle = BADGE_CLASSES[item.badgeVariant || 'indigo'];

  return (
    <NavLink
      to={item.href}
      onClick={onCloseMobile}
      className={`group relative flex items-center rounded-xl transition-all duration-150 text-xs font-medium outline-none select-none ${
        isCollapsed ? 'justify-center p-2 mx-auto w-10 h-10' : 'px-2.5 py-1.5 gap-2.5 w-full'
      } ${
        isActive
          ? 'bg-gradient-to-r from-brand-indigo/15 via-brand-indigo/8 to-transparent border-l-[3px] border-brand-indigo text-foreground font-semibold shadow-xs'
          : 'text-foreground-muted hover:text-foreground hover:bg-surface-subtle/70'
      }`}
      title={isCollapsed ? item.label : undefined}
    >
      {/* Icon with glowing badge state */}
      <span
        className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-150 ${
          isActive
            ? 'bg-brand-indigo text-white shadow-sm shadow-brand-indigo/35 scale-105'
            : item.isAi
              ? 'bg-brand-violet/10 text-brand-violet group-hover:bg-brand-violet group-hover:text-white'
              : 'bg-surface-subtle/80 text-foreground-muted group-hover:bg-brand-indigo/10 group-hover:text-brand-indigo group-hover:scale-105'
        }`}
      >
        <AdminIcon name={item.icon} className="h-3.5 w-3.5" />
      </span>

      {/* Nav Label with subtle translation */}
      {!isCollapsed && (
        <span className="flex-1 truncate text-left group-hover:translate-x-0.5 transition-transform duration-150">
          {item.label}
        </span>
      )}

      {/* Item Action or Badge */}
      {!isCollapsed && item.hasMenu && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="p-0.5 rounded text-foreground-muted/60 hover:text-foreground"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      )}

      {!isCollapsed && item.badge && (
        <span className={`ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full border shadow-xs ${badgeStyle}`}>
          {item.badge}
        </span>
      )}

      {!isCollapsed && !item.badge && !item.hasMenu && (
        <ChevronRight className="h-3 w-3 text-foreground-muted/30 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      )}
    </NavLink>
  );
};

