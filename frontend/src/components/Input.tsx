interface InputProps {
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  label?: string;
}

const Input = ({ type, placeholder, value, onChange, required = false, label }: InputProps) => {
  return (
    <div className="mb-3">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="form-control"
      />
    </div>
  );
};

export default Input;
