import {
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type MouseEvent,
} from "react";

import imagePlaceHolder from "@/assets/placeholder.webp";
import { Input } from "../ui/input";
import { AspectRatio } from "../ui/aspect-ratio";

type InputPhotoProps = ComponentProps<typeof Input>;

export default function InputPhoto({ onChange, ...props }: InputPhotoProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState<FileReader["result"]>(null);

  const loadSrcFromFile = (file: File | undefined) => {
    if (!file) {
      return setSrc(null);
    }
    const reader = new FileReader();
    reader.onload = function () {
      setSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClick = (event: MouseEvent<HTMLImageElement>) => {
    event.preventDefault();
    inputRef.current?.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    loadSrcFromFile(file);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <div className="bg-muted">
      <Input
        ref={inputRef}
        type="file"
        onChange={handleChange}
        className="hidden"
        {...props}
      />
      <AspectRatio ratio={4 / 3}>
        <img
          onClick={handleClick}
          src={typeof src === "string" ? src : imagePlaceHolder}
          alt=""
          className="h-full object-contain"
        />
      </AspectRatio>
    </div>
  );
}
