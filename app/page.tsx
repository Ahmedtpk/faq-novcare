import { getFAQs } from "@/lib/contentful";
import Accordion from "@/components/Accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

async function getAccordionData() {
  try {
    const response = await getFAQs();
    return response;
  } catch (error) {
    console.error("Error fetching accordion data:", error);
    return [];
  }
}

export default async function Home() {

  const accordionData = await getAccordionData();

  const accordion = accordionData[0];

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

  const title = accordion.title;
  const accordionItems = accordion.accordionItemsCollection?.items ?? [];

  return (
    <main className="flex min-h-screen flex-col bg-gray-100 ">
      <Header />

      <div className="w-full max-w-3xl mx-auto ">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          {title || "FAQ"}
        </h1>

        <Accordion items={accordionItems} />
      </div>
      <Footer />
    </main>
  );
}
