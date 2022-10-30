import React from 'react';
import styled from 'styled-components';
import {CaretRightOutlined, PauseOutlined} from "@ant-design/icons";
import {FormInstance} from "antd";
import {IOptions} from "./FormFields";

const TIME_UPDATE = 10

interface AnimationButtonProps {
    form: FormInstance<any>
    item: IOptions
    handleChange: (key:string, value: any) => void
}

const AnimationButton = ({form, item, handleChange}: AnimationButtonProps) => {

    const [isAnim, setIsAnim] = React.useState(false)
    const animRef = React.useRef<ReturnType<typeof setInterval>>()
    const direction = React.useRef<1 | -1>(1)

    const clickPlay = () => {

        // form.submit()

        const startInterval = () => {
            animRef.current = setInterval(() => {
                const key = item.key.split('.').join('-')
                let value = form.getFieldValue(key)
                if (value >= item.slider.max) direction.current = -1;
                if (value <= item.slider.min) direction.current = 1;

                value += direction.current * item.slider.step
                form.setFieldValue(key, value)
                handleChange(key, value)
            }, TIME_UPDATE)
        }

        if (!isAnim) { // play
            startInterval()
        } else { // pause
            clearInterval(animRef.current)
        }


        setIsAnim(!isAnim)
    }

    return (
        <AnimationButtonStyled onClick={() => clickPlay()}
                               className="btn-play ant-btn ant-btn-circle ant-btn-primary ant-btn-sm ant-btn-icon-only">
            {isAnim ? <PauseOutlined/> : <CaretRightOutlined/>}
        </AnimationButtonStyled>
    )
};

const AnimationButtonStyled = styled.button`
  margin-right: 5px;
  margin-left: 5px;
  //background-color: transparent;
  border: none;
  font-size: 16px;
  //border: 1px solid #000;
  //border-radius: 50%;
`

export default (AnimationButton);
