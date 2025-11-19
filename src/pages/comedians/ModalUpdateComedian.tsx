import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from '@/components/ui/dialog';
import { ComedianUpdateForm } from './ComedianUpdateForm';

interface ModalUpdateComedianProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comedianId: string;
  onUpdated?: () => void;
  onError?: (message: string) => void;
}

const ModalUpdateComedian = ({
  open,
  onOpenChange,
  comedianId,
  onUpdated,
  onError,
}: ModalUpdateComedianProps) => {
  const handleUpdated = () => {
    onUpdated?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] max-h-[95%] scrollable-y-auto">
        <DialogHeader className="py-4 px-5 block">
          <DialogTitle className="text-xl font-semibold leading-none text-gray-900 mb-2">
            Edit Comedian
          </DialogTitle>
          <DialogDescription className="text-sm font-normal leading-none text-gray-700">
            Update the comedian profile information
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="px-5 pb-5">
          <ComedianUpdateForm
            comedianId={comedianId}
            onUpdated={handleUpdated}
            onError={onError}
          />
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { ModalUpdateComedian };
