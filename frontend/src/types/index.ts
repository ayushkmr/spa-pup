export interface Puppy {
  id: number;
  name: string;
  ownerName: string;
  createdAt: string;
}

export interface WaitingListEntry {
  id: number;
  waitingListId: number;
  puppyId: number;
  serviceRequired: string;
  arrivalTime: string;
  position: number;
  serviced: boolean;
  createdAt: string;
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
