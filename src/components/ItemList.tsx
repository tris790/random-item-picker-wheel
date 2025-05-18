
import React, { useState, useRef, useEffect } from 'react';
import { Item } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ItemListProps {
  items: Item[];
  onAddItem: (item: string) => void;
  onRemoveItem: (id: string) => void;
  selectedItems: Item[];
  isSpinning: boolean;
}

const ItemList: React.FC<ItemListProps> = ({ 
  items, 
  onAddItem, 
  onRemoveItem, 
  selectedItems,
  isSpinning
}) => {
  const [newItemText, setNewItemText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input field when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleAddItem = () => {
    if (newItemText.trim()) {
      onAddItem(newItemText.trim());
      setNewItemText('');
      // Refocus on the input after adding
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      toast({
        title: "Can't add empty item",
        description: "Please enter a name for the item.",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  };

  const isSelected = (id: string) => selectedItems.some(item => item.id === id);

  return (
    <div className="w-full max-h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-2">Items List</h2>
      
      <div className="flex space-x-2 mb-4">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Add new item..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSpinning}
        />
        <Button onClick={handleAddItem} disabled={isSpinning}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex-grow overflow-y-auto border rounded-md">
        {items.length > 0 ? (
          <ul className="divide-y">
            {items.map((item) => (
              <li 
                key={item.id}
                className={`flex justify-between items-center p-3 transition-colors
                  ${isSelected(item.id) ? 'bg-primary/10' : ''}`}
              >
                <span className={isSelected(item.id) ? 'font-bold' : ''}>{item.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveItem(item.id)}
                  disabled={isSpinning}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">
            No items added yet
          </div>
        )}
      </div>
      
      <div className="mt-2 text-sm text-gray-500 text-center">
        {items.length} {items.length === 1 ? 'item' : 'items'} in the list
      </div>
    </div>
  );
};

export default ItemList;
