import React from 'react';
import { Dropdown, DropdownProps } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';

interface DropdownWrapperProps extends DropdownProps {
    label?: string;
    error?: string;
    required?: boolean;
    containerClassName?: string;
}

const DropdownWrapper: React.FC<DropdownWrapperProps> = ({
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
            <Dropdown
                {...props}
                className={classNames(className, { 'p-invalid': error })}
            />
            {error && <small className="p-error">{error}</small>}
        </div>
    );
};

export default DropdownWrapper;
