import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { useSettings } from '@/providers';
import { IKeenIconsProps } from './types';
import { toAbsoluteUrl } from '@/utils/Assets';

// Custom icon mapping - add your custom icons here
const CUSTOM_ICONS: Record<string, string> = {
  'microphone-2': '/media/icons/microphone.svg', // Custom microphone icon
  // Add more custom icons here as needed
};

// KeenIcon using forwardRef to pass the ref and spread props
export const KeenIcon = forwardRef<HTMLElement, IKeenIconsProps>(
  ({ icon, style, className = '', ...props }, ref) => {
    const { settings } = useSettings();

    // Check if this is a custom icon
    if (CUSTOM_ICONS[icon]) {
      // Render custom icon as an inline SVG or img
      return (
        <img
          ref={ref as any}
          {...(props as any)}
          src={toAbsoluteUrl(CUSTOM_ICONS[icon])}
          alt={icon}
          className={clsx('inline-block', className)}
          style={{
            width: '1em',
            height: '1em',
            ...((props as any).style as React.CSSProperties | undefined),
          }}
        />
      );
    }

    if (!style) {
      style = settings.keeniconsStyle;
    }

    // Spread props and apply the ref to the <i> element for standard KeenIcons
    return (
      <i
        ref={ref}
        {...props}
        className={clsx(`ki-${style}`, `ki-${icon}`, className)}
      />
    );
  },
);
