import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const AccordionItem = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className=" rounded-md mb-2 overflow-hidden transition-all">
      <button
        onClick={onToggle}
        className="w-full text-left px-4 py-2 hover:bg-foreground dark:hover:bg-d_foreground focus:outline-none flex justify-between"
      >
        <h3 className="font-semibold text-xl">{title}</h3>
        <KeyboardArrowDownIcon
          className={`ml-auto transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          isOpen ? "max-h-fit" : "max-h-0"
        }`}
      >
        <div className="px-4 py-2 w-full">{children}</div>
      </div>
    </div>
  );
};

export default function AccordionBasic({title, children}) {
  const [openIndex, setOpenIndex] = useState(null);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? null : index); // Toggle the accordion
  };

  return (
    <div className="">
      <AccordionItem
        title={title}
        isOpen={openIndex === 0}
        onToggle={() => handleToggle(0)}
      >
        {children}
      </AccordionItem>
    </div>
  );
}
