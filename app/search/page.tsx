import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { SearchResults } from "@/components/providers/search-results";

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <SearchResults />
      </main>
      <Footer />
    </>
  );
}
