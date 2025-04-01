
import { ReactNode } from 'react';
import { QuestionsTab } from './QuestionsTab';
import { NotificationsTab } from './NotificationsTab';
import BillPayments from './BillPayments';
import ChatbotSupport from './ChatbotSupport';
import Downloads from './Downloads';
import LeaderboardTab from './LeaderboardTab';
import Marketplace from './Marketplace';
import PaymentMethods from './PaymentMethods';
import ReferralSystem from './ReferralSystem';
import RewardsTab from './RewardsTab';
import SearchMaterials from './SearchMaterials';
import StudyGroups from './StudyGroups';
import StudySessions from './StudySessions';
import UserProfile from './UserProfile';
import GroupChat from './GroupChat';
import { useAuth } from '@/hooks/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface TabContentProps {
  activeTab: string;
}

export const TabContent = ({ activeTab }: TabContentProps): ReactNode => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Handle special navigation cases
  useEffect(() => {
    if (activeTab === 'marketplace') {
      // Redirect to the exams page which has the marketplace functionality
      navigate('/exams');
    }
  }, [activeTab, navigate]);
  
  switch (activeTab) {
    case 'questions':
      return <QuestionsTab />;
    case 'notifications':
      return <NotificationsTab />;
    case 'downloads':
      return <Downloads />;
    case 'profile':
      // Pass the user object to UserProfile
      return <UserProfile user={currentUser} />;
    case 'bills':
      return <BillPayments />;
    case 'marketplace':
      return <Marketplace />;
    case 'groups':
      return <StudyGroups />;
    case 'sessions':
      return <StudySessions />;
    case 'search':
      return <SearchMaterials />;
    case 'leaderboard':
      return <LeaderboardTab />;
    case 'rewards':
      return <RewardsTab />;
    case 'referrals':
      return <ReferralSystem />;
    case 'payments':
      return <PaymentMethods />;
    case 'chat':
      return <GroupChat />;
    default:
      return <QuestionsTab />;
  }
};
