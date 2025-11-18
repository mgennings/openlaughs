import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from '@/components/ui/dialog';
import { KeenIcon } from '@/components';

interface ModalDeleteShowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showTitle: string;
  onConfirm: () => void;
  isDeleting?: boolean;
}

const ModalDeleteShow = ({
  open,
  onOpenChange,
  showTitle,
  onConfirm,
  isDeleting = false,
}: ModalDeleteShowProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader className="py-4 px-5 block">
          <DialogTitle className="text-xl font-semibold leading-none text-gray-900 mb-2">
            Delete Show
          </DialogTitle>
          <DialogDescription className="text-sm font-normal leading-none text-gray-700">
            Are you sure you want to delete this show? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="px-5 pb-5">
          <div className="bg-danger/10 border border-danger/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-3">
              <KeenIcon icon="information" className="text-danger text-xl mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Show: {showTitle}
                </p>
                <p className="text-sm text-gray-600">
                  All show information, images, and associated data will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="px-5 pb-5">
          <div className="flex items-center gap-3 w-full justify-end">
            <button
              className="btn btn-light"
              onClick={() => onOpenChange(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger"
              onClick={onConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <div
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Deleting...
                </>
              ) : (
                <>
                  <KeenIcon icon="trash" className="me-2" />
                  Delete Show
                </>
              )}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { ModalDeleteShow };


