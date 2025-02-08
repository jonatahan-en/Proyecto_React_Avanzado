import { useEffect, useState, type ComponentProps } from "react";
import type { Tags } from "../types";
import { getTags } from "../service";

type Props = ComponentProps<"select">;

export default function AvailableTags(props: Props) {
  const [tags, setTags] = useState<Tags | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadTags() {
      try {
        setIsLoading(true);
        const tags = await getTags();
        setTags(tags);
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        }
        // TODO: fire an error to be caught by ErrorBoundary
      } finally {
        setIsLoading(false);
      }
    }

    loadTags();
  }, []);

  if (error) {
    return (
      <div>
        Ooooops: <strong>{error.message}</strong>
      </div>
    );
  }

  if (!tags || isLoading) {
    return "Loading...";
  }

  return (
    <select {...props}>
      {tags.map((tag) => (
        <option key={tag}>{tag}</option>
      ))}
    </select>
  );
}
