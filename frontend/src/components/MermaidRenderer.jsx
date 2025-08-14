import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidRenderer({ chart }) {
  const ref = useRef(null);
  const hasRendered = useRef(false); // To prevent repeated rendering if not necessary

  useEffect(() => {
    if (!chart || !ref.current) return;

    mermaid.initialize({ startOnLoad: false, theme: "neutral" });

    const container = ref.current;

    // Clear any previous SVG content
    container.innerHTML = "";

    const id = "mermaid-" + Math.floor(Math.random() * 1000000);

    // Prevent duplicate renderings
    hasRendered.current = false;

    mermaid
      .render(id, chart)
      .then(({ svg }) => {
        if (hasRendered.current) return;
        hasRendered.current = true;

        const wrapper = document.createElement("div");

        // Styling to make it scrollable and responsive
        wrapper.style.overflowX = "auto";
        wrapper.style.overflowY = "hidden";
        wrapper.style.maxWidth = "100%";
        wrapper.style.display = "block";
        wrapper.style.padding = "0.5rem";
        wrapper.style.border = "1px solid rgba(255,255,255,0.1)";
        wrapper.style.borderRadius = "0.5rem";
        wrapper.style.background = "rgba(255,255,255,0.05)";

        // Modify SVG to have full width and auto height
        const responsiveSvg = svg
          .replace(/<svg[^>]*>/, (match) =>
            match
              .replace(/width="\d+"/, 'width="100%"')
              .replace(/height="\d+"/, 'height="auto"')
          );

        wrapper.innerHTML = responsiveSvg;
        container.appendChild(wrapper);
      })
      .catch((err) => {
        container.innerHTML = `<pre style="color:red;">Mermaid rendering error:\n${err.message}</pre>`;
        console.error("Mermaid render error:", err);
      });
  }, [chart]);

  return <div ref={ref} style={{ width: "100%" }} />;
}
