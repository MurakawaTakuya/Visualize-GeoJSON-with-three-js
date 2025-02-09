import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { data } from "@/const/const";

export default function PlaceSelection() {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full max-w-sm"
      style={{
        margin: "0 auto",
        color: "white",
        position: "absolute",
        top: "2%",
        left: "50%",
        transform: "translateX(-50%)",
      }}
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
        style={{ cursor: "pointer", backgroundColor: "black" }}
      />
      <CarouselNext style={{ cursor: "pointer", backgroundColor: "black" }} />
    </Carousel>
  );
}
