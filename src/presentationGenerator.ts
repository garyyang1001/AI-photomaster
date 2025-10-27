import pptxgen from "pptxgenjs";
import { ConversationItem } from "./types";

export const generatePresentation = (conversation: ConversationItem[]) => {
  const pres = new pptxgen();

  conversation.forEach(item => {
    if (item.imageUrl) {
      const slide = pres.addSlide();
      slide.addImage({
        path: item.imageUrl,
        x: 0.5,
        y: 0.5,
        w: 9.0,
        h: 5.06,
      });
      if (item.text) {
        slide.addText(item.text, {
          x: 0.5,
          y: 5.7,
          w: 9.0,
          h: 1.0,
          fontSize: 18,
          color: "363636",
        });
      }
    }
  });

  pres.writeFile({ fileName: "photography-script.pptx" });
};