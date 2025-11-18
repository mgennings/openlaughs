import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from '@/components/ui/dialog';
import { PromoterShowCreateForm } from './PromoterShowCreateForm';

interface ModalCreateShowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  createdBy: string;
  onCreated?: () => void;
  onError?: (message: string) => void;
}

const ModalCreateShow = ({
  open,
  onOpenChange,
  createdBy,
  onCreated,
  onError,
}: ModalCreateShowProps) => {
  const handleCreated = () => {
    onCreated?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] max-h-[95%] scrollable-y-auto">
        <DialogHeader className="py-4 px-5 block">
          <DialogTitle className="text-xl font-semibold leading-none text-gray-900 mb-2">
            Create a Show
          </DialogTitle>
          <DialogDescription className="text-sm font-normal leading-none text-gray-700">
            Fill in the details below to create a new show
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="px-5 pb-5">
          <PromoterShowCreateForm
            createdBy={createdBy}
            onCreated={handleCreated}
            onError={onError}
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ModalCreateShow };
