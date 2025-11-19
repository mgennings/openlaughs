import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from '@/components/ui/dialog';
import { ComedianCreateForm } from './ComedianCreateForm';

interface ModalCreateComedianProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createdBy: string;
  onCreated?: () => void;
  onError?: (message: string) => void;
}

const ModalCreateComedian = ({
  open,
  onOpenChange,
  createdBy,
  onCreated,
  onError,
}: ModalCreateComedianProps) => {
  const handleCreated = () => {
    onCreated?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] max-h-[95%] scrollable-y-auto">
        <DialogHeader className="py-4 px-5 block">
          <DialogTitle className="text-xl font-semibold leading-none text-gray-900 mb-2">
            Create a Comedian
          </DialogTitle>
          <DialogDescription className="text-sm font-normal leading-none text-gray-700">
            Fill in the details below to create a new comedian profile
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="px-5 pb-5">
          <ComedianCreateForm
            createdBy={createdBy}
            onCreated={handleCreated}
            onError={onError}
            onCancelClick={() => onOpenChange(false)}
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ModalCreateComedian };
