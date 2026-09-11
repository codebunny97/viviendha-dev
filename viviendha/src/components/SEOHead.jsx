import { useEffect } from "react";

const SEOHead = ({ title, description }) => {
  useEffect(() => {
    const fullTitle = title
      ? `${title} | Viviendha Developers`
      : "Viviendha Developers | Building Better Tomorrows";
    document.title = fullTitle;

    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
};

export default SEOHead;
