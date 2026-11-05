import { HeroSlider } from "@/components/home/HeroSlider";
import NewArrivals from "@/components/home/NewArrivals";
import YourShelf from "@/components/home/YourShelf";
import BorrowWithConfidence from "@/components/home/BorrowWithConfidence";

export const instant = false;

export default function Home() {
  return (
    <div className="relative overflow-x-clip">
      <HeroSlider />
      <NewArrivals />
      <YourShelf />
      <BorrowWithConfidence />
    </div>
  );
}
