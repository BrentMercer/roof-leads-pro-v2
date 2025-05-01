'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusIcon, TrashIcon } from 'lucide-react';

interface ZipCodeManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export function ZipCodeManager({ isOpen, onClose, onUpdate }: ZipCodeManagerProps) {
  const [zipCodes, setZipCodes] = useState<string[]>([]);
  const [newZipCode, setNewZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchZipCodes();
    }
  }, [isOpen]);

  const fetchZipCodes = async () => {
    try {
      const response = await fetch('/api/user/zip-codes');
      if (!response.ok) {
        throw new Error('Failed to fetch zip codes');
      }
      const data = await response.json();
      setZipCodes(data.zipCodes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch zip codes');
    }
  };

  const handleAddZipCode = async () => {
    if (!newZipCode.trim()) return;

    const zipCode = newZipCode.trim();
    if (!/^\d{5}$/.test(zipCode)) {
      setError('Please enter a valid 5-digit ZIP code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/zip-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zipCodes: [zipCode],
          action: 'add'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add ZIP code');
      }

      setNewZipCode('');
      await fetchZipCodes();
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add ZIP code');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveZipCode = async (zipCode: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/zip-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zipCodes: [zipCode],
          action: 'remove'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove ZIP code');
      }

      await fetchZipCodes();
      onUpdate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove ZIP code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage ZIP Codes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newZipCode">Add New ZIP Code</Label>
            <div className="flex space-x-2">
              <Input
                id="newZipCode"
                placeholder="Enter 5-digit ZIP code"
                value={newZipCode}
                onChange={(e) => setNewZipCode(e.target.value)}
                maxLength={5}
                disabled={loading}
              />
              <Button
                onClick={handleAddZipCode}
                disabled={loading || !newZipCode.trim()}
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label>Your ZIP Codes</Label>
            <div className="space-y-2">
              {zipCodes.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No ZIP codes added yet
                </div>
              ) : (
                zipCodes.map((zipCode) => (
                  <div
                    key={zipCode}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <span>{zipCode}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveZipCode(zipCode)}
                      disabled={loading}
                    >
                      <TrashIcon className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 