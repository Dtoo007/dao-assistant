
import Image from "next/image";

import banner from "@/public/banner.png";

function Banner() {
  return (
      <Image src={banner} quality={100} with={1000} height={500} alt="DAO banner" />


  );
}

export default Banner;
