"use client";

import { FC} from "react";
import Hero from "@/components/home/Hero";
import CategoryPreview from "@/components/home/CategoryPreview";
import Footer from "@/components/layouts/Footer";
import FeaturedProducts from "@/components/home/FeaturedProducts";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";

const App: FC = () => {
  // const { isSignedIn, user } = useUser();
  // const router = useRouter();

  // useEffect(() => {
  //   if (isSignedIn && user?.publicMetadata?.role === "admin") {
  //     router.replace("/admin");
  //   }
  // }, []);

  return (
    <main className="max-h-1">
      <Hero />
      <CategoryPreview />
      <FeaturedProducts />
      <Footer />
    </main>
  );
};

export default App;
