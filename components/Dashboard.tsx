
import React, { useState } from 'react';
import { Member, Bill, Settlement } from '../types';
import MemberCard from './MemberCard';
import Button from './Button';
import Modal from './Modal';
import AddMemberForm from './AddMemberForm';
import { PlusIcon, UsersIcon, ChevronLeftIcon } from './icons/Icons';
import MemberDetails from './MemberDetails';

interface DashboardProps {
  onBack: () => void;
  members: Member[];
  bills: Bill[];
  onAddMember: (member: { name: string }) => void;
  onRemoveMember: (id: string) => void;
  onAddSettlement: (settlement: Omit<Settlement, 'id'>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onBack, members, bills, onAddMember, onRemoveMember, onAddSettlement }) => {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const handleRemoveMember = (id: string) => {
    onRemoveMember(id);
    // Close modal if the deleted member was selected
    if (selectedMemberId === id) {
      setSelectedMemberId(null);
    }
  };
  
  const handleAddMember = (newMemberData: { name: string }) => {
    onAddMember(newMemberData);
    setIsAddMemberModalOpen(false);
  };


  const selectedMember = members.find(member => member.id === selectedMemberId);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
            <button 
                onClick={onBack} 
                className="p-2 rounded-full bg-[#2E2E2E] text-[#D9D9D9] hover:bg-[#3C3C3C] hover:text-[#F2F2F2] transition-colors"
                aria-label="Go back"
            >
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-semibold text-[#F2F2F2] flex items-center">
                <UsersIcon className="w-6 h-6 mr-2 text-[#00C2A8]"/>
                Team Members
            </h2>
        </div>
        <Button onClick={() => setIsAddMemberModalOpen(true)}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Member
        </Button>
      </div>

      {members.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map(member => (
            <MemberCard 
              key={member.id} 
              member={member} 
              onRemove={handleRemoveMember} 
              onSelect={() => setSelectedMemberId(member.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-[#1C1C1C] rounded-lg">
            <UsersIcon className="w-16 h-16 mx-auto text-[#7A7A7A] mb-4"/>
            <h3 className="text-xl font-semibold text-[#F2F2F2]">No Members Found</h3>
            <p className="text-[#D9D9D9] mt-2">Get started by adding a new member to your team.</p>
        </div>
      )}

      {/* Add Member Modal */}
      <Modal isOpen={isAddMemberModalOpen} onClose={() => setIsAddMemberModalOpen(false)}>
        <AddMemberForm onAddMember={handleAddMember} onClose={() => setIsAddMemberModalOpen(false)} />
      </Modal>

      {/* Member Details Modal */}
      {selectedMember && (
         <Modal isOpen={!!selectedMember} onClose={() => setSelectedMemberId(null)}>
            <MemberDetails 
                member={selectedMember} 
                bills={bills} 
                members={members} 
                onAddSettlement={onAddSettlement}
            />
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;