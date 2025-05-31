import React from 'react';
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { IoMdInformationCircleOutline } from "react-icons/io";

interface InfoTooltipProps {
  description: string;
  className?: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ description, className }) => {
    const triggerClassName = `h-4 w-4 cursor-pointer text-primary ${className || ''}`;
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <IoMdInformationCircleOutline className={triggerClassName} />
      </HoverCardTrigger>
      <HoverCardContent sideOffset={5} className="w-80 bg-white text-slate-600">
        <p className="text-sm">{description}</p>
      </HoverCardContent>
    </HoverCard>
  );
};

export default InfoTooltip;