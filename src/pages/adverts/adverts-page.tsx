import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { getAdverts } from "./service";
import { isApiClientError } from "@/api/error";
import { filterAdverts } from "./filters";
import FiltersInputs from "./components/filters-inputs";
import type { Advert, Filters } from "./types";
import { Badge } from "@/components/ui/badge";
import { Euro, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

const tagsClassNames: Record<string, string> = {
  lifestyle: "bg-chart-1",
  mobile: "bg-chart-2",
  motor: "bg-chart-3",
  work: "bg-chart-4",
};

function NoAdverts() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-4 text-center">
      <div className="bg-primary/10 rounded-full p-6">
        <Euro className="stroke-primary h-12 w-12" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-semibold">No adverts yet</h2>
        <p className="text-muted-foreground">
          Get started by creating your first advert. It's quick and easy!
        </p>
      </div>
      <Button asChild>
        <Link to="new">Create First Advert</Link>
      </Button>
    </div>
  );
}

function NoMatches() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-6 p-4 text-center">
      <div className="bg-primary/10 rounded-full p-6">
        <SearchX className="stroke-primary h-12 w-12" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-semibold">No matches found</h2>
        <p className="text-muted-foreground">
          Try adjusting your filters or search criteria to find what you're
          looking for
        </p>
      </div>
    </div>
  );
}

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
    return <NoAdverts />;
  }

  const prices = adverts.map((advert) => advert.price);
  const filteredAdverts = filterAdverts(adverts, filters);

  return (
    <div>
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl">Adverts</h1>
        </div>
        <FiltersInputs
          pricesRange={[Math.min(...prices), Math.max(...prices)]}
          onChange={(filters) => {
            console.log(JSON.stringify(filters));
            setFilters(filters);
          }}
        />

        {filteredAdverts.length === 0 ? (
          <NoMatches />
        ) : (
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAdverts.map((advert) => (
              <li
                key={advert.id}
                className="bg-card rounded-md shadow transition-shadow hover:shadow-md"
              >
                <Link to={advert.id} className="flex flex-col gap-4 p-6">
                  <div className="flex items-center gap-2">
                    <h3 className="overflow-hidden text-xl text-ellipsis whitespace-nowrap">
                      {advert.name}
                    </h3>
                    <Badge className="self-start">
                      {advert.sale ? "for sale" : "looking to buy"}
                    </Badge>
                  </div>

                  <div className="flex gap-8">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Price</span>
                      <span className="flex h-8 items-center gap-2 text-2xl">
                        <Euro className="stroke-primary" />
                        {advert.price}
                      </span>
                    </div>
                    <div className="flex grow flex-col">
                      <span className="text-muted-foreground">Tags</span>
                      <ul className="flex flex-wrap gap-1">
                        {advert.tags.map((tag) => (
                          <li key={tag}>
                            <Badge className={tagsClassNames[tag]}>{tag}</Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
