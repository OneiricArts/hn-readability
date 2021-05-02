import React from 'react';

export const Select = <T extends string | number>({
  options,
  onChange,
  value
}: {
  options: ReadonlyArray<T>;
  value: T;
  onChange: (t: T) => void;
}) => {
  return (
    <select
      value={value}
      onChange={e => onChange((e.target.value as unknown) as T)}
    >
      {options.map(opt => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
};
