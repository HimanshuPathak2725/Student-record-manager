import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function ConfirmDelete({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: ConfirmDeleteProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-zinc-950 border border-zinc-800 text-zinc-100 rounded-lg shadow-2xl font-sans">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-white" />
            <AlertDialogTitle className="text-base font-bold text-white tracking-tight font-sans">
              Delete Student Record Node
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-xs text-zinc-400 font-sans">
            Are you sure you want to remove this record? The student node will be unlinked and deleted from memory. This action cannot be reversed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 text-xs font-sans rounded-md">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-sans font-semibold rounded-md px-4"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Confirm Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
