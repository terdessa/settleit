import React from 'react';
import { Input, InputProps } from './Input';

export interface DateTimePickerProps extends Omit<InputProps, 'type'> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  ...props
}) => {
  return (
    <Input
      type="datetime-local"
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};
