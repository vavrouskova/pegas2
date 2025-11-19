import React from 'react';

import { BaseFormFieldProps } from '@/components/form-components/BaseForm';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export interface FormInputProps extends BaseFormFieldProps {
  type?: string;
  onBlur?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  inputClassName?: string;
}

const FormInput = (props: FormInputProps) => {
  const {
    name,
    placeholder,
    label,
    type = 'text',
    disabled = false,
    className,
    inputClassName,
    onBlur,
    tabIndex,
    required = false,
  } = props;

  return (
    <FormField
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={cn('flex flex-col', className)}>
            {label && <FormLabel className='font-heading text-primary text-base'>{label}</FormLabel>}
            <FormControl>
              <Input
                {...field}
                value={field.value || ''}
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                onBlur={onBlur}
                tabIndex={tabIndex}
                className={inputClassName}
              />
            </FormControl>
            <FormMessage className='text-sm text-red-600' />
          </FormItem>
        );
      }}
    />
  );
};

export default FormInput;
