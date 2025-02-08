import { useState, type ComponentProps } from "react";

type ButtonProps = ComponentProps<"button">;

type ConfirmationButtonProps = Omit<ButtonProps, "onClick"> & {
  onConfirm: () => void;
};

export default function ConfirmationButton({
  onConfirm,
  ...props
}: ConfirmationButtonProps) {
  const [show, setShow] = useState(false);

  const showConfirmation = () => {
    setShow(true);
  };

  const hideConfirmation = () => {
    setShow(false);
  };

  const handleConfirm = () => {
    hideConfirmation();
    onConfirm();
  };

  return (
    <>
      <button onClick={showConfirmation} {...props} />;
      {show && (
        <div>
          <button name="ok" onClick={handleConfirm}>
            Ok
          </button>
          <button name="cancel" onClick={hideConfirmation}>
            Cancel
          </button>
        </div>
      )}
    </>
  );
}
