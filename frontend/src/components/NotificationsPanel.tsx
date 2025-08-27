import React from 'react';
import { ChevronRight, AlertTriangle, Clock, TrendingDown, CheckCircle, Bell } from 'lucide-react';
import { NotificationItem } from '../types';
import { cn } from '../lib/ui';

interface NotificationsPanelProps {
  items: NotificationItem[];
}

const getNotificationIcon = (type: NotificationItem['type']) => {
  switch (type) {
    case 'missing':
      return <Clock className="w-4 h-4 text-amber-600" />;
    case 'anomaly':
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    case 'struggling':
      return <TrendingDown className="w-4 h-4 text-orange-600" />;
    case 'improvement':
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case 'alert':
      return <Bell className="w-4 h-4 text-blue-600" />;
    default:
      return <Bell className="w-4 h-4 text-gray-600" />;
  }
};

const getPriorityColor = (priority: NotificationItem['priority']) => {
  switch (priority) {
    case 'high':
      return 'border-l-red-500';
    case 'medium':
      return 'border-l-amber-500';
    case 'low':
      return 'border-l-green-500';
    default:
      return 'border-l-gray-300';
  }
};

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
        <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
          {items.length}
        </span>
      </div>
      
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "p-3 rounded-lg border-l-4 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer",
              getPriorityColor(item.priority)
            )}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getNotificationIcon(item.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {item.title}
                  </h4>
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
                
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {item.message}
                </p>
                
                <div className="flex items-center gap-2 mt-2">
                  {item.count && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.count}
                    </span>
                  )}
                  {item.studentName && (
                    <span className="text-xs text-gray-500">
                      {item.studentName}
                    </span>
                  )}
                  {item.assignmentTitle && (
                    <span className="text-xs text-gray-500 truncate max-w-32">
                      {item.assignmentTitle}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No new notifications</p>
        </div>
      )}
    </div>
  );
};
