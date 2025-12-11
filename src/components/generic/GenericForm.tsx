import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { InputSwitch } from 'primereact/inputswitch';

import { filterEditableColumns } from '../../utils/columnFilters';

interface ColumnMeta {
    name: string;
    type: string;
    nullable: boolean;
    isPrimaryKey: boolean;
    isAutoIncrement: boolean;
    ui: {
        widget: string;
        label: string;
    };
}

interface GenericFormProps {
    visible: boolean;
    onHide: () => void;
    onSave: () => void;
    isEdit: boolean;
    metadata: ColumnMeta[];
    formData: any;
    setFormData: (data: any) => void;
}

const GenericForm: React.FC<GenericFormProps> = ({
    visible,
    onHide,
    onSave,
    isEdit,
    metadata,
    formData,
    setFormData,
}) => {
    const renderInput = (col: ColumnMeta) => {
        const value = formData[col.name];

        switch (col.ui.widget) {
            case 'number':
                return (
                    <div className="field" key={col.name}>
                        <label htmlFor={col.name} className="block mb-2">
                            {col.ui.label} {!col.nullable && <span className="text-red-500">*</span>}
                        </label>
                        <InputNumber
                            id={col.name}
                            value={value}
                            onValueChange={(e) => setFormData({ ...formData, [col.name]: e.value })}
                            useGrouping={false}
                            className="w-full"
                        />
                    </div>
                );
            case 'textarea':
                return (
                    <div className="field" key={col.name}>
                        <label htmlFor={col.name} className="block mb-2">
                            {col.ui.label} {!col.nullable && <span className="text-red-500">*</span>}
                        </label>
                        <InputTextarea
                            id={col.name}
                            value={value || ''}
                            onChange={(e) => setFormData({ ...formData, [col.name]: e.target.value })}
                            rows={3}
                            className="w-full"
                        />
                    </div>
                );
            case 'switch':
                return (
                    <div className="field field-checkbox" key={col.name}>
                        <InputSwitch
                            id={col.name}
                            checked={!!value}
                            onChange={(e) => setFormData({ ...formData, [col.name]: e.value })}
                        />
                        <label htmlFor={col.name} className="ml-2">
                            {col.ui.label}
                        </label>
                    </div>
                );
            case 'date':
                return (
                    <div className="field" key={col.name}>
                        <label htmlFor={col.name} className="block mb-2">
                            {col.ui.label} {!col.nullable && <span className="text-red-500">*</span>}
                        </label>
                        <Calendar
                            id={col.name}
                            value={value ? new Date(value) : null}
                            onChange={(e) => setFormData({ ...formData, [col.name]: e.value })}
                            showIcon
                            className="w-full"
                        />
                    </div>
                );
            default: // text
                return (
                    <div className="field" key={col.name}>
                        <label htmlFor={col.name} className="block mb-2">
                            {col.ui.label} {!col.nullable && <span className="text-red-500">*</span>}
                        </label>
                        <InputText
                            id={col.name}
                            value={value || ''}
                            onChange={(e) => setFormData({ ...formData, [col.name]: e.target.value })}
                            className="w-full"
                        />
                    </div>
                );
        }
    };

    const renderFormFields = () => {
        return filterEditableColumns(metadata).map(col => renderInput(col));
    };

    const footer = (
        <div>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={onHide}
            />
            <Button
                label="Save"
                icon="pi pi-check"
                className="p-button-text"
                onClick={onSave}
            />
        </div>
    );

    return (
        <Dialog
            visible={visible}
            style={{ width: '600px' }}
            header={isEdit ? 'Edit Record' : 'New Record'}
            modal
            className="p-fluid"
            footer={footer}
            onHide={onHide}
        >
            <div className="grid">
                <div className="col-12">
                    {renderFormFields()}
                </div>
            </div>
        </Dialog>
    );
};

export default GenericForm;
