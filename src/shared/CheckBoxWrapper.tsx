import React from 'react';
import { Checkbox, CheckboxProps } from 'primereact/checkbox';
import { classNames } from 'primereact/utils';

interface CheckBoxWrapperProps extends CheckboxProps {
    label?: string;
    error?: string;
    required?: boolean;
    containerClassName?: string;
}

const CheckBoxWrapper: React.FC<CheckBoxWrapperProps> = ({
    label,
    error,
    required,
    containerClassName,
    className,
    ...props
}) => {
    return (
        <div className={classNames('field-checkbox', containerClassName)}>
            <Checkbox
                {...props}
                className={classNames(className, { 'p-invalid': error })}
            />
            {label && (
                <label htmlFor={props.inputId} className={classNames({ 'p-error': error })}>
                    {label} {required && <span className="p-error">*</span>}
                </label>
            )}
            {error && <small className="p-error block">{error}</small>}
        </div>
    );
};

export default CheckBoxWrapper;
