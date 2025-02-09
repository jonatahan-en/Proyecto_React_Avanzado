import { type ComponentProps } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type ButtonProps = ComponentProps<typeof Button>;

type ConfirmationButtonProps = Omit<ButtonProps, "onClick"> & {
  onConfirm: () => void;
};

export default function ConfirmationButton({
  onConfirm,
  ...props
}: ConfirmationButtonProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button {...props} />
      </PopoverTrigger>
      <PopoverContent>
        <div>
          <button name="ok" onClick={handleConfirm}>
            Ok
          </button>
          <button name="cancel">Cancel</button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
