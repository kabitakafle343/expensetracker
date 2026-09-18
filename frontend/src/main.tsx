import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App.tsx";
const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  </StrictMode>,
);
