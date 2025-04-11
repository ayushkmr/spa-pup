export interface Puppy {
  id: number;
  name: string;
  ownerName: string;
  breed?: string;
  notes?: string;
  createdAt: string;
}

export interface WaitingListEntry {
  id: number;
  waitingListId: number;
  puppyId: number;
  serviceRequired: string;
  notes?: string;
  arrivalTime: string;
  scheduledTime?: string;
  position: number;
  serviced: boolean;
  isFutureBooking: boolean;
  createdAt: string;
  serviceTime?: string;
  status?: string; // 'waiting', 'completed', 'cancelled'
  puppy: Puppy;
}

export interface WaitingList {
  id: number;
  date: string;
  createdAt: string;
  entries: WaitingListEntry[];
}

export interface SearchResult extends WaitingListEntry {
  waitingList: {
    id: number;
    date: string;
    createdAt: string;
  };
}
