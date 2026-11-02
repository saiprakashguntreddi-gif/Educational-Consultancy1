import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Bell,
  ExternalLink,
  LogOut,
  ChevronDown,
  CheckCheck,
  X,
  Calendar,
  ClipboardList,
  UserCheck,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useAuth } from '../../../../shared/context/AuthContext';
import { AppointmentsService } from '../../../appointments/services/appointments.service';

export interface SaaSTopBarProps {
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  onNavigateLanding?: () => void;
  onSelectTab?: (tab: string) => void;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'appointment' | 'audit' | 'student' | 'system';
  actionTab?: string;
  actionLabel?: string;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'sys-intake-1',
    title: 'Student Profile Intake Submitted',
    message: 'Rahul Sharma submitted updated transcripts and GRE scores for university matching.',
    timestamp: '15m ago',
    category: 'student',
    actionTab: 'students',
    actionLabel: 'Review Roster',
  },
  {
    id: 'sys-queue-1',
    title: 'Tier-1 Document Verification',
    message: '2 students are pending in verification queue for USA Fall 2026 intake applications.',
    timestamp: '45m ago',
    category: 'student',
    actionTab: 'verification',
    actionLabel: 'Open Queue',
  },
  {
    id: 'sys-catalog-1',
    title: 'Institutional Catalog Synchronized',
    message: 'USA, UK, Canada, Australia, and Germany updated with verified 2026 admissions benchmarks.',
    timestamp: '3h ago',
    category: 'system',
    actionTab: 'colleges',
    actionLabel: 'View Colleges',
  },
  {
    id: 'sys-rec-1',
    title: 'Session Recording System Active',
    message: 'Live voice notes and recording uploads are securely encrypted and audit-ready.',
    timestamp: '5h ago',
    category: 'audit',
    actionTab: 'session-audit',
    actionLabel: 'Audit Details',
  },
];

