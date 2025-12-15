import React from 'react';

import { BaseFormFieldProps } from '@/components/form-components/BaseForm';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export interface FormTextareaProps extends BaseFormFieldProps {
  // eslint-disable-next-line no-unused-vars
  onBlur?: (blurEvent: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  required?: boolean;
}

const FormTextarea = (props: FormTextareaProps) => {
  const { name, placeholder, label, disabled = false, className, rows = 5 } = props;

  return (
    <FormField
      name={name}
      render={({ field }) => {
        return (
          <FormItem className={cn('flex flex-col', className)}>
            {label && <FormLabel className='font-heading text-primary text-base'>{label}</FormLabel>}
            <FormControl>
              <Textarea
                {...field}
                value={field.value || ''}
                placeholder={placeholder}
                disabled={disabled}
                rows={rows}
              />
            </FormControl>
            <FormMessage className='text-sm text-red-600' />
          </FormItem>
        );
      }}
    />
  );
};

export default FormTextarea;
