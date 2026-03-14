import { Calendar } from 'lucide-react';
import OutlineButton from '../shared/buttons/OutlineButton';
import {useNavigate} from "react-router"

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
}

interface UpcomingMeetingsProps {
  meetings?: Meeting[];
  onViewAllClick?: () => void;
  onMeetingClick?: (meetingId: string) => void;
}

const UpcomingMeetings: React.FC<UpcomingMeetingsProps> = ({
  meetings = [
    {
      id: '1',
      title: 'Project Progress Review',
      date: '03-05-2025',
      time: '10:00 AM'
    },
    {
      id: '2',
      title: 'Research Methodology Discussion',
      date: '03-05-2025',
      time: '1:00 PM'
    }
  ],
  onViewAllClick,
  onMeetingClick
}) => {
  const navigate = useNavigate();
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-4 w-full max-w-md">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-bold text-foreground">Upcoming Meetings</h2>
      </div>
      
      <div className="space-y-3 mb-6">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            onClick={() => onMeetingClick?.(meeting.id)}
            className="border border-border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-all duration-200"
          >
            <h3 className="font-medium text-foreground mb-2">{meeting.title}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Due: {meeting.date} · {meeting.time}</span>
            </div>
          </div>
        ))}
      </div>


      <OutlineButton
          title=' View All Meetings'
          onClick={() => onViewAllClick ? onViewAllClick() : navigate("/meetings")}
          className="w-full"
      />
    </div>
  );
};

export default UpcomingMeetings;