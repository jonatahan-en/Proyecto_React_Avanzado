import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { type ComponentProps, type ReactNode } from "react";

type ButtonProps = ComponentProps<typeof Button>;

type ConfirmationButtonProps = Omit<ButtonProps, "onClick"> & {
  confirmation: ReactNode;
  actionButton: ReactNode;
};

export default function PopoverButton({
  confirmation,
  actionButton,
  ...props
}: ConfirmationButtonProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button {...props} />
      </PopoverTrigger>
      <PopoverContent className="flex items-center gap-4">
        {confirmation}
        {actionButton}
      </PopoverContent>
    </Popover>
  );
}
