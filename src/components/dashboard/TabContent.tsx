
import QuestionsTab from './QuestionsTab';
import NotificationsTab from './NotificationsTab';
import ReferralSystem from './ReferralSystem';
import PaymentMethods from './PaymentMethods';
import SearchMaterials from './SearchMaterials';
import UserProfile from './UserProfile';
import StudyGroups from './StudyGroups';
import StudySessions from './StudySessions';
import LeaderboardTab from './LeaderboardTab';
import GroupChat from './GroupChat';
import RewardsTab from './RewardsTab';
import Downloads from './Downloads';
import Marketplace from './Marketplace';
import { useAuth } from '@/contexts/AuthContext';

interface TabContentProps {
  activeTab: string;
}

export const TabContent = ({ activeTab }: TabContentProps) => {
  const { currentUser } = useAuth();

  switch (activeTab) {
    case 'search':
      return <SearchMaterials />;
    case 'questions':
      return <QuestionsTab />;
    case 'marketplace':
      return <Marketplace />;
    case 'downloads':
      return <Downloads />;
    case 'profile':
      return <UserProfile user={currentUser} />;
    case 'groups':
      return <StudyGroups />;
    case 'study-sessions':
      return <StudySessions />;
    case 'chat':
      return <GroupChat />;
    case 'leaderboard':
      return <LeaderboardTab />;
    case 'referrals':
      return <ReferralSystem />;
    case 'rewards':
      return <RewardsTab />;
    case 'payments':
      return <PaymentMethods />;
    case 'notifications':
      return <NotificationsTab />;
    default:
      return <QuestionsTab />;
  }
};
