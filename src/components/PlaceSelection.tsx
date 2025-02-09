import { Card, CardContent } from "@/components/ui/card";
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
                <CardContent
                  className="flex items-center justify-center p-4"
                  style={{ flexDirection: "column" }}
                >
                  <p className="text-2xl font-semibold">{data[key].name}</p>
                  <p>
                    <a href={data[key].rootPath}>3Dで見に行く</a>
                  </p>
                </CardContent>
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
