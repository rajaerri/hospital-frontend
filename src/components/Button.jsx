import React from 'react';
import './Button.css';

/**
 * Reusable Button Component
 * 
 * Props:
 * - children: Button label or icon
 * - variant: 'primary' | 'secondary' | 'outline' | 'danger' | 'success'
 * - size: 'sm' | 'md' | 'lg'
 * - fullWidth: boolean (expands to 100% width)
 * - type: 'button' | 'submit' | 'reset'
 * - onClick: callback function
 * - disabled: boolean
 * - className: custom extra classes
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-block' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
