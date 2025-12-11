import React from 'react';
import { InputTextarea, InputTextareaProps } from 'primereact/inputtextarea';
import { classNames } from 'primereact/utils';

interface InputTextAreaWrapperProps extends InputTextareaProps {
    label?: string;
    error?: string;
    required?: boolean;
    containerClassName?: string;
}

const InputTextAreaWrapper: React.FC<InputTextAreaWrapperProps> = ({
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
            <InputTextarea
                {...props}
                className={classNames(className, { 'p-invalid': error })}
            />
            {error && <small className="p-error">{error}</small>}
        </div>
    );
};

export default InputTextAreaWrapper;
