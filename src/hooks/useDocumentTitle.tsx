import { useEffect } from "react";

const useDocumentTitle = (title) => {
  useEffect(() => {
    document.title = title;
  }, [title]); // بيتغير بس لما title يتغير
};

export default useDocumentTitle;
