import { getFAQs } from "@/lib/contentful";
import Accordion from "@/components/Accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function Home() {
  const accordionData = await getFAQs();
  const accordion = accordionData[0] ?? null;

  const title = accordion?.title || "FAQ";
  const accordionItems = accordion?.accordionItemsCollection?.items ?? [];

  return (
    <main className="flex min-h-screen flex-col bg-gray-100">
      <Header />

      <div className="mx-auto w-full max-w-3xl" id="faq">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          {title}
        </h1>

        {accordionItems.length > 0 ? (
          <Accordion items={accordionItems} />
        ) : (
          <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-700">
            No FAQ data available right now.
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
