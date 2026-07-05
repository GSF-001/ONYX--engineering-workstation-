import { useReviewsData } from "./ReviewsHooks";
import { ReviewsWindow } from "./ReviewsWindow";
import "./ReviewsStyles.css";

export default function ReviewsApp() {
  const data = useReviewsData();
  return <ReviewsWindow data={data} />;
}
