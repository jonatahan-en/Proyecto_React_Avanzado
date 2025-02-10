import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { isApiClientError } from "@/api/error";
import { createAdvert } from "./service";
import type { ChangeEvent, FormEvent } from "react";
import type { Tags } from "./types";
import AvailableTags from "./components/available-tags";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FormField from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

function validatePrice(value: FormDataEntryValue | null): number {
  try {
    return Number(value);
  } catch (error) {
    console.error(error);
    return 0;
  }
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
  const [loading, setLoading] = useState(false);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleTagsChange = (tags: Tags) => {
    setTags(tags);
  };

  const handleError = useCallback(
    (error: unknown) => {
      if (isApiClientError(error)) {
        if (error.code === "UNAUTHORIZED") {
          return navigate("/login");
        }
      }
      if (error instanceof Error) {
        return toast.error(error.message);
      }
      toast.error("Unexpected error");
    },
    [navigate],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const sale = formData.get("sale") === "sale";
    const price = validatePrice(formData.get("price"));
    const photo = validatePhoto(formData.get("photo"));

    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  const buttonDisabled = !name || !tags.length || loading;

  return (
    <div className="grid gap-4">
      <h2 className="text-center text-3xl">Create your advert</h2>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <FormField>
          Name
          <Input
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
          />
        </FormField>
        <FormField>
          For sale / Looking to buy
          <RadioGroup
            className="flex items-center p-2.5"
            name="sale"
            defaultValue="sale"
          >
            <Label className="flex items-center gap-2">
              <RadioGroupItem value="sale" />
              For sale
            </Label>
            <Label className="flex items-center gap-2">
              <RadioGroupItem value="buy" />
              Looking to buy
            </Label>
          </RadioGroup>
        </FormField>
        <FormField className="w-[50%]">
          Price
          <Input type="number" name="price" defaultValue={0} />
        </FormField>
        <FormField>
          Tags
          <AvailableTags
            onChange={handleTagsChange}
            className="justify-start"
          />
        </FormField>
        <FormField>
          Photo
          <Input type="file" name="photo" />
        </FormField>
        <Button type="submit" disabled={buttonDisabled} className="w-full">
          {loading && <Loader2 className="animate-spin" />}
          {loading ? "Please wait" : "Create advert"}
        </Button>
      </form>
    </div>
  );
}
