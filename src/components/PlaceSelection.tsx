import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { data } from "@/const/const";
import { useEffect, useState } from "react";

export default function PlaceSelection() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div
      style={{
        margin: "0 auto",
        color: "white",
        position: "absolute",
        top: "2%",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
        }}
        className="w-full max-w-sm"
      >
        <CarouselContent>
          {Object.keys(data).map((key, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card
                  style={{
                    border: "thin solid white",
                    backgroundColor: "black",
                  }}
                >
                  <a
                    href={data[key].rootPath}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "16px",
                    }}
                  >
                    <p className="text-2xl font-semibold">{data[key].name}</p>
                    <p>3Dで見に行く</p>
                  </a>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          style={{
            cursor: "pointer",
            backgroundColor: "black",
            zoom: 1.2,
          }}
        />
        <CarouselNext
          style={{
            cursor: "pointer",
            backgroundColor: "black",
            zoom: 1.2,
          }}
        />
      </Carousel>
      {current != 0 && count != 0 && (
        <p style={{ paddingTop: "3px", textAlign: "center" }}>
          {current} / {count}
        </p>
      )}
    </div>
  );
}
