
interface colorProp {
    primary: string;
    secondary: string;
    background?: string;
    text?: string;
    red?: string;
    green?: string;
    blue?: string;
    yellow?: string;
    lightblue?: string;
    lightyellow?: string;
    pink?: string;
    lightgrey?: string;
    grey?: string;
    black?: string;
    white?: string;
    dark?: string;
    light?: string;
    transparent?: string;
    shadow?: string;
    shadowLight?: string;
    shadowDark?: string;
    shadowXg?: string;
    shadowLg?: string;
    shadowSm?: string;
    shadowXsm?: string;
    shadowXxsm?: string;
    shadowXxxsm?: string;
    shadowXxxxsm?: string;
    greyLight?: string;
    greyDark?: string;
    greyDarker?: string;
    violet?: string;
    violetLight?: string;
    violetDark?: string;
    darkMode?:string;
    darkShadow?:Record<any,any>
}
export const ThemeColor:colorProp  = {
    primary:'#5F29CC',
    secondary:'#FFFFFF',
    red:'#FF0000',
    green:'#00FF00',
    blue:'#0000FF',
    yellow:'#FFFF00',
    lightblue:'#ADD8E6',
    lightyellow:'#FFFFE0',
    pink:'#FFC0CB',
    lightgrey:'#D3D3D3',
    grey:'#808080',
    black:'#000000',
    white:'#FFFFFF',
    dark:'#333333',
    light:'#F0F0F0',
    transparent:'transparent',
    shadow:'#00000033',
    shadowLight:'#0000001A',
    shadowDark:'#00000066',
    shadowXg:'#0000004D',
    shadowLg:'#00000033',
    shadowSm:'#0000001A',
    greyLight:'#F5F5F5',
    greyDark:'#A9A9A9',
    greyDarker:'#696969',violet:'#8A2BE',
    violetLight:'#E6E6FA',
    violetDark:'#4B0082',
    darkMode: '#121212',
    darkShadow: {
        light:"0 4px 12px rgba(0,0,0,0.1)",
        heavy: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        transitionEnabled: 'transition: background-color 0.3s, box-shadow 0.3s',
        super:'box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8), 0 0 15px rgba(255, 255, 255, 0.1)'
    }
}

export const ThemeColorSpecific:Record<any, string> = {
    lightyellow: '#FFFFE0',
    lightblue: '#ADD8E6',
    pink: '#FFC0CB',
    lightgrey: '#D3D3D3',
}