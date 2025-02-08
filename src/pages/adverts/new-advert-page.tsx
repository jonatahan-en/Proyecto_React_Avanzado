import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { isApiClientError } from "@/api/error";
import { createAdvert } from "./service";
import type { ChangeEvent, FormEvent } from "react";
import type { Tags } from "./types";
import AvailableTags from "./components/available-tags";

function validatePrice(value: FormDataEntryValue | null): number {
  if (typeof value === "string") {
    return Number(value);
  }
  return 0;
}

function validatePhoto(value: FormDataEntryValue | null): File | undefined {
  if (value instanceof File) {
    return value.size ? value : undefined;
  }
  return undefined;
}

export default function NewAdvertPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [tags, setTags] = useState<Tags>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleTagsChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTags([...event.target.selectedOptions].map((option) => option.value));
  };

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const sale = !!formData.get("sale");
    const price = validatePrice(formData.get("price"));
    const photo = validatePhoto(formData.get("photo"));

    try {
      setIsLoading(true);
      const createdAdvert = await createAdvert({
        name,
        sale,
        price,
        tags,
        photo,
      });
      navigate(`/adverts/${createdAdvert.id}`);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonDisabled = !name || !tags.length || isLoading;

  return (
    <div className="bg-green-300">
      <h1>New Advert Page</h1>
      <form onSubmit={handleSubmit}>
        <label className="block">
          name
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleNameChange}
          />
        </label>
        <label className="block">
          sale
          <input type="checkbox" name="sale" />
        </label>
        <label className="block">
          price
          <input type="number" name="price" defaultValue={0} />
        </label>
        <label className="block">
          tags
          <AvailableTags name="tags" onChange={handleTagsChange} multiple />
        </label>
        <label className="block">
          photo
          <input type="file" name="photo" />
        </label>
        <button type="submit" disabled={buttonDisabled}>
          Create advert
        </button>
      </form>
    </div>
  );
}
