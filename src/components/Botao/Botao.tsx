import { ButtonHTMLAttributes, MouseEvent } from 'react';
import style from './Botao.module.scss'


interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success';
    size?:  'exsmall' | 'small' | 'medium' | 'large' | 'fullSize';
    children: React.ReactNode,
    backgroundColor?: string;
    borderColor?: string;
    type?: 'submit' | 'button';
}

export default function Botao({ variant = 'primary', size = 'medium', children, backgroundColor, borderColor, onClick, type = 'submit'}: BotaoProps){

    return(
        <button 
            type="button"
            className={[style.botao, style[`botao__${variant}`], style[`botao__${size}`]].join(' ')}
            style={{ backgroundColor, borderColor }}
            onClick={onClick}
        >
           {children}
        </button>
    );
}