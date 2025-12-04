import { Form, useActionData, useNavigation } from "react-router";
import { useEffect } from "react";
import { motion } from "motion/react";
import closeModal from "../../images/icon-close-modal.svg"

interface DeleteConfirmationModalProps {
  itemId: string;
  itemName: string;
  itemType?: string; // e.g., "Transaction", "Pot", "Budget Item"
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DeleteConfirmationModal({ 
  itemId, 
  itemName, 
  itemType = "Item",
  onClose, 
  onSuccess 
}: DeleteConfirmationModalProps) {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isDeleting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.success) {
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [actionData, onClose, onSuccess]);

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-white max-w-140 w-full rounded-xl p-8"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-grey-900 text-preset-2 md:text-preset-1">
            Delete {itemType} for {itemName}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer" 
            aria-label="Close Modal"
          >
            <img src={closeModal} alt="Close Modal"/>
          </button>
        </div>
        
        
        {actionData?.error && (
          <div className="mb-4 p-3 bg-red text-white rounded-lg text-preset-4">
            {actionData.error}
          </div>
        )}

        <p className="text-grey-500 text-preset-4 mb-5">
          Are you sure you want to delete this {itemType.toLocaleLowerCase()}? This action cannot be reversed, and all the data inside it will be removed forever.
        </p>

        <Form method="delete" className="flex flex-col gap-4">
          <input type="hidden" name="id" value={itemId} />
          
          <button
            type="submit"
            className="flex-1 p-4 bg-red hover:bg-red/60 text-white rounded-lg text-preset-4-bold cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-red focus-visible:outline-offset-2 disabled:opacity-50"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Confirm Deletion'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex-1 p-4 hover:bg-gray-200 text-grey-500 rounded-lg text-preset-4 cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-blue focus-visible:outline-offset-2 disabled:opacity-50"
            disabled={isDeleting}
          >
            No, Go Back
          </button>
        </Form>
      </motion.div>
    </motion.div>
  );
}

