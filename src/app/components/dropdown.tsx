import { ReactNode, useState, useEffect } from "react";

interface Props {
  target: HTMLElement;
  children: ReactNode;
  className?:string
}

const DropDown: React.FC<Props> = ({ target, children , className}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (target) {
      const rect = target.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [target]);

  return (
    <div
      className={`rounded w-72 h-auto shadow z-20 bg-white p-1 ${className}`}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
      }}
    >
      {children}
    </div>
  );
};

export default DropDown;
