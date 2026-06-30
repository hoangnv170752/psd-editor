import "@/config/fabric";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "@/config/theme";
import { Home } from "@/pages/Home";
import { Canvas, CanvasProvider } from "./store/canvas";
import { TemplateProvider, TemplateStore } from "./store/template";

const canvas = new Canvas();
const template = new TemplateStore(canvas);

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CanvasProvider value={canvas}>
        <TemplateProvider value={template}>
          <Home />
        </TemplateProvider>
      </CanvasProvider>
    </ChakraProvider>
  );
}

export default App;
