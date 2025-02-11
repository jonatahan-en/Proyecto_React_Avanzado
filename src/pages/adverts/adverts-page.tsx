import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { getAdverts } from "./service";
import { isApiClientError } from "@/api/error";
import { filterAdverts } from "./filters";
import FiltersInputs from "./components/filters-inputs";
import type { Advert, Filters } from "./types";

export default function AdvertsPage() {
  const navigate = useNavigate();
  const [adverts, setAdverts] = useState<Advert[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<Filters | null>(null);

  const handleError = useCallback(
    (error: unknown) => {
      if (isApiClientError(error)) {
        if (error.code === "UNAUTHORIZED") {
          return navigate("/login");
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
    async function loadAdverts() {
      try {
        setIsLoading(true);
        const adverts = await getAdverts();
        setAdverts(adverts);
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadAdverts();
  }, [handleError]);

  if (error) {
    return (
      <div>
        Ooooops: <strong>{error.message}</strong>
      </div>
    );
  }

  if (!adverts || isLoading) {
    return "Loading....";
  }

  if (!adverts.length) {
    return <Link to="new">Create first advert</Link>;
  }

  const prices = adverts.map((advert) => advert.price);
  const filteredAdverts = filterAdverts(adverts, filters);

  return (
    <div>
      <FiltersInputs
        pricesRange={[Math.min(...prices), Math.max(...prices)]}
        onChange={(filters) => {
          console.log(JSON.stringify(filters));
          setFilters(filters);
        }}
      />
      <h1>Adverts Page</h1>
      <ul className="bg-amber-400">
        {filteredAdverts.map((advert) => (
          <li key={advert.id} className="border">
            <Link to={advert.id}>
              <h3>{advert.name}</h3>
              {advert.sale ? "for sale" : "buy"}
              <strong>{advert.price}</strong>
              {advert.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
