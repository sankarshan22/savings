
import React, { useState } from 'react';
import Button from './Button';

interface AddMemberFormProps {
  onAddMember: (member: { name: string }) => void;
  onClose: () => void;
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({ onAddMember, onClose }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError('Full name is required.');
      return;
    }
    setError('');
    onAddMember({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-2xl font-bold text-[#FFFFFF] mb-4">Add New Member</h2>
        {error && <p className="text-[#FF6B81] bg-[#FF6B81]/10 p-3 rounded-md">{error}</p>}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#F2F2F2]">Full Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full bg-[#2E2E2E] border border-[#3C3C3C] rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-[#00C2A8] focus:border-[#00C2A8] sm:text-sm"
          placeholder="e.g. Jane Doe"
        />
      </div>
      <div className="flex justify-end gap-4 pt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-[#3C3C3C] text-white font-semibold rounded-lg hover:bg-[#5A5A5A] transition-colors">
            Cancel
        </button>
        <Button type="submit">Add Member</Button>
      </div>
    </form>
  );
};

export default AddMemberForm;