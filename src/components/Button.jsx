import './Button.css';

const VARIANT_CLASS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
  ghost: 'btn-ghost',
  icon: 'btn-icon',
  link: 'btn-link',
  pill: 'btn-pill',
  status: 'btn-status',
};

export default function Button({
  variant = 'primary',
  tone,
  active = false,
  className = '',
  children,
  ...rest
}) {
  const classes = ['btn', VARIANT_CLASS[variant] || VARIANT_CLASS.primary]
    .concat(tone ? `tone-${tone}` : [])
    .concat(active ? 'is-active' : [])
    .concat(className || [])
    .join(' ');

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
