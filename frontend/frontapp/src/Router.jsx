import { createBrowserRouter } from "react-router-dom";
import Root from "./Root";
import Quiz from "./routes/Quiz";

const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: [
        {
            path: "quiz",
            element: <Quiz/>
        }
      ]
    }
]);
  
  export default router;