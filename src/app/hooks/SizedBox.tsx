export type float = number;

interface Props{
    width?:float
    height?:float
}

const SizedBox:React.FC<Props> = ({width,height}) => {
    return <div style={{
        height:`${height}px`,
        width:`${width}px`
    }}></div>
}
export default SizedBox;