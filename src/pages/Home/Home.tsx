import { originalHeight, originalWidth } from "@/config/app";
import { Header } from "@/layout/Header";
import { LayerSidebar } from "@/layout/LayerSidebar";
import PropertySidebar from "@/layout/PropertySidebar/PropertySidebar";
import { CanvasContainer, Layout, Loader, MainContainer, MainWrapperContainer } from "@/layout/container";
import { useCanvas } from "@/store/canvas";
import { useTemplate } from "@/store/template";
import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useEffect, useMemo, useRef, useState } from "react";

function _CreateTemplate() {
  const template = useTemplate();
  const [canvas, ref] = useCanvas();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const updateScale = () => {
      const container = containerRef.current;
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      const padding = 32;
      const availableWidth = width - padding;
      const availableHeight = height - padding;
      const nextScale = Math.min(
        1,
        availableWidth / (canvas.dimensions.width || originalWidth),
        availableHeight / (canvas.dimensions.height || originalHeight)
      );
      setScale(Math.max(0.25, nextScale));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [canvas.dimensions.height, canvas.dimensions.width]);

  const dimensions = useMemo(() => {
    return {
      width: canvas.dimensions.width,
      height: canvas.dimensions.height,
      scaledWidth: (canvas.dimensions.width || originalWidth) * scale,
      scaledHeight: (canvas.dimensions.height || originalHeight) * scale,
    };
  }, [canvas.dimensions, scale]);

  const propertyKey = canvas.selected?.name ?? template.active?.key;

  return (
    <Box display={"flex"}>
      <Layout>
        <Header />
        <MainWrapperContainer>
          <LayerSidebar />
          <MainContainer id="canvas-container" ref={containerRef}>
            <Box height={dimensions.scaledHeight} width={dimensions.scaledWidth} position="relative">
              <CanvasContainer height={dimensions.height} width={dimensions.width} transform={`scale(${scale})`}>
                <canvas id="canvas" ref={ref} />
              </CanvasContainer>
            </Box>
          </MainContainer>
          <PropertySidebar key={propertyKey} />
        </MainWrapperContainer>
      </Layout>
      <Loader isLoading={template.isLoading} />
    </Box>
  );
}

export const Home = observer(_CreateTemplate);
