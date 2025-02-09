import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { deleteAdvert, getAdvert } from "./service";
import { isApiClientError } from "@/api/error";
import ConfirmationButton from "@/components/shared/confirmation-button";
import type { Advert } from "./types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    <article>
      <h1>{advert.name}</h1>
      {advert.sale ? "for sale" : "buy"}
      <strong>{advert.price}</strong>
      {advert.tags.map((tag) => (
        <Badge key={tag}>{tag}</Badge>
      ))}
      {advert.photo && <img alt={advert.name} src={advert.photo} />}
      <ConfirmationButton
        variant="outline"
        confirmation="Are you sure you want to delete this advert?"
        actionButton={
          <Button onClick={handleDelete} variant="destructive">
            Yes
          </Button>
        }
      >
        Delete
      </ConfirmationButton>
    </article>
  );
}
