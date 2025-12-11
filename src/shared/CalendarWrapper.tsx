import React from 'react';
import { Calendar, CalendarProps } from 'primereact/calendar';
import { classNames } from 'primereact/utils';

interface CalendarWrapperProps extends CalendarProps {
    label?: string;
    error?: string;
    required?: boolean;
    containerClassName?: string;
}

const CalendarWrapper: React.FC<CalendarWrapperProps> = ({
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
            <Calendar
                {...props}
                className={classNames(className, { 'p-invalid': error })}
            />
            {error && <small className="p-error">{error}</small>}
        </div>
    );
};

export default CalendarWrapper;
