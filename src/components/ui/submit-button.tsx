import { CheckCircleIcon, Loader2 } from "lucide-react";
import { Button, type ButtonProps } from "./button";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  isSubmitting,
  ...props
}: {
  children: React.ReactNode;
  isSubmitting: boolean;
} & ButtonProps) {
  return (
    <Button disabled={isSubmitting} {...props}>
      {isSubmitting && (
        <div className="mr-2">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}

      <span>{children}</span>
    </Button>
  );
}