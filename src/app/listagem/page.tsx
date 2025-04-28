"use client"
import TabelaGuardaMaterial from "@/components/tabelaGuardaMaterial/TabelaGuardaMaterial";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Index() {

  const queryClient = new QueryClient()
  return (
    <div className="h-screen">
      <main className="">
        <QueryClientProvider client={queryClient}>
          <TabelaGuardaMaterial />
        </QueryClientProvider>
      </main>
    </div>
  );
}
