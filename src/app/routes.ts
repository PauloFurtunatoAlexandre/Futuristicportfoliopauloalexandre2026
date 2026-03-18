import { createBrowserRouter } from "react-router";

import { HomePage } from "./components/HomePage";
import { CaseStudyPage } from "./components/CaseStudyPage";
import { ResumePage } from "./components/ResumePage";
import { NotFoundPage } from "./components/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/case-study/:slug",
    Component: CaseStudyPage,
  },
  {
    path: "/resume",
    Component: ResumePage,
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);