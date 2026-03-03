import { client, getFAQs } from "@/lib/contentful";
import Accordion from "@/components/Accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AccordionEntry } from "./types/contentful/accordion";

async function getAccordionData() {
  try {
    const response = await getFAQs();
    if (!response) {
      return [];
    }
    return response as AccordionEntry[] | [];
  } catch (error) {
    console.error("Error fetching accordion data:", error);
    return [];
  }
}

export default async function Home() {

  const accordionData = await getAccordionData();

  const accordion = accordionData[0];

  // Null check for accordion data
  if (!accordion) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            No accordion data found
          </h1>
        </div>
      </main>
    );
  }

  const { title, accordionItems } = accordion.fields;

  return (
    <main className="flex min-h-screen flex-col bg-gray-100 ">
      <Header />

      <div className="w-full max-w-3xl mx-auto ">
        {/* Title section */}
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          {title || "FAQ"}
        </h1>

        {/* Accordion items */}
        <div className="space-y-4">
          {accordionItems && accordionItems.length > 0 ? (
            accordionItems.map((item) => (
              <Accordion
                key={item.sys.id}
                question={item.fields.name}
                answer={item.fields.text}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">
              No accordion items found
            </p>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
