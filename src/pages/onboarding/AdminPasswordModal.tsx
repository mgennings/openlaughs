import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from '@/components/ui/dialog';
import { KeenIcon, Alert } from '@/components';

interface AdminPasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPasswordVerified: () => void;
}

const AdminPasswordModal = ({
  open,
  onOpenChange,
  onPasswordVerified,
}: AdminPasswordModalProps) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setPassword('');
      setError(null);
      setVerifying(false);
    }
  }, [open]);

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError('Please enter the admin password');
      return;
    }

    setVerifying(true);

    // Check password (with a small delay to prevent timing attacks)
    await new Promise(resolve => setTimeout(resolve, 300));

    if (!adminPassword) {
      setError(
        'Admin password not configured. Please contact the system administrator.',
      );
      setVerifying(false);
      return;
    }

    if (password === adminPassword) {
      setPassword('');
      setError(null);
      onPasswordVerified();
      onOpenChange(false);
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }

    setVerifying(false);
  };

  const handleCancel = () => {
    setPassword('');
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="py-4 px-5 block">
          <DialogTitle className="text-xl font-semibold leading-none text-gray-900 mb-2 flex items-center gap-2">
            <KeenIcon icon="lock" className="text-primary" />
            Admin Access Required
          </DialogTitle>
          <DialogDescription className="text-sm font-normal leading-relaxed text-gray-700">
            Admin role requires password verification. Please enter the admin
            password to continue.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="px-5 pb-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            <div>
              <label
                htmlFor="admin-password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Admin Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
                disabled={verifying}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={verifying}
                className="btn btn-light"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={verifying || !password.trim()}
                className="btn btn-primary"
              >
                {verifying ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <KeenIcon icon="check" className="me-2" />
                    Verify
                  </>
                )}
              </button>
            </div>
          </form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export { AdminPasswordModal };
