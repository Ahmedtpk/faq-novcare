"use client";

import { useState, useRef, useEffect } from "react";
import { ContentfulAccordionItem } from "@/types/contentful/accordion";

interface AccordionProps {
  items?: ContentfulAccordionItem[];
}

interface AccordionItemCardProps {
  question: string;
  answer: string;
}

function AccordionItemCard({ question, answer }: AccordionItemCardProps) {
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

export default function Accordion({ items = [] }: AccordionProps) {
  if (items.length === 0) {
    return <p className="text-center text-gray-500">No accordion items found</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <AccordionItemCard
          key={`${item.sys?.id ?? item.internalName ?? item.name ?? "accordion-item"}-${index}`}
          question={item.name ?? ""}
          answer={item.text ?? ""}
        />
      ))}
    </div>
  );
}
