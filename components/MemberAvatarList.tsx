
// FIX: Implemented the MemberAvatarList component which was previously missing.
import React from 'react';
import { Member } from '../types';
import MemberAvatar from './MemberAvatar';

interface MemberAvatarListProps {
  members: Member[];
  alignment?: 'justify-start' | 'justify-center' | 'justify-end';
}

const MemberAvatarList: React.FC<MemberAvatarListProps> = ({ members, alignment = 'justify-start' }) => {
  return (
    <div className={`flex -space-x-2 ${alignment}`}>
      {members.map(member => (
        <MemberAvatar
          key={member.id}
          name={member.name}
          className="inline-block h-8 w-8 rounded-full ring-2 ring-[#121212]"
        />
      ))}
      {members.length === 0 && <p className="text-xs text-[#B0B0B0] italic">Nobody</p>}
    </div>
  );
};

export default MemberAvatarList;