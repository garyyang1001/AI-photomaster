import React from 'react';

interface SelectInputProps {
  label?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

const SelectInput: React.FC<SelectInputProps> = ({ label, name, value, onChange, options }) => (
  <div className="flex flex-col w-full">
    {label && <label htmlFor={name} className="mb-1 text-sm font-medium text-slate-400">{label}</label>}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-slate-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition duration-150 appearance-none bg-no-repeat bg-right pr-8"
      style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundSize: '1.5em 1.5em'
      }}
    >
      {options.map(option => (
        <option key={option.value} value={option.value} className="bg-slate-800 text-slate-200">
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectInput;