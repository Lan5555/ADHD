import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { CSSProperties } from "@mui/material";

interface props{
    leading:React.ReactNode;
    title:String;
    trailing?:any;
    subtitle?:String;
    onLeadingPressed?:() => void;
    onTrailingPressed?:() => void;
    type:'pack' | 'trail',
    Bold?:boolean
    marginLeft?:number;
    marginRight?:number;
    titleStyle?:React.CSSProperties;
    subtitleStyle?:React.CSSProperties;
    trailPack?:any
    isUnderline?:boolean;
    design?:CSSProperties
}
const ListTile:React.FC<props> = ({leading,title,trailing,onLeadingPressed,onTrailingPressed,subtitle,type, Bold,marginLeft,marginRight,titleStyle,subtitleStyle,trailPack,isUnderline, design}) => {
    return <div className="w-full flex justify-between items-center p-3" style={{
        borderBottom: isUnderline ? '1px solid rgba(0,0,0,0.1)' : '',
        cursor: 'pointer',
        marginLeft: marginLeft
        ? `${marginLeft}px`
        : '0',
        marginRight: marginRight
        ? `${marginRight}px`
        : '0',
        ...design
    }}>
        <div className="flex justify-center items-center gap-2">
            {leading}
            <div className="flex flex-col gap-1">
                <p style={{
                    fontWeight: Bold ? 'bold' : '',
                    fontSize: titleStyle?.fontSize || '',
                }}>{title}</p>
                {subtitle && (<small className="opacity-50 text-sm" style={{
                    fontSize: subtitleStyle?.fontSize || '',
                    color: subtitleStyle?.color || 'black',
                }}>{subtitle}</small>)}
            </div>
            {type === 'pack' ? trailing : null}
        </div>
        {type === 'trail' ? trailing : type ==='pack' && trailPack ? trailPack : null}
    </div>
}
export default ListTile;