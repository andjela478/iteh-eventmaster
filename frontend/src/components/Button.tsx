interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

const Button = ({ text, onClick, type = 'button', variant = 'primary', disabled = false }: ButtonProps) => {
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn ${variantClasses[variant]}`}
    >
      {text}
    </button>
  );
};

export default Button;
