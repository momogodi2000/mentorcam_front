import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../ui/dialog_2';
import { Button } from '../../../ui/button';
import { X, Download } from 'lucide-react';

const DocumentViewerModal = ({ isOpen, onClose, document }) => {
  if (!document) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Document Viewer</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(document.url)}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>
            Viewing {document.type} document
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 w-full h-full min-h-[60vh] bg-gray-100 rounded-lg overflow-hidden">
          <iframe
            src={document.url}
            title="Document Viewer"
            className="w-full h-full"
            style={{ border: 'none' }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewerModal;