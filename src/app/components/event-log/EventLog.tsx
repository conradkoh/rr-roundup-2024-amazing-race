import { api } from '@convex/_generated/api';
import { useQuery } from 'convex/react';
import styles from './EventLog.module.scss';
import { useEffect, useState } from 'react';

type EventLogItem = {
  _id: string;
  icon: string;
  text: string;
};

type EventLogItemView = EventLogItem & { isNew: boolean };

export function EventLog() {
  const events: EventLogItem[] | undefined = useQuery(api.boss.eventLog);
  const [copyEvents, setCopyEvents] = useState<EventLogItemView[]>([]);
  useEffect(() => {
    setCopyEvents((prevEvents) => {
      const prevMap = prevEvents.reduce((state, item) => {
        state.set(item._id, item);
        return state;
      }, new Map<string, EventLogItemView>());
      if (!events) {
        return [];
      }
      return events?.map((e) => {
        const prevItem = prevMap.get(e._id);
        if (prevItem) {
          return {
            ...e,
            isNew: false,
          };
        } else {
          return {
            ...e,
            isNew: true,
          };
        }
      });
    });
  }, [events]);
  if (!events) return null;
  return (
    <div className={`game-font text-center`}>
      <h2 className="pt-2 text-2xl font-bold">Event Log</h2>
      <div
        className={`pt-8 px-5 flex flex-col gap-2 h-full ${styles['event-log-list']}`}
      >
        {copyEvents.map((e) => (
          <EventLogItem
            isNew={e.isNew}
            event={{ icon: e.icon, text: e.text }}
            key={e._id}
          />
        ))}
      </div>
    </div>
  );
}

type AnimationState = 'pending' | 'started' | 'finished';

export function EventLogItem(props: {
  isNew: boolean;
  event: { icon: string; text: string };
}) {
  const [animationState, setAnimationState] = useState<AnimationState>(
    props.isNew ? 'pending' : 'finished'
  );
  useEffect(() => {
    if (props.isNew) {
      setTimeout(() => setAnimationState('started'), 1); //this starts the animation
      setTimeout(() => setAnimationState('finished'), 1000); //this terminates the animation
    }
  }, [props.isNew]);
  if (animationState === 'pending') return null;
  return (
    <div
      className={`flex gap-2 items-center ${styles['list-item']} ${animationState === 'started' ? styles['new-item'] : ''}`}
    >
      <div className="w-10 h-10 bg-gray-200 rounded-full border- flex items-center justify-center">
        <div>{props.event.icon}</div>
      </div>
      <div className="text-sm">{props.event.text}</div>
    </div>
  );
}
