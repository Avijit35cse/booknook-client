import { HeroSlider } from "@/components/home/HeroSlider";
import NewArrivals from "@/components/home/NewArrivals";

export const instant = false;

export default function Home() {
  return <>
      <HeroSlider />
      <NewArrivals />
    </>
}
