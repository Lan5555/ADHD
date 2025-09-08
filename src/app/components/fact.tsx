import { faClose, faLightbulb } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SizedBox from "../hooks/SizedBox";
import { ThemeColor } from "../static/colors";
import { useWatch } from "../hooks/page_index";

interface Prop {
  content: string;
}

const Fact: React.FC<Prop> = ({ content }) => {
  const { isVisible, setIsVisible } = useWatch();

  if (!isVisible) return null;

  return (
    <div
      className="w-[23rem] h-[40vh] relative flex flex-col justify-start items-center gap-2 rounded-4xl shadow-2xl pop-up"
      style={{
        boxShadow: ThemeColor.shadowLg,
        backgroundImage: "url(/blue.jpg)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <div
        className="w-full h-full relative flex flex-col justify-center items-start rounded-3xl p-4 gap-4"
        style={{ backdropFilter: "blur(5px)" }}
      >
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 w-8 h-8 bg-black rounded-full flex justify-center items-center shadow"
          onClick={() => setIsVisible(false)}
        >
          <FontAwesomeIcon icon={faClose} color="white" />
        </button>

        {/* Icon and Heading */}
        <div className="flex items-center gap-3">
          <FontAwesomeIcon
            icon={faLightbulb}
            color="orange"
            className="animate-bounce"
            style={{ width: "30px", height: "30px" }}
          />
          <h1 className="text-2xl text-orange-500 font-serif">
            DID YOU<br />KNOW?
          </h1>
        </div>

        {/* Content */}
        <p className="whitespace-pre-line break-words max-w-full text-sm text-black leading-relaxed">
          {content}
        </p>

        <SizedBox height={10} />

        {/* Bottom Section */}
        <div className="absolute bottom-5 left-4 right-4 flex justify-between items-center">
          <p className="text-black">Random fact</p>
          <img
            src="/dart.png"
            alt="dart icon"
            className="h-[50px] w-[50px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Fact;
