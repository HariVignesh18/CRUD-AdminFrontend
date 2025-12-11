import React from 'react';
import { InputText, InputTextProps } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

interface InputTextWrapperProps extends InputTextProps {
    label?: string;
    error?: string;
    required?: boolean;
    containerClassName?: string;
}

const InputTextWrapper: React.FC<InputTextWrapperProps> = ({
    label,
    error,
    required,
    containerClassName,
    className,
    ...props
}) => {
    return (
        <div className={classNames('field', containerClassName)}>
            {label && (
                <label htmlFor={props.id} className={classNames({ 'p-error': error })}>
                    {label} {required && <span className="p-error">*</span>}
                </label>
            )}
            <InputText
                {...props}
                className={classNames(className, { 'p-invalid': error })}
            />
            {error && <small className="p-error">{error}</small>}
        </div>
    );
};

export default InputTextWrapper;
