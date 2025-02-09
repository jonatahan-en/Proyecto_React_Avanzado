import type { ComponentProps } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

type ButtonProps = ComponentProps<"button">;

type FormButtonProps = ButtonProps & {
  loading?: boolean;
};

export default function FormButton({
  loading,
  children,
  ...props
}: FormButtonProps) {
  return (
    <Button type="submit" {...props}>
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </Button>
  );
}