export const SaaSTopBar: React.FC<SaaSTopBarProps> = ({
  onSearch,
  searchPlaceholder = 'Search students, applications, or anything...',
  onNavigateLanding,
  onSelectTab,
}) => {
  const { user, logout } = useAuth();
  const [searchVal, setSearchVal] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'sessions'>('all');
  const [liveAppointmentNotifs, setLiveAppointmentNotifs] = useState<NotificationItem[]>([]);

  // Persistent read and dismissed states
  const [readIds, setReadIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('rgc_read_notifs');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('rgc_dismissed_notifs');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  const dropdownContainerRef = useRef<HTMLDivElement>(null);
  const notificationsContainerRef = useRef<HTMLDivElement>(null);

  // Load live appointments for real-time notifications
  useEffect(() => {
    let isMounted = true;
    const fetchLiveNotifications = async () => {
      try {
        const res = await AppointmentsService.getCounsellorSchedule().catch(() => null);
        if (isMounted && res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const appointmentNotifs: NotificationItem[] = res.data.slice(0, 4).map((apt: any) => {
            if (apt.status === 'COMPLETED') {
              return {
                id: `audit-${apt.id}`,
                title: `Audit Stream Ready: ${apt.studentName || 'Student'}`,
                message: `Recorded session outcome and counselling notes logged for ${apt.targetStream || 'Academic Counseling'}.`,
                timestamp: apt.scheduledDate ? `${apt.scheduledDate}` : 'Recently',
                category: 'audit',
                actionTab: 'session-audit',
                actionLabel: 'Open Audit',
              };
            }
            return {
              id: `appt-${apt.id}`,
              title: `${apt.status === 'PENDING' ? 'New Booking Request' : 'Upcoming Consultation'}: ${apt.studentName || 'Student'}`,
              message: `${apt.appointmentType || 'Study Abroad Consultation'} on ${apt.scheduledDate || 'Today'} at ${apt.timeSlot || '10:00 AM'}.`,
              timestamp: apt.scheduledDate ? `${apt.scheduledDate}` : 'Upcoming',
              category: 'appointment',
              actionTab: 'appointments',
              actionLabel: 'View Session',
            };
          });

          setLiveAppointmentNotifs(appointmentNotifs);
        }
      } catch (err) {
        // Fallback gracefully
      }
    };

    fetchLiveNotifications();
    return () => {
      isMounted = false;
    };
  }, []);

  // Click outside and escape key handling
  useEffect(() => {
    if (!dropdownOpen && !notificationsOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (dropdownOpen && dropdownContainerRef.current && !dropdownContainerRef.current.contains(target)) {
        setDropdownOpen(false);
      }
      if (notificationsOpen && notificationsContainerRef.current && !notificationsContainerRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [dropdownOpen, notificationsOpen]);

  // Aggregate visible notifications
  const allNotifications = [...liveAppointmentNotifs, ...DEFAULT_NOTIFICATIONS];
  const visibleNotifications = allNotifications.filter((n) => !dismissedIds.has(n.id));
  const unreadCount = visibleNotifications.filter((n) => !readIds.has(n.id)).length;
  const sessionNotifsCount = visibleNotifications.filter(
    (n) => n.category === 'appointment' || n.category === 'audit'
  ).length;

  const filteredNotifications = visibleNotifications.filter((n) => {
    if (notifFilter === 'unread') return !readIds.has(n.id);
    if (notifFilter === 'sessions') return n.category === 'appointment' || n.category === 'audit';
    return true;
  });

  const handleMarkAllAsRead = () => {
    const newRead = new Set(readIds);
    visibleNotifications.forEach((n) => newRead.add(n.id));
    setReadIds(newRead);
    try {
      localStorage.setItem('rgc_read_notifs', JSON.stringify(Array.from(newRead)));
    } catch {
      // Storage unavailable
    }
  };

  const handleItemClick = (notif: NotificationItem) => {
    if (!readIds.has(notif.id)) {
      const newRead = new Set(readIds);
      newRead.add(notif.id);
      setReadIds(newRead);
      try {
        localStorage.setItem('rgc_read_notifs', JSON.stringify(Array.from(newRead)));
      } catch {
        // Storage unavailable
      }
    }
    if (notif.actionTab && onSelectTab) {
      onSelectTab(notif.actionTab);
      setNotificationsOpen(false);
    }
  };

  const handleDismissItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newDismissed = new Set(dismissedIds);
    newDismissed.add(id);
    setDismissedIds(newDismissed);
    try {
      localStorage.setItem('rgc_dismissed_notifs', JSON.stringify(Array.from(newDismissed)));
    } catch {
      // Storage unavailable
    }
  };

  const handleClearAll = () => {
    const newDismissed = new Set(dismissedIds);
    visibleNotifications.forEach((n) => newDismissed.add(n.id));
    setDismissedIds(newDismissed);
    try {
      localStorage.setItem('rgc_dismissed_notifs', JSON.stringify(Array.from(newDismissed)));
    } catch {
      // Storage unavailable
    }
  };

  const getCategoryIcon = (category: NotificationItem['category']) => {
    switch (category) {
      case 'appointment':
        return <Calendar size={17} />;
      case 'audit':
        return <ClipboardList size={17} />;
      case 'student':
        return <UserCheck size={17} />;
      case 'system':
      default:
        return <ShieldCheck size={17} />;
    }
  };

  // Formatted current date
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchVal);
    }
  };

  const roleTitle =
    user?.role === 'ADMIN'
      ? 'Super Admin'
      : user?.role === 'COUNSELLOR'
      ? 'Senior Counsellor'
      : 'Student';

  const userDisplayName = user?.email?.split('@')[0] || 'User';

  return (
    <header className="saas-topbar">
      <form onSubmit={handleSearchSubmit} className="saas-search-container">
        <Search size={16} color="#94A3B8" />
        <input
          type="text"
          className="saas-search-input"
          placeholder={searchPlaceholder}
          value={searchVal}
          onChange={(e) => {
            setSearchVal(e.target.value);
            if (onSearch) onSearch(e.target.value);
          }}
        />
      </form>

      <div className="saas-topbar-actions">
        <div className="saas-date-badge">
          <span>{todayFormatted}</span>
        </div>

        {/* Notifications Dropdown */}
        <div ref={notificationsContainerRef} className="saas-notif-container">
          <button
            className={`saas-icon-btn ${notificationsOpen ? 'active' : ''}`}
            title="Notifications"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setDropdownOpen(false);
            }}
            type="button"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 ? (
              <span className="saas-badge-counter">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            ) : null}
          </button>

          {notificationsOpen && (
            <div className="saas-notif-panel">
              {/* Header */}
              <div className="saas-notif-header">
                <div className="saas-notif-title-group">
                  <span className="saas-notif-title">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="saas-notif-badge-pill">{unreadCount} new</span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    className="saas-notif-mark-read-btn"
                    onClick={handleMarkAllAsRead}
                    type="button"
                    title="Mark all as read"
                  >
                    <CheckCheck size={14} />
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Filter Tabs */}
              <div className="saas-notif-filters">
                <button
                  type="button"
                  className={`saas-notif-filter-btn ${notifFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setNotifFilter('all')}
                >
                  All ({visibleNotifications.length})
                </button>
                <button
                  type="button"
                  className={`saas-notif-filter-btn ${notifFilter === 'unread' ? 'active' : ''}`}
                  onClick={() => setNotifFilter('unread')}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  type="button"
                  className={`saas-notif-filter-btn ${notifFilter === 'sessions' ? 'active' : ''}`}
                  onClick={() => setNotifFilter('sessions')}
                >
                  Sessions ({sessionNotifsCount})
                </button>
              </div>

              {/* Notification List */}
              <div className="saas-notif-list">
                {filteredNotifications.length === 0 ? (
                  <div className="saas-notif-empty">
                    <div className="saas-notif-empty-icon">
                      <CheckCheck size={22} color="#10B981" />
                    </div>
                    <p className="saas-notif-empty-title">All caught up!</p>
                    <p className="saas-notif-empty-desc">
                      {notifFilter === 'unread'
                        ? 'No unread notifications at the moment.'
                        : 'No notifications found in this category.'}
                    </p>
                  </div>
                ) : (
                  filteredNotifications.map((notif) => {
                    const isUnread = !readIds.has(notif.id);
                    return (
                      <div
                        key={notif.id}
                        className={`saas-notif-item ${isUnread ? 'unread' : ''}`}
                        onClick={() => handleItemClick(notif)}
                      >
                        <div className={`saas-notif-icon-box saas-notif-icon-${notif.category}`}>
                          {getCategoryIcon(notif.category)}
                        </div>

                        <div className="saas-notif-body">
                          <div className="saas-notif-item-header">
                            <span className="saas-notif-item-title">{notif.title}</span>
                            <button
                              type="button"
                              className="saas-notif-dismiss-btn"
                              title="Dismiss notification"
                              onClick={(e) => handleDismissItem(e, notif.id)}
                            >
                              <X size={13} />
                            </button>
                          </div>

                          <div className="saas-notif-item-desc">{notif.message}</div>

                          <div className="saas-notif-item-meta">
                            <span className="saas-notif-time">
                              <Clock size={11} /> {notif.timestamp}
                            </span>
                            {notif.actionLabel && (
                              <button
                                type="button"
                                className="saas-notif-action-btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleItemClick(notif);
                                }}
                              >
                                {notif.actionLabel}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="saas-notif-footer">
                <button
                  type="button"
                  className="saas-notif-footer-btn"
                  onClick={handleClearAll}
                >
                  Clear all
                </button>
                {onSelectTab && (
                  <button
                    type="button"
                    className="saas-notif-footer-btn"
                    onClick={() => {
                      setNotificationsOpen(false);
                      onSelectTab('audit');
                    }}
                  >
                    View audit log &rarr;
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div ref={dropdownContainerRef} style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotificationsOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '0.3rem 0.5rem',
              borderRadius: '8px',
            }}
            type="button"
          >
            <div className="saas-user-avatar">
              {userDisplayName.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0F172A' }}>
                {userDisplayName}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>{roleTitle}</span>
            </div>
            <ChevronDown size={14} color="#64748B" />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '110%',
                right: 0,
                width: '210px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                boxShadow: '0 10px 15px -3px rgba(15, 23, 42, 0.1)',
                padding: '0.5rem',
                zIndex: 50,
              }}
            >
              <div
                style={{
                  padding: '0.5rem 0.75rem',
                  borderBottom: '1px solid #F1F5F9',
                  marginBottom: '0.35rem',
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Signed in as</div>
                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    color: '#0F172A',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.email}
                </div>
              </div>

              {onNavigateLanding && (
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    onNavigateLanding();
                  }}
                  className="saas-nav-item"
                  style={{ fontSize: '0.82rem', padding: '0.5rem 0.75rem' }}
                  type="button"
                >
                  <ExternalLink size={15} /> View Public Portal
                </button>
              )}

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                  if (onNavigateLanding) {
                    onNavigateLanding();
                  }
                }}
                className="saas-nav-item"
                style={{ fontSize: '0.82rem', padding: '0.5rem 0.75rem', color: '#DC2626' }}
                type="button"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
