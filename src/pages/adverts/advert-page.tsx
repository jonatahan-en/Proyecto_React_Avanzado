import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { deleteAdvert, getAdvert } from "./service";
import { isApiClientError } from "@/api/error";
import ConfirmationButton from "@/components/shared/confirmation-button";
import type { Advert, Tags } from "./types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Euro, Trash2 } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const tagsColors: Record<string, string> = {
  lifestyle: "bg-chart-1",
  mobile: "bg-chart-2",
  motor: "bg-chart-3",
  work: "bg-chart-4",
};

const AdvertPrice = ({ price }: { price: number }) => (
  <span className="flex h-8 items-center gap-2 text-2xl">
    <Euro className="stroke-primary" />
    {price}
  </span>
);

const AdvertTags = ({ tags }: { tags: Tags }) => (
  <ul className="flex flex-wrap gap-1">
    {tags.map((tag) => (
      <li key={tag}>
        <Badge className={tagsColors[tag]}>{tag}</Badge>
      </li>
    ))}
  </ul>
);

const AdvertPhoto = ({
  photo,
  name,
}: {
  photo: string | null;
  name: string;
}) => (
  <AspectRatio ratio={4 / 3} className="bg-muted grid w-full rounded-md p-4">
    {photo ? (
      <img
        alt={name}
        src={photo}
        className="h-full w-full rounded-md object-cover"
      />
    ) : (
      <div className="grid h-full w-full place-content-center">
        <span className="text-muted-foreground text-center text-2xl font-extrabold sm:text-4xl">
          Image not available
        </span>
      </div>
    )}
  </AspectRatio>
);

export default function AdvertPage() {
  const navigate = useNavigate();
  const params = useParams();
  const [advert, setAdvert] = useState<Advert | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const advertId = params.advertId ?? "";

  const handleError = useCallback(
    (error: unknown) => {
      if (isApiClientError(error)) {
        if (error.code === "UNAUTHORIZED") {
          return navigate("/login");
        }
        if (error.code === "NOT_FOUND") {
          return navigate("/404");
        }
      }
      if (error instanceof Error) {
        setError(error);
      }
      // TODO: fire an error to be caught by ErrorBoundary
    },
    [navigate],
  );

  useEffect(() => {
    async function loadAdvert() {
      try {
        setIsLoading(true);
        const advert = await getAdvert(advertId);
        setAdvert(advert);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadAdvert();
  }, [advertId, handleError]);

  const handleDelete = async () => {
    try {
      await deleteAdvert(advertId);
      navigate("/adverts");
    } catch (error) {
      handleError(error);
    }
  };

  if (error) {
    return (
      <div>
        Ooooops: <strong>{error.message}</strong>
      </div>
    );
  }

  if (!advert || isLoading) {
    return "Loading....";
  }

  return (
    <article className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <h2 className="overflow-hidden text-4xl text-ellipsis whitespace-nowrap">
          {advert.name}
        </h2>
        <Badge className="self-start">
          {advert.sale ? "for sale" : "looking to buy"}
        </Badge>
      </div>
      <div className="flex gap-8">
        <div className="flex flex-col">
          <span>Price</span>
          <AdvertPrice price={advert.price} />
        </div>
        <div className="flex grow flex-col">
          <span>Tags</span>
          <AdvertTags tags={advert.tags} />
        </div>
      </div>
      <AdvertPhoto photo={advert.photo} name={advert.name} />
      <ConfirmationButton
        variant="destructive"
        confirmation="Are you sure you want to delete this advert?"
        actionButton={
          <Button onClick={handleDelete} variant="destructive">
            Yes
          </Button>
        }
      >
        <Trash2 />
        Delete
      </ConfirmationButton>
    </article>
  );
}
