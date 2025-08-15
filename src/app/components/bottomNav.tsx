import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { ThemeColor } from "../static/colors";
import { useWatch } from "../hooks/page_index";

interface Props {
  icons: IconDefinition[] | any[];
  labels: string[];
  onPressed?: (index: number) => void;
  type: 'icon' | 'image'
}

const BottomNav: React.FC<Props> = ({ icons, labels, onPressed , type}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const [showColor, setShowColor] = useState<boolean>(false);
  const {darkMode} = useWatch();


  return (
    <div className="w-full shadow-xg flex justify-around items-center h-16 fixed bottom-0 bg-white z-40" style={
      {
        backgroundColor: darkMode ? ThemeColor.darkMode : 'white',
        boxShadow: darkMode ? ThemeColor.darkShadow!.heavy : 'white'
      }
    }>
      {icons.map((icon, index) => {
        const isSelected = selectedIndex === index;
        return (
          <div
            key={index}
            className="flex flex-col items-center gap-1 cursor-pointer"
            onClick={() => {
              setShowColor(true);
              setSelectedIndex(index);
              if (onPressed) {
                onPressed(index);
              }
              setTimeout(() => {
                setShowColor(false);
              }, 300); // Hide color after 0.5 seconds
            }}
            style={{
                backgroundColor: showColor && isSelected ? ThemeColor.primary : 'transparent',
                transition: 'background-color 0.5s ease',
                padding: '10px',
                borderRadius: '20px',
                transform: isSelected ? 'scale(1.1)' : 'scale(1)',
            }}
          >
           {type == 'icon' ? ( <FontAwesomeIcon
              icon={icon}
              style={{
                color:isSelected ? 'blue':'lightgrey',
              }}
              
            />) : (<img src={icon} style={{
                height:'20px',
                width:'20px',
                opacity: !isSelected ? 0.5 : 1
            }}/>)}
            <small style={{
                color:isSelected ? 'blue' : 'lightgrey',
            }}>
              {labels[index]}
            </small>
          </div>
        );
      })}
    </div>
  );
};

export default BottomNav;
