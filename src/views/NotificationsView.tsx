import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Info,
  Check,
  Trash2,
  ExternalLink,
  Shield,
  Smartphone,
} from 'lucide-react';
import { useSafeCross } from '../context/SafeCrossContext';
import { NotificationSeverity, NotificationItem } from '../types/safecross';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    unreadNotificationCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    setActiveSection,
    showToast,
  } = useSafeCross();

  const [severityFilter, setSeverityFilter] = useState<'ALL' | NotificationSeverity>('ALL');
  const [browserPermissionState, setBrowserPermissionState] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const requestBrowserPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setBrowserPermissionState(perm);
        if (perm === 'granted') {
          showToast('Browser notifications enabled.', 'success');
        } else {
          showToast('Browser notifications not granted.', 'warning');
        }
      } catch {
        showToast('Notification permission request failed.', 'warning');
      }
    } else {
      showToast('Notifications unsupported in this browser environment.', 'info');
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (severityFilter === 'ALL') return true;
    return n.severity === severityFilter;
  });

  const getSeverityIcon = (severity: NotificationSeverity) => {
    switch (severity) {
      case 'high':
        return <ShieldAlert className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'low':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getSeverityBadgeClass = (severity: NotificationSeverity) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'warning':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'low':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'info':
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#151F30] border border-[#263449] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
            <span>SECURITY ALERTS</span>
            <span aria-hidden="true">·</span>
            <span>REAL-TIME NOTIFICATION DISPATCHER</span>
            <span aria-hidden="true">·</span>
            <span className="text-teal-400 font-mono">
              {unreadNotificationCount} Unread Alerts
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight mt-1">
            Notification Center
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xl">
            Live alerts generated from prototype security checks, link validations, and device connections.
          </p>
        </div>

        {unreadNotificationCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-[#101827] hover:bg-slate-800 border border-[#263449] text-xs font-semibold text-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Check className="w-4 h-4 text-teal-400" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Browser Notification Permission Banner (Honest OS vs Web Disclosure) */}
      <div className="p-4 rounded-2xl bg-[#151F30] border border-[#263449] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Browser Push Notifications</h4>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed max-w-xl mt-0.5">
              Receive alerts when web scans complete.
              <span className="text-slate-300 font-medium ml-1">
                Note: Browser notifications are not equivalent to native Android system protection or OS-level process hooks.
              </span>
            </p>
          </div>
        </div>

        <div className="shrink-0">
          {browserPermissionState === 'granted' ? (
            <span className="font-mono text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>Opted In</span>
            </span>
          ) : (
            <button
              onClick={requestBrowserPermission}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-950 rounded-xl transition-opacity cursor-pointer shadow-xs"
              style={{ backgroundColor: '#20D6B5' }}
            >
              Request Web Notification
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSeverityFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            severityFilter === 'ALL'
              ? 'bg-[#151F30] text-white font-bold border border-[#263449]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Alerts ({notifications.length})
        </button>
        <button
          onClick={() => setSeverityFilter('high')}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            severityFilter === 'high'
              ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          High Risk ({notifications.filter((n) => n.severity === 'high').length})
        </button>
        <button
          onClick={() => setSeverityFilter('warning')}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            severityFilter === 'warning'
              ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Warnings ({notifications.filter((n) => n.severity === 'warning').length})
        </button>
        <button
          onClick={() => setSeverityFilter('info')}
          className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
            severityFilter === 'info'
              ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Informational ({notifications.filter((n) => n.severity === 'info').length})
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#151F30] border border-[#263449] text-xs text-slate-500">
            No notifications match this filter.
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => markAsRead(notif.id)}
              className={`p-4 rounded-2xl border transition-all ${
                !notif.isRead
                  ? 'bg-[#151F30] border-[#263449] ring-1 ring-teal-500/30'
                  : 'bg-[#151F30]/60 border-[#263449]/70 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="mt-0.5 shrink-0">{getSeverityIcon(notif.severity)}</div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-white">{notif.title}</span>
                      <span
                        className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${getSeverityBadgeClass(
                          notif.severity
                        )}`}
                      >
                        {notif.severity}
                      </span>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-teal-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {notif.description}
                    </p>
                    {notif.relatedTarget && (
                      <div className="font-mono text-[11px] text-teal-400/90 truncate">
                        Target: {notif.relatedTarget}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {notif.timestamp}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="p-1 text-slate-500 hover:text-red-400 rounded-lg hover:bg-[#101827] transition-colors"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action shortcut button */}
              {notif.actionLabel && (
                <div className="mt-3 pt-2.5 border-t border-[#263449] flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notif.id);
                      if (notif.category === 'threat') setActiveSection('history');
                      else if (notif.category === 'permission') setActiveSection('settings');
                      else if (notif.category === 'device') setActiveSection('devices');
                    }}
                    className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{notif.actionLabel}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
