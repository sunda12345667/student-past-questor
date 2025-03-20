
import React from 'react';
import { QuestionsTab } from './QuestionsTab';
import { NotificationsTab } from './NotificationsTab';
import PaymentMethods from './PaymentMethods';
import ChatbotSupport from './ChatbotSupport';
import BillPayments from './BillPayments';
import ReferralSystem from './ReferralSystem';

interface TabContentProps {
  activeTab: string;
}

export const TabContent = ({ activeTab }: TabContentProps) => {
  switch(activeTab) {
    case 'questions':
      return <QuestionsTab />;
    
    case 'payment':
      return <PaymentMethods />;
    
    case 'chatbot':
      return <ChatbotSupport />;
    
    case 'bills':
      return <BillPayments />;
    
    case 'referrals':
      return <ReferralSystem />;
    
    case 'notifications':
      return <NotificationsTab />;
    
    default:
      return <div>Select a tab</div>;
  }
};
