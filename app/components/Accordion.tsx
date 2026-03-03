"use client";

import { useState, useRef, useEffect } from "react";

interface AccordionProps {
  question: string;
  answer: string;
}

export default function Accordion({ question, answer }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? `${contentRef.current.scrollHeight}px` : "0px");
    }
  }, [isOpen]);

  return (
    <div className="mb-6 text-black bg-[#E5E1E1] border border-gray-300 rounded-2xl">
      <button
        className="w-full text-left p-4 font-semibold bg-[#DADADA] hover:bg-gray-200 rounded-2xl shadow-lg transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {question}
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: height }}
        className="overflow-hidden duration-300 ease-in-out bg-[#E5E1E1] rounded-b-2xl shadow-inner transition-max-height"
      >
        <div className="p-4">
          <p className="text-black">{answer}</p>
        </div>
      </div>
    </div>
  );
}
