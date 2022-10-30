import React from 'react';
import styled from 'styled-components';
import {Checkbox, Form, FormInstance, InputNumber, Slider} from "antd";
import {CaretRightOutlined, PauseOutlined} from '@ant-design/icons'
import AnimationButton from "./AnimationButton";

export interface IOptions {
    value: number | boolean
    label: string
    key: string
    col?: number
    slider?: any
    animation?: boolean
    type?: 'checkbox' | 'number' | 'slider'
    disabled?: boolean
}

interface IFormFieldProps {
    options: IOptions[]
    form: FormInstance<any>
    handleChange: (key: string, value: any) => void
}


const FormField = ({options, form, handleChange}: IFormFieldProps) => {

    return (
        <NumberFieldsStyled className="row">
            {options.map(({label, value, key, col, slider, animation, type, disabled}, idx) =>
                <div key={key} className={`col-${col || 6}`}>
                    <Form.Item
                        name={key.split('.').join('-')}
                        label={<>
                            {label}
                            {!!slider && !!animation &&
                                <AnimationButton item={options[idx]} form={form} handleChange={handleChange}/>}
                        </>}
                        initialValue={value}
                        className="item-container"
                        valuePropName={type === 'checkbox' ? "checked" : undefined}
                    >
                        {slider
                            ? <Slider {...slider}/>
                            : type === 'checkbox'
                                ? <Checkbox />
                                : <InputNumber disabled={!!disabled}/>}
                    </Form.Item>
                </div>
            )}
        </NumberFieldsStyled>
    )
};

const NumberFieldsStyled = styled.div`
  .ant-form-item-control-input-content {
    display: flex;
    align-items: center;

    & > div:last-child {
      flex: 1;
    }
  }

  .ant-form-item-label {
    display: flex;
    align-items: center;
  }
`

export default (FormField);
